import { Head, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { priceApi, productApi, receiptApi, storeApi, storeRequestApi } from '../lib/api';
import { Product, Receipt, Store, StoreRequest, User } from '../types/models';
import PageHeader from '../components/PageHeader';

interface ScanPageProps {
    auth: {
        user: User | null;
    };
}

export default function ScanPage({ auth }: ScanPageProps) {
    const isAdmin = auth.user?.role === 'admin';

    const [stores, setStores] = useState<Store[]>([]);
    const [loadingStores, setLoadingStores] = useState(false);
    const [countryFilter, setCountryFilter] = useState('');

    const [productQuery, setProductQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [searchingProducts, setSearchingProducts] = useState(false);

    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
    const [priceType, setPriceType] = useState<'normal' | 'promotion'>('normal');
    const [price, setPrice] = useState('');
    const [normalPrice, setNormalPrice] = useState('');
    const [promotionEndDate, setPromotionEndDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPath, setProofPath] = useState<string | null>(null);
    const [proofUrl, setProofUrl] = useState<string | null>(null);
    const [isUploadingProof, setIsUploadingProof] = useState(false);

    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [receiptOcrText, setReceiptOcrText] = useState('');
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [loadingReceipts, setLoadingReceipts] = useState(false);
    const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);
    const [processingReceiptId, setProcessingReceiptId] = useState<number | null>(null);
    const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [newStoreName, setNewStoreName] = useState('');
    const [newStoreChain, setNewStoreChain] = useState('');
    const [newStoreAddress, setNewStoreAddress] = useState('');
    const [newStoreCity, setNewStoreCity] = useState('');
    const [newStorePostalCode, setNewStorePostalCode] = useState('');
    const [newStoreCountryCode, setNewStoreCountryCode] = useState('NL');
    const [newStoreCurrencyCode, setNewStoreCurrencyCode] = useState('EUR');
    const [newStoreLatitude, setNewStoreLatitude] = useState('');
    const [newStoreLongitude, setNewStoreLongitude] = useState('');
    const [storeRequestReason, setStoreRequestReason] = useState('');
    const [isCreatingStore, setIsCreatingStore] = useState(false);

    const [adminRequests, setAdminRequests] = useState<StoreRequest[]>([]);
    const [loadingAdminRequests, setLoadingAdminRequests] = useState(false);

    const loadStores = async (country: string = countryFilter) => {
        setLoadingStores(true);
        try {
            const response = await storeApi.getAll(
                country ? { country_code: country } : undefined
            );
            setStores(response.data || []);
        } catch (error) {
            console.error('Error loading stores:', error);
            setErrorMessage('Winkels laden is mislukt. Probeer opnieuw.');
        } finally {
            setLoadingStores(false);
        }
    };

    useEffect(() => {
        loadStores();
    }, [countryFilter]);

    useEffect(() => {
        const loadReceipts = async () => {
            setLoadingReceipts(true);
            try {
                const response = await receiptApi.getMine();
                setReceipts(response.data || []);
            } catch (error) {
                console.error('Error loading receipts:', error);
            } finally {
                setLoadingReceipts(false);
            }
        };

        loadReceipts();
    }, []);

    useEffect(() => {
        if (!isAdmin) {
            setAdminRequests([]);
            return;
        }

        const loadAdminRequests = async () => {
            setLoadingAdminRequests(true);
            try {
                const response = await storeRequestApi.getAdminRequests('pending');
                setAdminRequests(response.data.data || []);
            } catch (error) {
                console.error('Error loading admin store requests:', error);
                setErrorMessage('Aanvragen laden is mislukt.');
            } finally {
                setLoadingAdminRequests(false);
            }
        };

        loadAdminRequests();
    }, [isAdmin]);

    useEffect(() => {
        const searchProducts = async () => {
            if (productQuery.trim().length < 2) {
                setProducts([]);
                return;
            }

            setSearchingProducts(true);
            try {
                const response = await productApi.search(productQuery.trim());
                setProducts(response.data.data || []);
            } catch (error) {
                console.error('Error searching products:', error);
                setProducts([]);
            } finally {
                setSearchingProducts(false);
            }
        };

        const timeoutId = setTimeout(searchProducts, 300);
        return () => clearTimeout(timeoutId);
    }, [productQuery]);

    const selectedStore = useMemo(
        () => stores.find((store) => store.id === selectedStoreId) || null,
        [stores, selectedStoreId]
    );

    const handleUploadProof = async () => {
        if (!proofFile) {
            setErrorMessage('Kies eerst een foto om te uploaden.');
            return;
        }

        setErrorMessage(null);
        setSuccessMessage(null);
        setIsUploadingProof(true);

        try {
            const response = await priceApi.uploadProofPhoto(proofFile, 'folder');
            setProofPath(response.data.path);
            setProofUrl(response.data.url);
            setSuccessMessage('Folderfoto geüpload. Je kunt nu de actieprijs opslaan.');
        } catch (error: any) {
            console.error('Error uploading proof image:', error);
            const apiMessage = error?.response?.data?.message;
            setErrorMessage(apiMessage || 'Upload van folderfoto is mislukt.');
        } finally {
            setIsUploadingProof(false);
        }
    };

    const handleUploadReceipt = async () => {
        if (!receiptFile) {
            setErrorMessage('Kies eerst een kassabon om te uploaden.');
            return;
        }

        if (!selectedStoreId) {
            setErrorMessage('Kies eerst een winkel voor de kassabon.');
            return;
        }

        setErrorMessage(null);
        setSuccessMessage(null);
        setIsUploadingReceipt(true);

        try {
            const response = await receiptApi.upload({
                store_id: selectedStoreId,
                image: receiptFile,
                ocr_raw_text: receiptOcrText.trim() || undefined,
                auto_process: true,
            });

            setReceipts((current) => [response.data.receipt, ...current]);
            setReceiptFile(null);
            setReceiptOcrText('');
            setSuccessMessage('Kassabon geüpload en direct verwerkt.');
        } catch (error: any) {
            console.error('Error uploading receipt:', error);
            const apiMessage = error?.response?.data?.message;
            setErrorMessage(apiMessage || 'Upload van kassabon is mislukt.');
        } finally {
            setIsUploadingReceipt(false);
        }
    };

    const handleProcessReceipt = async (receiptId: number) => {
        setErrorMessage(null);
        setSuccessMessage(null);
        setProcessingReceiptId(receiptId);

        try {
            const response = await receiptApi.process(receiptId);
            setReceipts((current) =>
                current.map((receipt) =>
                    receipt.id === receiptId ? response.data.receipt : receipt
                )
            );
            setSuccessMessage('Kassabon verwerkt.');
        } catch (error: any) {
            console.error('Error processing receipt:', error);
            const apiMessage = error?.response?.data?.message;
            setErrorMessage(apiMessage || 'Verwerken van kassabon is mislukt.');
        } finally {
            setProcessingReceiptId(null);
        }
    };

    const handleSubmitPrice = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        if (!selectedProductId || !selectedStoreId) {
            setErrorMessage('Kies eerst een product en een winkel.');
            return;
        }

        if (!price) {
            setErrorMessage('Vul een prijs in.');
            return;
        }

        if (priceType === 'promotion' && !normalPrice) {
            setErrorMessage('Bij een actieprijs is de normale prijs verplicht.');
            return;
        }

        setIsSubmitting(true);

        try {
            await priceApi.create({
                product_id: selectedProductId,
                store_id: selectedStoreId,
                price: Number(price),
                price_type: priceType,
                normal_price: priceType === 'promotion' ? Number(normalPrice) : undefined,
                promotion_end_date: priceType === 'promotion' && promotionEndDate ? promotionEndDate : undefined,
                source_type: proofPath ? 'folder' : 'manual',
                proof_image_path: proofPath || undefined,
                is_promotion: priceType === 'promotion',
            });

            setSuccessMessage('Prijs succesvol opgeslagen. Bedankt voor je bijdrage!');
            setPrice('');
            setNormalPrice('');
            setPromotionEndDate('');
            setProofFile(null);
            setProofPath(null);
            setProofUrl(null);
            setSelectedProductId(null);
        } catch (error: any) {
            console.error('Error saving price:', error);
            const apiMessage = error?.response?.data?.message;
            setErrorMessage(apiMessage || 'Opslaan van prijs is mislukt.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateStore = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        if (!isAdmin) {
            setErrorMessage('Alleen admins kunnen winkels toevoegen.');
            return;
        }

        if (
            !newStoreName ||
            !newStoreChain ||
            !newStoreAddress ||
            !newStoreCity ||
            !newStorePostalCode ||
            !newStoreLatitude ||
            !newStoreLongitude
        ) {
            setErrorMessage('Vul alle winkelvelden in om een winkel toe te voegen.');
            return;
        }

        setIsCreatingStore(true);

        try {
            const response = await storeApi.create({
                name: newStoreName.trim(),
                chain: newStoreChain.trim(),
                address: newStoreAddress.trim(),
                city: newStoreCity.trim(),
                postal_code: newStorePostalCode.trim(),
                country_code: newStoreCountryCode,
                currency_code: newStoreCurrencyCode,
                latitude: Number(newStoreLatitude),
                longitude: Number(newStoreLongitude),
            });

            const createdStore = response.data;

            setCountryFilter(createdStore.country_code || newStoreCountryCode);
            await loadStores(createdStore.country_code || newStoreCountryCode);
            setSelectedStoreId(createdStore.id);

            setNewStoreName('');
            setNewStoreChain('');
            setNewStoreAddress('');
            setNewStoreCity('');
            setNewStorePostalCode('');
            setNewStoreLatitude('');
            setNewStoreLongitude('');

            setSuccessMessage('Winkel toegevoegd en direct geselecteerd.');
        } catch (error: any) {
            console.error('Error creating store:', error);
            const apiMessage = error?.response?.data?.message;
            setErrorMessage(apiMessage || 'Winkel toevoegen is mislukt.');
        } finally {
            setIsCreatingStore(false);
        }
    };

    const handleSubmitStoreRequest = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        if (
            !newStoreName ||
            !newStoreChain ||
            !newStoreAddress ||
            !newStoreCity ||
            !newStorePostalCode ||
            !newStoreLatitude ||
            !newStoreLongitude
        ) {
            setErrorMessage('Vul alle velden in om een aanvraag te doen.');
            return;
        }

        setIsCreatingStore(true);

        try {
            await storeRequestApi.create({
                name: newStoreName.trim(),
                chain: newStoreChain.trim(),
                address: newStoreAddress.trim(),
                city: newStoreCity.trim(),
                postal_code: newStorePostalCode.trim(),
                country_code: newStoreCountryCode,
                currency_code: newStoreCurrencyCode,
                latitude: Number(newStoreLatitude),
                longitude: Number(newStoreLongitude),
                admin_notes: storeRequestReason.trim() || undefined,
            });

            setNewStoreName('');
            setNewStoreChain('');
            setNewStoreAddress('');
            setNewStoreCity('');
            setNewStorePostalCode('');
            setNewStoreLatitude('');
            setNewStoreLongitude('');
            setStoreRequestReason('');

            setSuccessMessage('Aanvraag verstuurd. Een admin kan deze nu goedkeuren.');
        } catch (error: any) {
            console.error('Error submitting store request:', error);
            const apiMessage = error?.response?.data?.message;
            setErrorMessage(apiMessage || 'Winkel-aanvraag versturen is mislukt.');
        } finally {
            setIsCreatingStore(false);
        }
    };

    const handleApproveRequest = async (requestId: number) => {
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            await storeRequestApi.approve(requestId);
            setAdminRequests((current) => current.filter((requestItem) => requestItem.id !== requestId));
            await loadStores();
            setSuccessMessage('Aanvraag goedgekeurd en winkel toegevoegd.');
        } catch (error: any) {
            console.error('Error approving request:', error);
            const apiMessage = error?.response?.data?.message;
            setErrorMessage(apiMessage || 'Goedkeuren van aanvraag is mislukt.');
        }
    };

    const handleRejectRequest = async (requestId: number) => {
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            await storeRequestApi.reject(requestId);
            setAdminRequests((current) => current.filter((requestItem) => requestItem.id !== requestId));
            setSuccessMessage('Aanvraag afgekeurd.');
        } catch (error: any) {
            console.error('Error rejecting request:', error);
            const apiMessage = error?.response?.data?.message;
            setErrorMessage(apiMessage || 'Afkeuren van aanvraag is mislukt.');
        }
    };

    return (
        <>
            <Head title="Kasbon Scannen - Bonnetje" />
            <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
                <PageHeader
                    title="📷 Kasbon Scannen & Prijzen"
                    backLabel="Dashboard"
                />

                <main className="max-w-6xl mx-auto px-4 py-8">
                    {/* ===== PRIMAIR: BON SCANNEN WORKFLOW ===== */}
                    <div className="mb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* BON UPLOAD SECTION - PRIMAIR */}
                            <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 border-2 border-indigo-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">📷 Bon Scannen</h2>
                                <p className="text-gray-600 mb-6">
                                    Maak een foto van je kassabon of upload deze. Kies de winkel en laat de bon automatisch verwerken. Dit is het gemakkelijkste way om prijzen toe te voegen!
                                </p>

                                {errorMessage && (
                                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                                        {errorMessage}
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm">
                                        {successMessage}
                                    </div>
                                )}

                                <div className="space-y-5">
                                    {/* Bon Upload */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">📸 Bon Foto</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                                            className="block w-full text-sm text-gray-700 border-2 border-gray-300 rounded-lg px-4 py-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        {receiptFile && <p className="text-xs text-green-600 mt-1">✓ {receiptFile.name}</p>}
                                    </div>

                                    {/* Winkel Keuze */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Land</label>
                                            <select
                                                value={countryFilter}
                                                onChange={(e) => setCountryFilter(e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="">Alle landen</option>
                                                <option value="NL">🇳🇱 Nederland</option>
                                                <option value="DE">🇩🇪 Duitsland</option>
                                                <option value="BE">🇧🇪 België</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Winkel *</label>
                                            <select
                                                value={selectedStoreId || ''}
                                                onChange={(e) => setSelectedStoreId(Number(e.target.value) || null)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                disabled={loadingStores}
                                            >
                                                <option value="">Kies een winkel</option>
                                                {stores.map((store) => (
                                                    <option key={store.id} value={store.id}>
                                                        {store.chain} - {store.city} ({store.country_code})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* OCR Tekst (optioneel) */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">OCR-tekst (optioneel)</label>
                                        <textarea
                                            value={receiptOcrText}
                                            onChange={(e) => setReceiptOcrText(e.target.value)}
                                            rows={3}
                                            placeholder="Plak OCR-tekst van de bon voor directe parsing. Dit versnelt de verwerking aanzienlijk."
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">💡 Tip: Gebruik Google Lens, Snapseed of een OCR-app voor snellere tekstextractie</p>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="button"
                                        onClick={handleUploadReceipt}
                                        disabled={isUploadingReceipt || !receiptFile || !selectedStoreId}
                                        className="w-full bg-indigo-600 text-white px-6 py-4 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed text-lg shadow-lg"
                                    >
                                        {isUploadingReceipt ? '📤 Uploaden en verwerken...' : '📤 Bon Uploaden & Verwerken'}
                                    </button>

                                    {/* Info Box */}
                                    <div className="rounded-lg bg-blue-50 border-l-4 border-blue-500 p-4">
                                        <p className="text-sm text-blue-900 font-semibold mb-1">✨ Hoe het werkt:</p>
                                        <p className="text-sm text-blue-800">
                                            De bon wordt gescand met OCR, producten en prijzen worden automatisch geëxtraheerd en opgeslagen. Je draagt direct bij aan de community!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* MIJN BONNEN SECTION */}
                            <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8">
                                <div className="flex items-center justify-between gap-3 mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">📋 Mijn Bonnen</h2>
                                        <p className="text-sm text-gray-600">Recent gescanned en verwerkt.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { setLoadingReceipts(true); const loadReceipts = async () => { try { const response = await receiptApi.getMine(); setReceipts(response.data || []); } catch (error) { console.error('Error loading receipts:', error); } finally { setLoadingReceipts(false); } }; loadReceipts(); }}
                                        disabled={loadingReceipts}
                                        className="text-sm px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-60 whitespace-nowrap font-semibold"
                                    >
                                        {loadingReceipts ? '⟳ Laden...' : '🔄 Vernieuwen'}
                                    </button>
                                </div>

                                {loadingReceipts ? (
                                    <p className="text-sm text-gray-500">Bonnen laden...</p>
                                ) : receipts.length === 0 ? (
                                    <p className="text-sm text-gray-500">Nog geen bonnen gescanned. Upload je eerste bon hierboven →</p>
                                ) : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {receipts.map((receipt) => (
                                            <div key={receipt.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1">
                                                        <div className="font-bold text-gray-900">
                                                            {receipt.store?.chain || 'Onbekende winkel'} - {receipt.store?.city || 'Onbekend'}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {receipt.store?.address || 'Adres onbekend'}
                                                        </div>
                                                    </div>
                                                    <span className={`rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${
                                                        receipt.status === 'processed' ? 'bg-green-100 text-green-700' :
                                                        receipt.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {receipt.status === 'processed' ? '✓ Verwerkt' :
                                                         receipt.status === 'processing' ? '⟳ Verwerking' :
                                                         '◐ In wacht'}
                                                    </span>
                                                </div>

                                                <div className="mt-3 text-sm text-gray-700 flex flex-wrap gap-x-4 gap-y-2">
                                                    <span>📦 Items: {receipt.items_count}</span>
                                                    <span>💰 Totaal: {receipt.total_amount || '-'}</span>
                                                    <span>📅 {receipt.purchase_date || '-'}</span>
                                                </div>

                                                {receipt.parsed_items && receipt.parsed_items.length > 0 && (
                                                    <div className="mt-3 rounded-lg bg-gray-50 p-3 border border-gray-100">
                                                        <div className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">📝 Produkten ({receipt.parsed_items.length})</div>
                                                        <div className="space-y-1 text-sm text-gray-700">
                                                            {receipt.parsed_items.slice(0, 3).map((item, index) => (
                                                                <div key={`${receipt.id}-${index}`} className="flex items-center justify-between gap-3">
                                                                    <span className="truncate">{item.name}</span>
                                                                    <span className="font-semibold">€{Number(item.price).toFixed(2)}</span>
                                                                </div>
                                                            ))}
                                                            {receipt.parsed_items.length > 3 && (
                                                                <div className="text-xs text-gray-500 italic">
                                                                    +{receipt.parsed_items.length - 3} items meer...
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="mt-4 flex gap-2 flex-wrap">
                                                    {receipt.status === 'pending' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleProcessReceipt(receipt.id)}
                                                            disabled={processingReceiptId === receipt.id}
                                                            className="flex-1 min-w-[120px] bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                                                        >
                                                            {processingReceiptId === receipt.id ? '⟳ Verwerken...' : 'Verwerk nu'}
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedReceipt(receipt)}
                                                        className="flex-1 min-w-[120px] bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                                                    >
                                                        Details →
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ===== SECUNDAIR: HANDMATIGE PRIJZEN (FALLBACK) ===== */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-5 sm:p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Prijzen Handmatig Invoeren</h2>
                            <p className="text-gray-600 mb-6">
                                Geen bon? Voeg normale prijzen of actieprijzen direct in. Dit is een fallback optie wanneer je geen bon kunt scannen.
                            </p>

                            <form onSubmit={handleSubmitPrice} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Zoek Product</label>
                                    <input
                                        type="text"
                                        value={productQuery}
                                        onChange={(e) => setProductQuery(e.target.value)}
                                        placeholder="Bijv. Cola, pasta, barcode..."
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    {searchingProducts && <p className="text-xs text-gray-500 mt-2">🔍 Zoeken...</p>}
                                    {products.length > 0 && (
                                        <div className="mt-2 border border-gray-200 rounded-lg max-h-52 overflow-y-auto divide-y">
                                            {products.map((product) => (
                                                <button
                                                    key={product.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedProductId(product.id);
                                                        setProductQuery(`${product.name} (${product.brand || 'onbekend merk'})`);
                                                        setProducts([]);
                                                    }}
                                                    className="w-full text-left px-3 py-3 hover:bg-indigo-50"
                                                >
                                                    <div className="font-semibold text-gray-800">{product.name}</div>
                                                    <div className="text-xs text-gray-500">{product.brand || 'Onbekend merk'} · {product.barcode}</div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Land Winkel</label>
                                        <select
                                            value={countryFilter}
                                            onChange={(e) => setCountryFilter(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">Alle landen</option>
                                            <option value="NL">🇳🇱 Nederland</option>
                                            <option value="DE">🇩🇪 Duitsland</option>
                                            <option value="BE">🇧🇪 België</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Winkel *</label>
                                        <select
                                            value={selectedStoreId || ''}
                                            onChange={(e) => setSelectedStoreId(Number(e.target.value) || null)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            disabled={loadingStores}
                                        >
                                            <option value="">Kies een winkel</option>
                                            {stores.map((store) => (
                                                <option key={store.id} value={store.id}>
                                                    {store.chain} - {store.city} ({store.country_code})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Prijs Type</label>
                                        <select
                                            value={priceType}
                                            onChange={(e) => setPriceType(e.target.value as 'normal' | 'promotion')}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="normal">Normale Prijs</option>
                                            <option value="promotion">Actieprijs</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {selectedStore ? `Prijs (${selectedStore.currency_code})` : 'Prijs'}
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="Bijv. 2.49"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                {priceType === 'promotion' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Normale Prijs</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={normalPrice}
                                                onChange={(e) => setNormalPrice(e.target.value)}
                                                placeholder="Bijv. 3.19"
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Actie Geldig T/m</label>
                                            <input
                                                type="date"
                                                value={promotionEndDate}
                                                onChange={(e) => setPromotionEndDate(e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                                    >
                                        {isSubmitting ? 'Opslaan...' : '💾 Prijs Opslaan'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.visit('/dashboard')}
                                        className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                                    >
                                        ← Terug naar Dashboard
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* ACTIEFOLDER FOTO & STORE REQUEST SIDEBAR */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">📂 Actiefolder Foto</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Upload een folder of sticker als bewijs voor je actieprijs.
                                </p>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                                    className="block w-full text-sm text-gray-700 mb-3 border border-gray-300 rounded-lg px-3 py-2"
                                />

                                <button
                                    type="button"
                                    onClick={handleUploadProof}
                                    disabled={isUploadingProof || !proofFile}
                                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-60"
                                >
                                    {isUploadingProof ? '📤 Uploaden...' : '📤 Upload Foto'}
                                </button>

                                {proofUrl && (
                                    <div className="mt-4 border border-green-200 bg-green-50 rounded-lg p-3">
                                        <p className="text-xs text-green-700 mb-2">✓ Foto gekoppeld aan volgende prijsinvoer.</p>
                                        <img
                                            src={proofUrl}
                                            alt="Folderfoto"
                                            className="w-full rounded-md object-cover max-h-40"
                                        />
                                    </div>
                                )}

                                <div className="mt-5 text-xs text-gray-500 space-y-1">
                                    <p>Ondersteunt: JPG, PNG, WEBP</p>
                                    <p>Max: 5 MB</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {isAdmin ? '➕ Winkel Toevoegen' : '❓ Winkel Aanvragen'}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    {isAdmin
                                        ? 'Direct toevoegen als admin.'
                                        : 'Je aanvraag gaat naar admins ter goedkeuring.'}
                                </p>

                                <form onSubmit={isAdmin ? handleCreateStore : handleSubmitStoreRequest} className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Winkelnaam"
                                        value={newStoreName}
                                        onChange={(e) => setNewStoreName(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Keten (Aldi, Lidl, Rewe...)"
                                        value={newStoreChain}
                                        onChange={(e) => setNewStoreChain(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Adres"
                                        value={newStoreAddress}
                                        onChange={(e) => setNewStoreAddress(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />

                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            placeholder="Plaats"
                                            value={newStoreCity}
                                            onChange={(e) => setNewStoreCity(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Postcode"
                                            value={newStorePostalCode}
                                            onChange={(e) => setNewStorePostalCode(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <select
                                            value={newStoreCountryCode}
                                            onChange={(e) => setNewStoreCountryCode(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="NL">NL</option>
                                            <option value="DE">DE</option>
                                            <option value="BE">BE</option>
                                        </select>
                                        <select
                                            value={newStoreCurrencyCode}
                                            onChange={(e) => setNewStoreCurrencyCode(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="EUR">EUR</option>
                                            <option value="USD">USD</option>
                                            <option value="GBP">GBP</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            step="0.000001"
                                            placeholder="Latitude"
                                            value={newStoreLatitude}
                                            onChange={(e) => setNewStoreLatitude(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <input
                                            type="number"
                                            step="0.000001"
                                            placeholder="Longitude"
                                            value={newStoreLongitude}
                                            onChange={(e) => setNewStoreLongitude(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    {!isAdmin && (
                                        <textarea
                                            placeholder="Opmerking (optioneel)"
                                            value={storeRequestReason}
                                            onChange={(e) => setStoreRequestReason(e.target.value)}
                                            rows={2}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isCreatingStore}
                                        className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                                    >
                                        {isCreatingStore
                                            ? (isAdmin ? '⟳ Toevoegen...' : '⟳ Versturen...')
                                            : (isAdmin ? '➕ Winkel Toevoegen' : '📨 Aanvraag Versturen')}
                                    </button>
                                </form>
                            </div>

                            {isAdmin && (
                                <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border-2 border-amber-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">⏳ Open Winkelaanvragen</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Keur aanvragen goed voor je community.
                                    </p>

                                    {loadingAdminRequests ? (
                                        <p className="text-sm text-gray-500">Aanvragen laden...</p>
                                    ) : adminRequests.length === 0 ? (
                                        <p className="text-sm text-gray-500">Geen open aanvragen.</p>
                                    ) : (
                                        <div className="space-y-3 max-h-80 overflow-y-auto">
                                            {adminRequests.map((requestItem) => (
                                                <div key={requestItem.id} className="border border-gray-200 rounded-lg p-3">
                                                    <div className="font-semibold text-gray-800">{requestItem.chain} - {requestItem.name}</div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {requestItem.address}, {requestItem.postal_code} {requestItem.city} ({requestItem.country_code})
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Door: {requestItem.requested_by?.name || `Gebruiker #${requestItem.requested_by_user_id}`}
                                                    </div>
                                                    {requestItem.admin_notes && (
                                                        <div className="text-xs text-gray-600 mt-2 italic">Opmerking: {requestItem.admin_notes}</div>
                                                    )}

                                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleApproveRequest(requestItem.id)}
                                                            className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                                                        >
                                                            ✓ Goedkeuren
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRejectRequest(requestItem.id)}
                                                            className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                                                        >
                                                            ✕ Afkeuren
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* RECEIPT DETAILS MODAL */}
            {selectedReceipt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">📋 Bon Details</h3>
                                <p className="text-sm text-gray-500">
                                    {selectedReceipt.store?.chain || 'Onbekende winkel'} - {selectedReceipt.store?.city || '-'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedReceipt(null)}
                                className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                            >
                                Sluiten
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700">
                                <div className="rounded-lg bg-gray-50 p-3">Status: <span className="font-semibold">{selectedReceipt.status}</span></div>
                                <div className="rounded-lg bg-gray-50 p-3">Items: <span className="font-semibold">{selectedReceipt.items_count}</span></div>
                                <div className="rounded-lg bg-gray-50 p-3">Totaal: <span className="font-semibold">{selectedReceipt.total_amount || '-'}</span></div>
                            </div>

                            <div>
                                <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Gevonden Produkten</div>
                                {selectedReceipt.parsed_items && selectedReceipt.parsed_items.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedReceipt.parsed_items.map((item, index) => (
                                            <div key={`${selectedReceipt.id}-detail-${index}`} className="rounded-lg border border-gray-200 p-3">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="font-semibold text-gray-900">{item.name}</div>
                                                    <div className="text-sm text-gray-700 font-bold">€{Number(item.price).toFixed(2)}</div>
                                                </div>
                                                <div className="mt-2 text-xs text-gray-500">
                                                    {item.matched_product_name
                                                        ? `✓ Gekoppeld: ${item.matched_product_name}`
                                                        : 'ⓘ Geen productmatch'}
                                                </div>
                                                <div className="mt-1 text-xs font-semibold text-gray-600">
                                                    {item.price_created ? '✓ Prijsrecord aangemaakt' : '−'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">Geen produkten gevonden.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
