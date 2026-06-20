import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import PWAInstallPrompt from '../components/PWAInstallPrompt';

interface AndroidReleaseInfo {
    version: string;
    build: string;
    published_at: string;
    apk: {
        url: string;
        filename: string;
        versioned_url: string;
    };
    aab: {
        url: string;
        filename: string;
        versioned_url: string;
    };
}

export default function Welcome() {
    const [androidRelease, setAndroidRelease] = useState<AndroidReleaseInfo | null>(null);

    useEffect(() => {
        let active = true;

        const loadAndroidRelease = async () => {
            try {
                const response = await fetch('/downloads/android-release.json', {
                    headers: {
                        Accept: 'application/json',
                    },
                });

                if (!response.ok) {
                    return;
                }

                const data = (await response.json()) as AndroidReleaseInfo;
                if (active) {
                    setAndroidRelease(data);
                }
            } catch {
                // Hide release metadata block when no published Android release exists yet.
            }
        };

        loadAndroidRelease();

        return () => {
            active = false;
        };
    }, []);

    return (
        <>
            <Head title="Welcome to Bonnetje" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
                <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16 text-center">
                    <div className="mb-8">
                        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-4">
                            🛒 Bonnetje
                        </h1>
                        <p className="text-lg sm:text-2xl text-gray-600 mb-2">
                            De eerste community-gestuurde boodschappen-app van Nederland
                        </p>
                        <p className="text-base sm:text-lg text-gray-500">
                            Ontdek de échte prijzen in jouw supermarkt
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                            Hoe werkt het?
                        </h2>
                        
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="p-6 bg-indigo-50 rounded-lg">
                                <div className="text-4xl mb-4">📷</div>
                                <h3 className="font-bold text-lg mb-2">1. Scan</h3>
                                <p className="text-gray-600 text-sm">
                                    Scan barcodes en upload kassabonnen in jouw lokale supermarkt
                                </p>
                            </div>

                            <div className="p-6 bg-green-50 rounded-lg">
                                <div className="text-4xl mb-4">💰</div>
                                <h3 className="font-bold text-lg mb-2">2. Vergelijk</h3>
                                <p className="text-gray-600 text-sm">
                                    Zie direct welke winkel het goedkoopst is voor jouw boodschappenlijst
                                </p>
                            </div>

                            <div className="p-6 bg-purple-50 rounded-lg">
                                <div className="text-4xl mb-4">🏆</div>
                                <h3 className="font-bold text-lg mb-2">3. Verdien</h3>
                                <p className="text-gray-600 text-sm">
                                    Verzamel punten, badges en klim op het leaderboard
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => router.visit('/dashboard')}
                                className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition shadow-lg"
                            >
                                🚀 Start Gratis (Web)
                            </button>
                            <a
                                href={androidRelease?.apk.url || '/downloads/bonnetje-latest.apk'}
                                className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-emerald-700 transition shadow-lg flex items-center justify-center gap-2"
                            >
                                🤖 Android App (APK)
                            </a>
                        </div>

                        <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-left">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <div className="text-sm font-semibold text-emerald-800">Android Release</div>
                                    <div className="text-sm text-emerald-900">
                                        {androidRelease
                                            ? `Versie ${androidRelease.version} (build ${androidRelease.build})`
                                            : 'Nog geen gepubliceerde release metadata gevonden'}
                                    </div>
                                    <div className="text-xs text-emerald-700 mt-1">
                                        {androidRelease
                                            ? `Gepubliceerd: ${new Date(androidRelease.published_at).toLocaleString('nl-NL')}`
                                            : 'Draai de release publish-stap om APK en AAB publiek te zetten.'}
                                    </div>
                                </div>

                                {androidRelease && (
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <a
                                            href={androidRelease.apk.url}
                                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                                        >
                                            Download APK
                                        </a>
                                        <a
                                            href={androidRelease.aab.url}
                                            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-100"
                                        >
                                            Download AAB
                                        </a>
                                    </div>
                                )}
                            </div>
                            <div className="mt-3 text-xs text-emerald-800">
                                APK is voor directe Android-installatie. AAB is bedoeld voor Play Store of distributie via releasekanalen.
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 text-left">
                        <div className="bg-white rounded-lg p-4 shadow">
                            <div className="text-2xl font-bold text-indigo-600 mb-1">100%</div>
                            <div className="text-sm text-gray-600">Gratis</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow">
                            <div className="text-2xl font-bold text-indigo-600 mb-1">Lokaal</div>
                            <div className="text-sm text-gray-600">Jouw buurt</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow">
                            <div className="text-2xl font-bold text-indigo-600 mb-1">Community</div>
                            <div className="text-sm text-gray-600">Door gebruikers</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow">
                            <div className="text-2xl font-bold text-indigo-600 mb-1">Eerlijk</div>
                            <div className="text-sm text-gray-600">Transparante data</div>
                        </div>
                    </div>

                    <div className="mt-12 text-gray-500 text-sm">
                        <p>💡 Bonnetje Demo - Auth komt later via Laravel Breeze</p>
                    </div>
                </div>

                {/* PWA Install Prompt */}
                <PWAInstallPrompt />
            </div>
        </>
    );
}
