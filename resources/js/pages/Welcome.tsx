import { Head, router } from '@inertiajs/react';
import PWAInstallPrompt from '../components/PWAInstallPrompt';

export default function Welcome() {
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

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => router.visit('/dashboard')}
                                className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition shadow-lg"
                            >
                                🚀 Start Gratis
                            </button>
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
