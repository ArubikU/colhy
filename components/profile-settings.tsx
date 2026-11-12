
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './providers';

interface Profile {
  user_id: string;
  role: 'consultant' | 'client';
  company_name?: string;
  hourly_rate?: number;
  bio?: string;
}

export function ProfileSettings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/profiles');
      if (response.ok) {
        const data = await response.json();
        setProfile({
          user_id: data.user_id,
          role: data.role || 'consultant',
          company_name: data.company_name,
          hourly_rate: data.hourly_rate,
          bio: data.bio
        });
      } else {
        // Default profile logic for new users
        if (response.status === 404) {
          const newProfile: Profile = {
            user_id: user.id, // user.id comes from auth provider, ensure it matches
            role: 'consultant',
            company_name: '',
            hourly_rate: 0,
            bio: '',
          };
          setProfile(newProfile);
        } else {
          console.error('Failed to fetch profile', await response.text());
        }
      }
    } catch (error) {
      console.error('[Colhy] Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    setSaving(true);
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      if (!response.ok) throw new Error('Failed to save');

      setMessage('Perfil actualizado exitosamente');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('[Colhy] Error saving profile:', error);
      setMessage('Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-slate-600">Cargando perfil...</div>;
  }

  if (!profile) {
    return <div className="text-slate-600">Error al cargar el perfil</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Mi Perfil</h3>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Tipo de Cuenta
        </label>
        <select
          value={profile.role}
          onChange={(e) =>
            setProfile((prev) =>
              prev ? { ...prev, role: e.target.value as 'consultant' | 'client' } : null
            )
          }
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="consultant">Consultor</option>
          <option value="client">Cliente</option>
        </select>
      </div>

      {profile.role === 'consultant' && (
        <>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre de Empresa
            </label>
            <input
              type="text"
              value={profile.company_name || ''}
              onChange={(e) =>
                setProfile((prev) =>
                  prev ? { ...prev, company_name: e.target.value } : null
                )
              }
              placeholder="Mi Consultoría"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tarifa Horaria Base (USD)
            </label>
            <input
              type="number"
              value={profile.hourly_rate || ''}
              onChange={(e) =>
                setProfile((prev) =>
                  prev ? { ...prev, hourly_rate: parseFloat(e.target.value) || 0 } : null
                )
              }
              min="0"
              step="10"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Biografía Profesional
            </label>
            <textarea
              value={profile.bio || ''}
              onChange={(e) =>
                setProfile((prev) => (prev ? { ...prev, bio: e.target.value } : null))
              }
              placeholder="Cuéntanos sobre tu experiencia y especialidades..."
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {message}
        </div>
      )}

      <button
        onClick={handleSaveProfile}
        disabled={saving}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
      >
        {saving ? 'Guardando...' : 'Guardar Cambios'}
      </button>
    </div>
  );
}
