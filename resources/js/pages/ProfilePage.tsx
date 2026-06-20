import { useState, useEffect } from 'react';
import { gamificationApi, priceApi } from '../lib/api';
import { User, Badge, UserPoints } from '../types/models';
import { Link, router } from '@inertiajs/react';
import PageHeader from '../components/PageHeader';

interface ProfilePageProps {
  auth: {
    user: User | null;
  };
}

interface ProfileData {
  user: User;
  points: UserPoints;
  badges: {
    earned: Badge[];
    available: Badge[];
    locked: Badge[];
  };
  stats: {
    total_scans: number;
    total_prices: number;
    total_verifications: number;
    member_since: string;
  };
}

export default function ProfilePage({ auth }: ProfilePageProps) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: auth.user?.name || '',
    city: auth.user?.city || '',
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setIsLoading(true);
    
    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn('Profile data loading timeout');
      setIsLoading(false);
      // Set fallback data on timeout
      setProfileData({
        user: auth.user!,
        points: auth.user!.points || { total_points: 0, city: auth.user!.city },
        badges: {
          earned: [],
          available: [],
          locked: [],
        },
        stats: {
          total_scans: 0,
          total_prices: 0,
          total_verifications: 0,
          member_since: auth.user!.created_at || new Date().toISOString(),
        },
      });
    }, 5000); // 5 second timeout

    try {
      // Load data with fallbacks
      let badgesData = {
        earned: [],
        available: [],
        locked: [],
      };
      let statsData = {
        total_scans: 0,
        total_prices: 0,
        total_verifications: 0,
      };

      try {
        const badgesResponse = await gamificationApi.getBadges();
        // The API returns all badges, we need to categorize them
        const allBadges = badgesResponse.data;
        
        // For now, just show all badges as earned if user has them
        // TODO: Implement proper badge checking based on user's badges relationship
        badgesData = {
          earned: auth.user?.badges || [],
          available: [],
          locked: Array.isArray(allBadges) ? allBadges.slice(0, 6) : [],
        };
      } catch (error) {
        console.error('Error loading badges:', error);
      }

      try {
        const statsResponse = await priceApi.getStatistics();
        statsData = {
          total_scans: statsResponse.data.total_scans || 0,
          total_prices: statsResponse.data.total_prices || 0,
          total_verifications: statsResponse.data.total_verifications || 0,
        };
      } catch (error) {
        console.error('Error loading statistics:', error);
      }

      clearTimeout(timeout);
      
      setProfileData({
        user: auth.user!,
        points: auth.user!.points || { total_points: 0, city: auth.user!.city },
        badges: badgesData,
        stats: {
          ...statsData,
          member_since: auth.user!.created_at || new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      clearTimeout(timeout);
      // Set fallback data even on error
      setProfileData({
        user: auth.user!,
        points: auth.user!.points || { total_points: 0, city: auth.user!.city },
        badges: {
          earned: [],
          available: [],
          locked: [],
        },
        stats: {
          total_scans: 0,
          total_prices: 0,
          total_verifications: 0,
          member_since: auth.user!.created_at || new Date().toISOString(),
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    // TODO: Implement profile update API call
    console.log('Save profile:', editForm);
    setIsEditing(false);
  };

  if (isLoading || !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-xl text-gray-600">Profiel laden...</div>
        </div>
      </div>
    );
  }

  const { user, points, badges, stats } = profileData;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={<><span className="hidden sm:inline">👤 Mijn Profiel</span><span className="sm:hidden">👤 Profiel</span></>}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                  {user.name.charAt(0)}
                </div>
                
                {isEditing ? (
                  <div className="space-y-3 mb-4">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full border rounded px-3 py-2 text-center"
                      placeholder="Naam"
                    />
                    <input
                      type="text"
                      value={editForm.city}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      className="w-full border rounded px-3 py-2 text-center"
                      placeholder="Stad"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveProfile}
                        className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded font-semibold hover:bg-indigo-700"
                      >
                        Opslaan
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({ name: user.name, city: user.city || '' });
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-300"
                      >
                        Annuleer
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {user.name}
                    </h2>
                    <p className="text-gray-600 mb-1">{user.email}</p>
                    {user.city && (
                      <p className="text-sm text-gray-500 mb-4">
                        📍 {user.city}
                      </p>
                    )}
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      ✏️ Profiel Bewerken
                    </button>
                  </>
                )}
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Level</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {user.level || 1}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Punten</span>
                  <span className="text-2xl font-bold text-green-600">
                    {points.total_points}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                📊 Statistieken
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span className="text-gray-700">📱 Scans</span>
                  <span className="font-bold text-blue-600">{stats.total_scans}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span className="text-gray-700">💰 Prijzen</span>
                  <span className="font-bold text-green-600">{stats.total_prices}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                  <span className="text-gray-700">✅ Verificaties</span>
                  <span className="font-bold text-purple-600">{stats.total_verifications}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">📅 Lid sinds</span>
                  <span className="font-bold text-gray-600">
                    {new Date(stats.member_since).toLocaleDateString('nl-NL', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Badges & Achievements */}
          <div className="lg:col-span-2">
            {/* Earned Badges */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                🏆 Mijn Badges ({badges.earned.length})
              </h3>
              {badges.earned.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {badges.earned.map((badge) => (
                    <div
                      key={badge.id}
                      className="bg-linear-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-4 text-center"
                    >
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <div className="font-bold text-gray-900 mb-1">
                        {badge.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {badge.description}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🎯</div>
                  <p>Je hebt nog geen badges verdiend</p>
                  <Link
                    href="/scan"
                    className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700"
                  >
                    Start met Scannen
                  </Link>
                </div>
              )}
            </div>

            {/* Available Badges */}
            {badges.available.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  🎯 Bijna Verdiend
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {badges.available.map((badge) => (
                    <div
                      key={badge.id}
                      className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center"
                    >
                      <div className="text-4xl mb-2 opacity-75">{badge.icon}</div>
                      <div className="font-bold text-gray-900 mb-1">
                        {badge.name}
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {badge.description}
                      </div>
                      <div className="text-xs font-semibold text-blue-600">
                        Nog {badge.requirement} nodig!
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Locked Badges */}
            {badges.locked.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  🔒 Nog te Ontgrendelen
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {badges.locked.map((badge) => (
                    <div
                      key={badge.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center opacity-60"
                    >
                      <div className="text-3xl mb-1 grayscale">{badge.icon}</div>
                      <div className="text-xs font-bold text-gray-700">
                        {badge.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {badge.requirement}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            🚀 Snelle Acties
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              href="/scan"
              className="bg-indigo-600 text-white p-4 rounded-lg text-center font-semibold hover:bg-indigo-700 transition"
            >
              📱 Scan Product
            </Link>
            <Link
              href="/products"
              className="bg-purple-600 text-white p-4 rounded-lg text-center font-semibold hover:bg-purple-700 transition"
            >
              🔍 Zoek Producten
            </Link>
            <Link
              href="/shopping-list"
              className="bg-green-600 text-white p-4 rounded-lg text-center font-semibold hover:bg-green-700 transition"
            >
              📝 Boodschappenlijst
            </Link>
            <Link
              href="/leaderboard"
              className="bg-orange-600 text-white p-4 rounded-lg text-center font-semibold hover:bg-orange-700 transition"
            >
              🏆 Leaderboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
