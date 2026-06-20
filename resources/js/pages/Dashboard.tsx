import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { productApi, priceApi, storeApi, gamificationApi } from '../lib/api';
import { Product, Store, LeaderboardEntry, User } from '../types/models';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import UpdateNotification from '../components/UpdateNotification';

interface DashboardProps {
  auth: {
    user: User | null;
  };
}

export default function Dashboard({ auth }: DashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [nearbyStores, setNearbyStores] = useState<Store[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Laad statistieken
      const statsResponse = await priceApi.getStatistics(auth.user?.city || undefined);
      setStats(statsResponse.data);

      // Laad leaderboard
      const leaderboardResponse = await gamificationApi.getLeaderboard(auth.user?.city || undefined, 5);
      setLeaderboard(leaderboardResponse.data.leaderboard);
      setUserRank(leaderboardResponse.data.user_rank);

      // Laad winkels in de buurt (als locatie beschikbaar)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const storesResponse = await storeApi.getNearby(
            position.coords.latitude,
            position.coords.longitude,
            5
          );
          setNearbyStores(storesResponse.data);
        });
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              🛒 Bonnetje
            </h1>
            {auth.user && (
              <div className="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-2 sm:gap-4">
                {/* User info - hide until larger screens to prevent cramped header */}
                <div className="hidden xl:block text-right">
                  <p className="text-sm text-gray-600">{auth.user.name}</p>
                  <p className="text-xs text-indigo-600">Level {auth.user.level}</p>
                </div>
                {/* Avatar */}
                <button
                  onClick={() => router.visit('/profile')}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold hover:bg-indigo-700 transition cursor-pointer"
                  title="Mijn Profiel"
                >
                  {auth.user.name.charAt(0)}
                </button>
                {auth.user.role === 'admin' && (
                  <button
                    onClick={() => router.visit('/admin')}
                    className="text-indigo-600 hover:text-indigo-800 px-2 sm:px-3 py-2 rounded-lg hover:bg-indigo-50 font-medium text-sm transition"
                    title="Admin Paneel"
                  >
                    Admin
                  </button>
                )}
                {/* Logout button - abbreviated on mobile, full text on desktop */}
                <button
                  onClick={() => router.post('/logout')}
                  className="text-gray-600 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 font-medium text-sm transition"
                  title="Uitloggen"
                >
                  <span className="hidden md:inline">Uitloggen</span>
                  <span className="md:hidden">Uit</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mb-8">
          <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            De échte prijzen in jouw supermarkt 🎯
          </h2>
          <p className="text-base sm:text-xl text-gray-600 mb-4 sm:mb-6">
            Community-gedreven prijsvergelijking voor Nederland. 
            Scan, vergelijk, en bespaar!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            <button
              onClick={() => router.visit('/products')}
              className="w-full min-w-0 bg-purple-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              🔍 Zoek Producten
            </button>
            <button
              onClick={() => router.visit('/scan')}
              className="w-full min-w-0 bg-indigo-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              📱 Start met Scannen
            </button>
            <button
              onClick={() => router.visit('/shopping-list')}
              className="w-full min-w-0 bg-green-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-green-700 transition wrap-break-word"
            >
              📝 Mijn Boodschappen-lijst
            </button>
            <button
              onClick={() => router.visit('/folder-actions')}
              className="w-full min-w-0 bg-orange-500 text-white px-5 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              🧾 Actie Folder Upload
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          {stats && (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-500 text-sm mb-2">Totaal Prijzen</div>
                <div className="text-3xl font-bold text-indigo-600">
                  {stats.total_prices?.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.verified_prices} geverifieerd
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-500 text-sm mb-2">Deze Week</div>
                <div className="text-3xl font-bold text-green-600">
                  {stats.prices_last_week?.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">nieuwe scans</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-500 text-sm mb-2">Actieve Scanners</div>
                <div className="text-3xl font-bold text-orange-600">
                  {stats.active_scanners}
                </div>
                <div className="text-xs text-gray-500 mt-1">deze week</div>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Leaderboard */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              🏆 Leaderboard {auth.user?.city && `- ${auth.user.city}`}
            </h3>
            {leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.user.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-gray-50"
                  >
                    <div className="text-2xl font-bold text-gray-400 w-8">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{entry.user.name}</div>
                      <div className="text-sm text-gray-500">
                        Level {entry.user.level} · {entry.scans_count} scans
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-indigo-600">
                        {entry.total_points}
                      </div>
                      <div className="text-xs text-gray-500">punten</div>
                    </div>
                  </div>
                ))}
                {userRank && userRank > 5 && (
                  <div className="border-t pt-3 mt-3">
                    <div className="text-sm text-gray-600 text-center">
                      Jouw positie: #{userRank}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Geen data beschikbaar. Wees de eerste!
              </p>
            )}
          </div>

          {/* Nearby Stores */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              📍 Winkels in de Buurt
            </h3>
            {nearbyStores.length > 0 ? (
              <div className="space-y-3">
                {nearbyStores.slice(0, 5).map((store) => (
                  <div
                    key={store.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => router.visit(`/stores/${store.id}`)}
                  >
                    <div className="text-2xl">🏪</div>
                    <div className="flex-1">
                      <div className="font-semibold">{store.chain}</div>
                      <div className="text-sm text-gray-500">{store.address}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-indigo-600">
                        {store.distance?.toFixed(1)} km
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Schakel locatiediensten in om winkels te zien
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => router.visit('/products')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center"
          >
            <div className="text-4xl mb-2">🔍</div>
            <div className="font-semibold">Zoek Producten</div>
          </button>

          <button
            onClick={() => router.visit('/scan')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center"
          >
            <div className="text-4xl mb-2">📷</div>
            <div className="font-semibold">Scan Barcode</div>
          </button>

          <button
            onClick={() => router.visit('/leaderboard')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center"
          >
            <div className="text-4xl mb-2">🏅</div>
            <div className="font-semibold">Leaderboard</div>
          </button>

          <button
            onClick={() => router.visit('/profile')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center"
          >
            <div className="text-4xl mb-2">👤</div>
            <div className="font-semibold">Mijn Profiel</div>
          </button>
        </div>
      </main>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Update Notification */}
      <UpdateNotification />
    </div>
  );
}
