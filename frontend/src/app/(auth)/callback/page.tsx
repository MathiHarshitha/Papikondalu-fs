'use client';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

function CallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { setTokens, setUser } = useAuthStore();

  useEffect(() => {
    const token = params.get('token');
    const refresh = params.get('refresh');
    if (!token || !refresh) {
      router.push('/login');
      return;
    }

    setTokens(token, refresh);
    api
      .get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        setUser(r.data.data);
        const role = r.data.data.role;
        router.push(role === 'USER' ? '/dashboard' : '/admin/dashboard');
      })
      .catch(() => router.push('/login'));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-godavari-500 mx-auto" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-godavari-500" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
