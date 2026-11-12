'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/providers';

export default function LogoutPage() {
    const { signOut } = useAuth();

    useEffect(() => {
        signOut();
    }, [signOut]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Cerrando sesión...</h1>
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            </div>
        </div>
    );
}
