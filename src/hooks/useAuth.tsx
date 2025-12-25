"use client";

import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";

interface UseAuthReturn {
    session: Session | null;
    user: User | null;
    isLoading: boolean;
    isLoggedIn: boolean;
    signOut: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const refreshSession = useCallback(async () => {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
    }, [supabase]);

    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            try {
                const { data } = await supabase.auth.getSession();
                if (mounted) {
                    setSession(data.session);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        initAuth();

        const { data: subscription } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (mounted) {
                    setSession(session);
                }
            }
        );

        return () => {
            mounted = false;
            subscription.subscription.unsubscribe();
        };
    }, [supabase]);

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        setSession(null);
        router.push("/");
        router.refresh();
    }, [supabase, router]);

    return {
        session,
        user: session?.user ?? null,
        isLoading,
        isLoggedIn: !!session,
        signOut,
        refreshSession,
    };
}

export default useAuth;
