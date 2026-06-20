import { useState, useEffect } from 'react';
import { gamificationApi } from '../lib/api';
import { LeaderboardEntry, Badge, User } from '../types/models';
import PageHeader from '../components/PageHeader';

interface LeaderboardPageProps {
  auth: {
    user: User | null;
  };
}

export default function LeaderboardPage({ auth }: LeaderboardPageProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [badges, setBadges] = useState<{ earned: Badge[]; available: Badge[]; locked: Badge[] } | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(auth.user?.city || null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadLeaderboard();
    loadBadges();
    loadProfile();
  }, [selectedCity]);

  const loadLeaderboard = async () => {
    try {
      const response = await gamificationApi.getLeaderboard(selectedCity || undefined, 50);
      setLeaderboard(response.data.leaderboard);
      setUserRank(response.data.user_rank);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const loadBadges = async () => {
    try {
      const response = await gamificationApi.getBadges();
      setBadges(response.data);
    } catch (error) {
      console.error('Error loading badges:', error);
    }
  };

  const loadProfile = async () => {
    try {
      const response = await gamificationApi.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'scan_count': return '📷';
      case 'verification_count': return '✅';
      case 'total_points': return '⭐';
      case 'city_hero': return '🏆';
      default: return '🎖️';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100">
      <PageHeader
        title={<><span className="hidden sm:inline">🏆 Leaderboard & Achievements</span><span className="sm:hidden">🏆 Leaderboard</span></>}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* User Stats Card */}
        {profile && (
          <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-8 mb-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-indigo-600 text-4xl font-bold">
                {auth.user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{auth.user.name}</h2>
                <div className="flex gap-6 text-lg">
                  <div>
                    <div className="text-indigo-200">Level</div>
                    <div className="font-bold">{profile.user.level}</div>
                  </div>
                  <div>
                    <div className="text-indigo-200">Punten</div>
                    <div className="font-bold">{profile.stats.total_points?.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-indigo-200">Scans</div>
                    <div className="font-bold">{profile.stats.total_scans}</div>
                  </div>
                  <div>
                    <div className="text-indigo-200">Badges</div>
                    <div className="font-bold">{profile.stats.badges_count}</div>
                  </div>
                  <div>
                    <div className="text-indigo-200">Rank</div>
                    <div className="font-bold">#{profile.stats.rank}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">🏆 Top Scanners</h2>
                <select
                  value={selectedCity || ''}
                  onChange={(e) => setSelectedCity(e.target.value || null)}
                  className="border rounded-lg px-4 py-2"
                >
                  <option value="">Nederland</option>
                  {auth.user?.city && <option value={auth.user.city}>{auth.user.city}</option>}
                </select>
              </div>
            </div>

            <div className="p-6">
              {leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => {
                    const isCurrentUser = entry.user.id === auth.user?.id;
                    const rankClass = index === 0 ? 'bg-yellow-50 border-2 border-yellow-400' :
                                     index === 1 ? 'bg-gray-50 border-2 border-gray-300' :
                                     index === 2 ? 'bg-orange-50 border-2 border-orange-300' :
                                     isCurrentUser ? 'bg-indigo-50 border-2 border-indigo-300' :
                                     'bg-white';

                    return (
                      <div
                        key={entry.user.id}
                        className={`flex items-center gap-4 p-4 rounded-lg ${rankClass}`}
                      >
                        <div className="text-3xl font-bold w-12 text-center">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                        <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                          {entry.user.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-lg">
                            {entry.user.name}
                            {isCurrentUser && <span className="ml-2 text-sm text-indigo-600">(jij!)</span>}
                          </div>
                          <div className="text-sm text-gray-600">
                            Level {entry.user.level} · {entry.scans_count} scans · {entry.verifications_count} verificaties
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-indigo-600">
                            {entry.total_points.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">punten</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Geen data beschikbaar. Start met scannen!
                </p>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-6">
            {/* Earned Badges */}
            {badges && badges.earned.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">🎖️ Behaalde Badges</h3>
                <div className="space-y-3">
                  {badges.earned.map((badge) => (
                    <div key={badge.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-3xl">{getBadgeIcon(badge.type)}</div>
                      <div className="flex-1">
                        <div className="font-semibold">{badge.name}</div>
                        <div className="text-xs text-gray-600">{badge.description}</div>
                      </div>
                      <div className="text-green-600 text-2xl">✓</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Badges */}
            {badges && badges.available.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">🎯 Bijna Behaald!</h3>
                <div className="space-y-3">
                  {badges.available.map((badge) => (
                    <div key={badge.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="text-3xl opacity-70">{getBadgeIcon(badge.type)}</div>
                      <div className="flex-1">
                        <div className="font-semibold">{badge.name}</div>
                        <div className="text-xs text-gray-600">{badge.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Locked Badges */}
            {badges && badges.locked.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">🔒 Vergrendeld</h3>
                <div className="space-y-3">
                  {badges.locked.slice(0, 5).map((badge) => (
                    <div key={badge.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-3xl opacity-30">{getBadgeIcon(badge.type)}</div>
                      <div className="flex-1 opacity-70">
                        <div className="font-semibold">{badge.name}</div>
                        <div className="text-xs text-gray-600">
                          {badge.requirement} {badge.type.replace('_', ' ')} nodig
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Activity Chart Placeholder */}
        {profile && profile.stats.scans_by_day && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">📊 Jouw Activiteit (Laatste 30 Dagen)</h3>
            <div className="h-48 flex items-end gap-2">
              {profile.stats.scans_by_day.map((day: any, index: number) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-indigo-600 rounded-t"
                    style={{ height: `${Math.max(10, (day.count / Math.max(...profile.stats.scans_by_day.map((d: any) => d.count))) * 100)}%` }}
                  />
                  <div className="text-xs text-gray-500 mt-1">{day.count}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
