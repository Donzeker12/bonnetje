import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { storeRequestApi } from '../lib/api';
import { StoreRequest, User } from '../types/models';
import PageHeader from '../components/PageHeader';

interface AdminPageProps {
  auth: {
    user: User | null;
  };
}

export default function AdminPage({ auth }: AdminPageProps) {
  const [requests, setRequests] = useState<StoreRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isAdmin = auth.user?.role === 'admin';

  const loadRequests = async (status: 'pending' | 'approved' | 'rejected' | 'all' = statusFilter) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await storeRequestApi.getAdminRequests(status);
      setRequests(response.data.data || []);
    } catch (error: any) {
      console.error('Error loading store requests:', error);
      setErrorMessage(error?.response?.data?.message || 'Kon aanvragen niet laden.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadRequests(statusFilter);
    }
  }, [isAdmin, statusFilter]);

  const approveRequest = async (requestId: number) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await storeRequestApi.approve(requestId);
      setSuccessMessage('Aanvraag goedgekeurd en winkel toegevoegd.');
      setRequests((current) => current.filter((item) => item.id !== requestId));
    } catch (error: any) {
      console.error('Error approving request:', error);
      setErrorMessage(error?.response?.data?.message || 'Goedkeuren mislukt.');
    }
  };

  const rejectRequest = async (requestId: number) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await storeRequestApi.reject(requestId);
      setSuccessMessage('Aanvraag afgekeurd.');
      setRequests((current) => current.filter((item) => item.id !== requestId));
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      setErrorMessage(error?.response?.data?.message || 'Afkeuren mislukt.');
    }
  };

  return (
    <>
      <Head title="Admin Paneel" />
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-100">
        <PageHeader title="Admin Paneel" maxWidthClass="max-w-6xl" backLabel="Dashboard" />

        <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {!isAdmin ? (
            <div className="bg-white rounded-xl shadow p-6 text-red-700">
              Je bent niet ingelogd als admin.
            </div>
          ) : (
            <div className="space-y-6">
              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm">
                  {successMessage}
                </div>
              )}

              <div className="bg-white rounded-xl shadow p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Winkel aanvragen beheren</h2>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'pending' | 'approved' | 'rejected' | 'all')}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="pending">Open aanvragen</option>
                    <option value="approved">Goedgekeurd</option>
                    <option value="rejected">Afgekeurd</option>
                    <option value="all">Alles</option>
                  </select>
                </div>

                <div className="mt-4">
                  {loading ? (
                    <p className="text-sm text-gray-500">Aanvragen laden...</p>
                  ) : requests.length === 0 ? (
                    <p className="text-sm text-gray-500">Geen aanvragen gevonden.</p>
                  ) : (
                    <div className="space-y-3">
                      {requests.map((requestItem) => (
                        <div key={requestItem.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="font-semibold text-gray-900">
                                {requestItem.chain} - {requestItem.name}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {requestItem.address}, {requestItem.postal_code} {requestItem.city} ({requestItem.country_code}/{requestItem.currency_code})
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Aangevraagd door: {requestItem.requested_by?.name || `User ${requestItem.requested_by_user_id}`}
                              </div>
                              {requestItem.admin_notes && (
                                <div className="text-xs text-gray-600 mt-2 italic">Opmerking: {requestItem.admin_notes}</div>
                              )}
                            </div>
                            <div className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-700 uppercase">
                              {requestItem.status}
                            </div>
                          </div>

                          {requestItem.status === 'pending' && (
                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={() => approveRequest(requestItem.id)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                              >
                                Goedkeuren
                              </button>
                              <button
                                onClick={() => rejectRequest(requestItem.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                              >
                                Afkeuren
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
