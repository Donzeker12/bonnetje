import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { folderActionApi, productApi, storeApi } from '../lib/api';
import { FolderAction, Product, Store, User } from '../types/models';
import PageHeader from '../components/PageHeader';

interface FolderActionsPageProps {
  auth: {
    user: User | null;
  };
}

export default function FolderActionsPage({ auth }: FolderActionsPageProps) {
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const [stores, setStores] = useState<Store[]>([]);
  const [storeId, setStoreId] = useState<number | null>(null);
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [myActions, setMyActions] = useState<FolderAction[]>([]);
  const [selectedActionId, setSelectedActionId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [promoPrice, setPromoPrice] = useState('');
  const [normalPrice, setNormalPrice] = useState('');
  const [unitLabel, setUnitLabel] = useState('');
  const [productId, setProductId] = useState<number | null>(null);
  const [productNameRaw, setProductNameRaw] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  const [adminActions, setAdminActions] = useState<FolderAction[]>([]);
  const [isLoadingAdminActions, setIsLoadingAdminActions] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isAdmin = auth.user?.role === 'admin';

  const selectedAction = useMemo(
    () => myActions.find((action) => action.id === selectedActionId) || null,
    [myActions, selectedActionId]
  );

  const loadStores = async () => {
    try {
      const response = await storeApi.getAll({ store_type: 'supermarket' } as any);
      setStores(response.data || []);
    } catch (error) {
      console.error('Error loading stores:', error);
      setErrorMessage('Supermarkten laden is mislukt.');
    }
  };

  const loadMyActions = async () => {
    try {
      const response = await folderActionApi.getMine();
      const actions = response.data.data || [];
      setMyActions(actions);
      if (!selectedActionId && actions.length > 0) {
        setSelectedActionId(actions[0].id);
      }
    } catch (error) {
      console.error('Error loading folder actions:', error);
      setErrorMessage('Folderacties laden is mislukt.');
    }
  };

  const loadAdminActions = async () => {
    if (!isAdmin) return;

    setIsLoadingAdminActions(true);
    try {
      const response = await folderActionApi.getAdmin('pending');
      setAdminActions(response.data.data || []);
    } catch (error) {
      console.error('Error loading admin folder actions:', error);
      setErrorMessage('Admin folderacties laden is mislukt.');
    } finally {
      setIsLoadingAdminActions(false);
    }
  };

  useEffect(() => {
    loadStores();
    loadMyActions();
    loadAdminActions();
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null);
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [imageFile]);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await productApi.search(searchQuery.trim());
        setSearchResults(response.data.data || []);
      } catch (error) {
        console.error('Error searching products:', error);
      }
    };

    const timeoutId = setTimeout(searchProducts, 250);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleCreateFolderAction = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!storeId || !validFrom || !validUntil || !imageFile) {
      setErrorMessage('Kies supermarkt, datums en foto.');
      return;
    }

    setIsUploading(true);
    try {
      const response = await folderActionApi.create({
        store_id: storeId,
        valid_from: validFrom,
        valid_until: validUntil,
        image: imageFile,
      });

      setSuccessMessage(response.data.message || 'Folderactie aangemaakt.');
      setStoreId(null);
      setValidFrom('');
      setValidUntil('');
      setImageFile(null);
      setImagePreviewUrl(null);
      await loadMyActions();
    } catch (error: any) {
      console.error('Error creating folder action:', error);
      setErrorMessage(error?.response?.data?.message || 'Aanmaken van folderactie mislukt.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddItem = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!selectedActionId || !promoPrice) {
      setErrorMessage('Selecteer eerst een folderactie en actieprijs.');
      return;
    }

    if (!productId && !productNameRaw.trim()) {
      setErrorMessage('Kies een product of vul een ruwe productnaam in.');
      return;
    }

    setIsAddingItem(true);
    try {
      await folderActionApi.addItem(selectedActionId, {
        product_id: productId || undefined,
        product_name_raw: productId ? undefined : productNameRaw.trim(),
        promo_price: Number(promoPrice),
        normal_price: normalPrice ? Number(normalPrice) : undefined,
        unit_label: unitLabel || undefined,
      });

      setSuccessMessage('Actieproduct toegevoegd.');
      setSearchQuery('');
      setSearchResults([]);
      setProductId(null);
      setProductNameRaw('');
      setPromoPrice('');
      setNormalPrice('');
      setUnitLabel('');
      await loadMyActions();
    } catch (error: any) {
      console.error('Error adding folder item:', error);
      setErrorMessage(error?.response?.data?.message || 'Toevoegen van actieproduct mislukt.');
    } finally {
      setIsAddingItem(false);
    }
  };

  const approveFolderAction = async (id: number) => {
    try {
      await folderActionApi.approve(id);
      setSuccessMessage('Folderactie goedgekeurd en prijzen gepubliceerd.');
      await loadAdminActions();
    } catch (error: any) {
      console.error('Error approving folder action:', error);
      setErrorMessage(error?.response?.data?.message || 'Goedkeuren mislukt.');
    }
  };

  const rejectFolderAction = async (id: number) => {
    try {
      await folderActionApi.reject(id);
      setSuccessMessage('Folderactie afgekeurd.');
      await loadAdminActions();
    } catch (error: any) {
      console.error('Error rejecting folder action:', error);
      setErrorMessage(error?.response?.data?.message || 'Afkeuren mislukt.');
    }
  };

  return (
    <>
      <Head title="Folder Acties" />
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-blue-50">
        <PageHeader title="Folder Acties" backLabel="Dashboard" />

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm">{successMessage}</div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold mb-4">1) Upload folderfoto en datums</h2>
              <form onSubmit={handleCreateFolderAction} className="space-y-3">
                <select
                  value={storeId || ''}
                  onChange={(e) => setStoreId(Number(e.target.value) || null)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                >
                  <option value="">Kies supermarkt</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.chain} - {store.city} ({store.country_code})
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-3">
                  <input type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2.5" />
                  <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2.5" />
                </div>

                <input
                  ref={uploadInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="hidden"
                />

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="hidden"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => uploadInputRef.current?.click()}
                    className="w-full bg-gray-100 text-gray-800 rounded-lg py-2.5 font-semibold hover:bg-gray-200 transition"
                  >
                    Bestand kiezen
                  </button>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="w-full bg-gray-100 text-gray-800 rounded-lg py-2.5 font-semibold hover:bg-gray-200 transition"
                  >
                    Foto maken
                  </button>
                </div>

                <div className="text-sm text-gray-600">
                  {imageFile ? `Gekozen bestand: ${imageFile.name}` : 'Nog geen foto gekozen'}
                </div>

                {imagePreviewUrl && (
                  <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Voorbeeld</div>
                    <img
                      src={imagePreviewUrl}
                      alt="Voorbeeld van geselecteerde folderfoto"
                      className="w-full max-h-64 object-contain rounded-md bg-white"
                    />
                  </div>
                )}

                <button type="submit" disabled={isUploading} className="w-full bg-orange-500 text-white rounded-lg py-2.5 font-semibold hover:bg-orange-600 disabled:opacity-60">
                  {isUploading ? 'Uploaden...' : 'Folderactie opslaan'}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold mb-4">2) Voeg actieproducten toe</h2>

              <select
                value={selectedActionId || ''}
                onChange={(e) => setSelectedActionId(Number(e.target.value) || null)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 mb-3"
              >
                <option value="">Kies jouw folderactie</option>
                {myActions.map((action) => (
                  <option key={action.id} value={action.id}>
                    #{action.id} {action.store?.chain} ({action.valid_from} t/m {action.valid_until}) [{action.status}]
                  </option>
                ))}
              </select>

              <form onSubmit={handleAddItem} className="space-y-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setProductId(null);
                  }}
                  placeholder="Zoek product in database"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                />

                {searchResults.length > 0 && (
                  <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto divide-y">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => {
                          setProductId(product.id);
                          setSearchQuery(product.name);
                          setSearchResults([]);
                          setProductNameRaw('');
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50"
                      >
                        <div className="font-semibold text-sm">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.brand || 'Onbekend merk'}</div>
                      </button>
                    ))}
                  </div>
                )}

                {!productId && (
                  <input
                    type="text"
                    value={productNameRaw}
                    onChange={(e) => setProductNameRaw(e.target.value)}
                    placeholder="Of ruwe productnaam uit folder"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                  />
                )}

                <div className="grid grid-cols-2 gap-3">
                  <input type="number" step="0.01" min="0.01" value={promoPrice} onChange={(e) => setPromoPrice(e.target.value)} placeholder="Actieprijs" className="border border-gray-300 rounded-lg px-3 py-2.5" />
                  <input type="number" step="0.01" min="0.01" value={normalPrice} onChange={(e) => setNormalPrice(e.target.value)} placeholder="Normale prijs (opt.)" className="border border-gray-300 rounded-lg px-3 py-2.5" />
                </div>

                <input type="text" value={unitLabel} onChange={(e) => setUnitLabel(e.target.value)} placeholder="Eenheid (bijv. 500g, 1L)" className="w-full border border-gray-300 rounded-lg px-3 py-2.5" />

                <button type="submit" disabled={isAddingItem} className="w-full bg-indigo-600 text-white rounded-lg py-2.5 font-semibold hover:bg-indigo-700 disabled:opacity-60">
                  {isAddingItem ? 'Toevoegen...' : 'Actieproduct toevoegen'}
                </button>
              </form>

              {selectedAction?.items && selectedAction.items.length > 0 && (
                <div className="mt-4 border-t pt-4 space-y-2">
                  {selectedAction.items.map((item) => (
                    <div key={item.id} className="text-sm flex justify-between">
                      <span>{item.product?.name || item.product_name_raw || 'Onbekend product'}</span>
                      <span className="font-semibold">€{Number(item.promo_price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {isAdmin && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold mb-4">3) Admin review en publicatie</h2>
              {isLoadingAdminActions ? (
                <p className="text-sm text-gray-500">Laden...</p>
              ) : adminActions.length === 0 ? (
                <p className="text-sm text-gray-500">Geen open folderacties.</p>
              ) : (
                <div className="space-y-3">
                  {adminActions.map((action) => (
                    <div key={action.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="font-semibold">#{action.id} {action.store?.chain} ({action.store?.city})</div>
                      <div className="text-sm text-gray-600">{action.valid_from} t/m {action.valid_until}</div>
                      <div className="text-sm text-gray-600">Items: {action.items?.length || 0}</div>
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => approveFolderAction(action.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">Goedkeuren</button>
                        <button onClick={() => rejectFolderAction(action.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700">Afkeuren</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
