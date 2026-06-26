import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis | null = null;
  private connected = false;
  private readonly logger = new Logger(RedisService.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD') || undefined,
      lazyConnect: true,
      retryStrategy: (times) => {
        if (times > 3) return null; // stop retrying after 3 attempts
        return Math.min(times * 200, 1000);
      },
      enableOfflineQueue: false,
    });

    this.client.on('connect', () => {
      this.connected = true;
      this.logger.log('Redis connected');
    });

    this.client.on('error', () => {
      // suppress repeated error logs — just mark as disconnected
      this.connected = false;
    });

    this.client.connect().then(() => {
      this.connected = true;
    }).catch(() => {
      this.connected = false;
      this.logger.warn('Redis not available — running without cache');
    });
  }

  async onModuleDestroy() {
    if (this.client && this.connected) {
      await this.client.quit().catch(() => {});
    }
  }

  private ok(): boolean {
    return this.connected && this.client !== null;
  }

  async get(key: string): Promise<string | null> {
    if (!this.ok()) return null;
    try { return await this.client!.get(key); } catch { return null; }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!this.ok()) return;
    try {
      if (ttlSeconds) {
        await this.client!.set(key, value, 'EX', ttlSeconds);
      } else {
        await this.client!.set(key, value);
      }
    } catch { /* ignore */ }
  }

  async del(key: string): Promise<void> {
    if (!this.ok()) return;
    try { await this.client!.del(key); } catch { /* ignore */ }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.ok()) return false;
    try { return (await this.client!.exists(key)) === 1; } catch { return false; }
  }

  async setJson(key: string, value: any, ttlSeconds?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }

  async getJson<T>(key: string): Promise<T | null> {
    const val = await this.get(key);
    return val ? JSON.parse(val) : null;
  }

  async invalidatePattern(pattern: string): Promise<void> {
    if (!this.ok()) return;
    try {
      const keys = await this.client!.keys(pattern);
      if (keys.length > 0) await this.client!.del(...keys);
    } catch { /* ignore */ }
  }
}
