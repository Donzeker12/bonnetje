import '../css/app.css';

import { createRoot, hydrateRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import axios from 'axios';

const appName = import.meta.env.VITE_APP_NAME || 'Bonnetje';

// Configure axios to include CSRF token from meta tag (only in browser)
if (typeof window !== 'undefined') {
    const token = document.head.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
    if (token) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
    } else {
        console.error('CSRF token not found');
    }

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                    
                    // Check for updates every hour
                    setInterval(() => {
                        registration.update();
                    }, 60 * 60 * 1000);
                })
                .catch(error => {
                    console.error('SW registration failed:', error);
                });
        });

        // Listen for service worker updates
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('New service worker activated');
            // Optionally show update notification
            if (confirm('Er is een nieuwe versie beschikbaar. Wil je de app herladen?')) {
                window.location.reload();
            }
        });
    }
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        // Only create root if we're in the browser
        if (typeof window !== 'undefined') {
            // Check if SSR hydration is needed
            if (el.dataset.page) {
                hydrateRoot(el, <App {...props} />);
            } else {
                createRoot(el).render(<App {...props} />);
            }
        }
    },
    progress: {
        color: '#4f46e5',
    },
});
