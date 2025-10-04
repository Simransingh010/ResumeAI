'use client';
import { useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Fix: Await via .then()—resolve the Promise first
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      // Optional: Handle error (e.g., network issue)
      if (error) {
        console.error('Session check failed:', error.message);
        return;
      }
      
      // Now destructure safely—session is Session | null
      if (session) {
        router.push('/');
      }
    });
  }, [supabase, router]);  // Dependencies: Re-run if these change

  // Ripple spawner on the background grid
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let mounted = true;
    const spawn = () => {
      if (!mounted) return;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = container.getBoundingClientRect();
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;  
      container.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    };
    const id = window.setInterval(spawn, 2400);
    spawn();
    return () => {
      mounted = false;
      window.clearInterval(id);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-grid" ref={containerRef} aria-hidden />
      <div className="relative z-10 bg-white p-8 rounded-lg shadow-md w-full max-w-md dark:bg-gray-900 dark:border dark:border-gray-800">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">Sign In to ATS Checker</h1>
        <Auth
          supabaseClient={supabase}
          providers={['google']}  // Restrict to Google only
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#2563eb',  // Matches Tailwind blue
                  brandAccent: '#1d4ed8',
                },
              },
            },
          }}
          view="sign_in"
        />
        <p className="text-center text-sm text-gray-500 mt-4">
          No account? Google will create one automatically.
        </p>
      </div>
    </div>
  );
}