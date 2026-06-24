'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, User, LogOut, LayoutDashboard, Anchor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/hooks/useAuth';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/packages', label: 'Packages' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated } = useAuthStore();
  const logout = useLogout();

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const isHome = pathname === '/';

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled || !isHome ? 'bg-background/95 backdrop-blur-md border-b shadow-sm' : 'bg-transparent'
    )}>
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Anchor className={cn('w-7 h-7', isScrolled || !isHome ? 'text-godavari-500' : 'text-white')} />
          <span className={cn(isScrolled || !isHome ? 'text-foreground' : 'text-white')}>
            Papikondalu
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-godavari-500',
                  pathname === link.href ? 'text-godavari-500' : isScrolled || !isHome ? 'text-foreground/80' : 'text-white/90',
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={cn('p-2 rounded-full transition-colors hover:bg-white/10', isScrolled || !isHome ? '' : 'text-white')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link href={user.role === 'USER' ? '/dashboard' : '/admin/dashboard'}
                className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full bg-godavari-500 text-white hover:bg-godavari-600 transition-colors">
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
              <button onClick={() => logout.mutate()} className="p-2 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className={cn('text-sm font-medium transition-colors', isScrolled || !isHome ? 'text-foreground' : 'text-white')}>
                Sign In
              </Link>
              <Link href="/register" className="text-sm font-medium px-4 py-2 rounded-full bg-godavari-500 text-white hover:bg-godavari-600 transition-colors">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className={cn('md:hidden p-2', isScrolled || !isHome ? 'text-foreground' : 'text-white')}>
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-background border-b shadow-lg"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setIsMobileOpen(false)}
                  className={cn('block py-2 text-sm font-medium', pathname === link.href ? 'text-godavari-500' : 'text-foreground/80')}>
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t flex items-center gap-3">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsMobileOpen(false)} className="text-sm text-godavari-500 font-medium">Dashboard</Link>
                    <button onClick={() => { logout.mutate(); setIsMobileOpen(false); }} className="text-sm text-red-500">Logout</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMobileOpen(false)} className="text-sm text-foreground/80">Sign In</Link>
                    <Link href="/register" onClick={() => setIsMobileOpen(false)} className="text-sm px-3 py-1 bg-godavari-500 text-white rounded-full">Register</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
