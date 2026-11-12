'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers';
import { ProfileSettings } from '@/components/profile-settings';
import { APIConfig } from '@/components/api-config';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/auth');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Configuración</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-slate-700 hover:text-slate-900 font-medium"
            >
              ← Volver al Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* User Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Información de Cuenta</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <p className="text-slate-900 font-mono">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">ID de Usuario</label>
                <p className="text-slate-900 font-mono text-sm">{user.id}</p>
              </div>
            </div>
          </div>

          {/* Profile Settings */}
          <ProfileSettings />

          {/* API Configuration */}
          <APIConfig />

          {/* Security Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Seguridad</h2>
            <div className="space-y-4">
              <p className="text-slate-600 text-sm">
                Las API Keys se usan directamente desde tu navegador y nunca se almacenan en nuestros servidores.
              </p>
              <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">
                Cambiar Contraseña
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-red-900 mb-4">Zona de Peligro</h2>
            <div className="space-y-4">
              <p className="text-red-700 text-sm">
                Estas acciones no se pueden deshacer.
              </p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Eliminar Cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
