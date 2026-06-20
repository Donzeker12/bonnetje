import { useState, useEffect } from 'react';

export default function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.ready.then((reg) => {
      setRegistration(reg);

      // Check for updates periodically
      const interval = setInterval(() => {
        reg.update();
      }, 60 * 60 * 1000); // Check every hour

      return () => clearInterval(interval);
    });

    // Listen for new service worker waiting
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      setShowUpdate(true);
    });

    // Check if there's already an update waiting
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg?.waiting) {
        setShowUpdate(true);
        setRegistration(reg);
      }
    });
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-indigo-600 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🔄</div>
          <div>
            <div className="font-semibold">Nieuwe versie beschikbaar!</div>
            <div className="text-sm text-indigo-100">
              Klik op "Update" om de laatste versie te gebruiken
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowUpdate(false)}
            className="px-4 py-2 text-white hover:bg-indigo-700 rounded-lg font-semibold transition"
          >
            Later
          </button>
          <button
            onClick={handleUpdate}
            className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition"
          >
            Update Nu
          </button>
        </div>
      </div>
    </div>
  );
}
