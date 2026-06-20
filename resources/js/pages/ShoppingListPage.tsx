import { useState, useEffect } from 'react';
import { shoppingListApi, storeApi, productApi } from '../lib/api';
import { ShoppingList, ShoppingListItem, Product, StoreComparison, User } from '../types/models';
import PageHeader from '../components/PageHeader';

interface ShoppingListPageProps {
  auth: {
    user: User | null;
  };
}

export default function ShoppingListPage({ auth }: ShoppingListPageProps) {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [activeList, setActiveList] = useState<ShoppingList | null>(null);
  const [comparison, setComparison] = useState<any>(null);
  const [optimization, setOptimization] = useState<any>(null);
  const [showOptimization, setShowOptimization] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [addingProductId, setAddingProductId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const receiptItemsByProduct = new Map<number, any>(
    (comparison?.receipt?.items || []).map((receiptItem: any) => [receiptItem.product_id, receiptItem])
  );

  useEffect(() => {
    loadLists();
  }, []);

  // Search products when query changes
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        setHasSearched(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await productApi.search(searchQuery);
        setSearchResults(response.data.data || []);
        setHasSearched(true);
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
        setHasSearched(true);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadLists = async () => {
    try {
      const response = await shoppingListApi.getAll();
      setLists(response.data);
      const active = response.data.find((list: ShoppingList) => list.is_active);
      if (active) {
        setActiveList(active);
        loadComparison(active.id);
      }
    } catch (error) {
      console.error('Error loading lists:', error);
    }
  };

  const loadComparison = async (listId: number) => {
    try {
      const response = await shoppingListApi.compare(listId);
      setComparison(response.data);
    } catch (error) {
      console.error('Error loading comparison:', error);
    }
  };

  const loadOptimization = async () => {
    if (!activeList) return;
    
    try {
      const response = await shoppingListApi.optimize(activeList.id);
      setOptimization(response.data);
      setShowOptimization(true);
    } catch (error) {
      console.error('Error loading optimization:', error);
    }
  };

  const createNewList = async () => {
    const name = prompt('Naam van de lijst:');
    if (!name) return;

    try {
      const response = await shoppingListApi.create({
        name,
        city: auth.user?.city || undefined,
        is_active: true,
      });
      setLists([...lists, response.data]);
      setActiveList(response.data);
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const addItemToList = async (productId: number) => {
    if (!activeList) return;

    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      setAddingProductId(productId);

      await shoppingListApi.addItem(activeList.id, {
        product_id: productId,
        quantity: 1,
      });
      await loadLists();
      await loadComparison(activeList.id);
      setSearchQuery('');
      setSearchResults([]);
      setHasSearched(false);
      setSuccessMessage('Product toegevoegd aan je lijst.');
    } catch (error) {
      console.error('Error adding item:', error);
      setErrorMessage('Toevoegen mislukt. Probeer opnieuw of ververs de pagina.');
    } finally {
      setAddingProductId(null);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (!activeList) return;

    try {
      await shoppingListApi.updateItem(activeList.id, itemId, { quantity });
      loadLists();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const removeItem = async (itemId: number) => {
    if (!activeList) return;

    try {
      await shoppingListApi.removeItem(activeList.id, itemId);
      loadLists();
      loadComparison(activeList.id);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const toggleChecked = async (item: ShoppingListItem) => {
    if (!activeList) return;

    try {
      await shoppingListApi.updateItem(activeList.id, item.id, {
        is_checked: !item.is_checked,
      });
      loadLists();
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={<><span className="hidden sm:inline">📝 Mijn Boodschappenlijst</span><span className="sm:hidden">📝 Boodschappen</span></>}
        backLabel="Dashboard"
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* List Selector */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
          <select
            value={activeList?.id || ''}
            onChange={(e) => {
              const list = lists.find((l) => l.id === Number(e.target.value));
              setActiveList(list || null);
              if (list) loadComparison(list.id);
            }}
            className="flex-1 border rounded-lg px-4 py-2"
          >
            <option value="">Selecteer een lijst...</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name} ({list.items?.length || 0} items)
              </option>
            ))}
          </select>
          <button
            onClick={createNewList}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 whitespace-nowrap"
          >
            <span className="sm:hidden">+ Nieuw</span>
            <span className="hidden sm:inline">+ Nieuwe Lijst</span>
          </button>
        </div>

        {activeList && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Shopping List Items */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">{activeList.name}</h2>

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

              {/* Add Item */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Zoek product om toe te voegen..."
                    className="w-full border rounded-lg px-4 py-2"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-3 text-gray-400">
                      Zoeken...
                    </div>
                  )}
                </div>
                
                {/* Search Results */}
                {searchQuery.length >= 2 && hasSearched && (
                  <div className="mt-2 border rounded-lg">
                    {searchResults.length > 0 ? (
                      <div className="max-h-48 overflow-y-auto">
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => addItemToList(product.id)}
                            disabled={addingProductId === product.id || !activeList}
                            className="w-full text-left p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 disabled:opacity-60"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="font-semibold">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.brand || 'Onbekend merk'}</div>
                              </div>
                              <div className="text-right">
                                {product.prices && product.prices.length > 0 ? (
                                  <>
                                    <div className="text-sm text-gray-500">Vanaf</div>
                                    <div className="font-bold text-indigo-600">
                                      €{Math.min(...product.prices.map((price) => Number(price.price))).toFixed(2)}
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-xs text-gray-400">Geen prijs bekend</div>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-indigo-600 mt-1">
                              {addingProductId === product.id ? 'Toevoegen...' : 'Klik om toe te voegen'}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <div className="text-4xl mb-3">📦</div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          Geen producten gevonden
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Er zijn nog geen producten in de database met "{searchQuery}"
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                          <p className="text-sm text-blue-800 mb-2">
                            💡 <strong>Tip:</strong> Je kunt nieuwe producten toevoegen door:
                          </p>
                          <ul className="text-sm text-blue-700 ml-6 list-disc space-y-1">
                            <li>Barcodes te scannen in de supermarkt</li>
                            <li>Kassabonnen te uploaden</li>
                            <li>Handmatig producten aan te maken</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="space-y-2">
                {activeList.items?.map((item) => (
                  (() => {
                    const receiptItem = receiptItemsByProduct.get(item.product_id);

                    return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={item.is_checked}
                      onChange={() => toggleChecked(item)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <div className={`font-semibold ${item.is_checked ? 'line-through text-gray-400' : ''}`}>
                        {item.product?.name}
                      </div>
                      <div className="text-sm text-gray-500">{item.product?.brand}</div>
                      {receiptItem?.available ? (
                        <div className="text-xs text-indigo-600 mt-1">
                          €{receiptItem.unit_price?.toFixed(2)} per stuk bij {comparison?.receipt?.store?.chain}
                        </div>
                      ) : (
                        <div className="text-xs text-orange-600 mt-1">
                          Geen prijs beschikbaar in geselecteerde winkel
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️
                    </button>
                  </div>
                    );
                  })()
                ))}
              </div>

              {activeList.items?.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  Je lijst is leeg. Voeg producten toe om te beginnen!
                </p>
              )}
            </div>

            {/* Price Comparison */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h3 className="text-lg font-bold mb-4">🧾 Kassabon Overzicht</h3>
                {comparison?.receipt ? (
                  <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 font-mono text-sm">
                    <div className="font-semibold">{comparison.receipt.store.chain}</div>
                    <div className="text-xs text-gray-500 mb-3">{comparison.receipt.store.address}</div>

                    <div className="space-y-2 mb-3">
                      {comparison.receipt.items.map((receiptItem: any) => (
                        <div key={receiptItem.product_id} className="border-b border-gray-200 pb-2">
                          <div className="flex justify-between gap-3">
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{receiptItem.name}</div>
                              <div className="text-xs text-gray-500">
                                {receiptItem.quantity}x {receiptItem.available ? `€${receiptItem.unit_price?.toFixed(2)}` : 'Geen prijs'}
                              </div>
                            </div>
                            <div className="font-semibold text-gray-900">
                              {receiptItem.available ? `€${receiptItem.line_total?.toFixed(2)}` : '-'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gray-300 space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotaal</span>
                        <span>€{comparison.receipt.subtotal?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base">
                        <span>Totaal</span>
                        <span>€{comparison.receipt.subtotal?.toFixed(2)}</span>
                      </div>
                      {comparison.receipt.unavailable_count > 0 && (
                        <div className="text-xs text-orange-600">
                          {comparison.receipt.unavailable_count} product(en) zonder prijs bij deze winkel
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Nog geen winkel/prijsdata om een kassabon te tonen.
                  </p>
                )}
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4">💰 Prijsvergelijking</h3>
                {comparison?.comparison?.slice(0, 5).map((comp: StoreComparison, index: number) => (
                  <div
                    key={comp.store.id}
                    className={`p-3 rounded-lg mb-2 ${
                      index === 0 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{comp.store.chain}</div>
                        <div className="text-xs text-gray-500">{comp.store.address}</div>
                        <div className="text-xs text-gray-500">
                          {comp.items_available}/{comp.total_items} producten
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${index === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                          €{comp.total.toFixed(2)}
                        </div>
                        {index === 0 && (
                          <div className="text-xs text-green-600 font-semibold">Goedkoopst!</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={loadOptimization}
                className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700"
              >
                🎯 Optimaliseer Besparing
              </button>

              {showOptimization && optimization && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold mb-4">🚀 Optimalisatie</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="text-sm text-gray-600">Potentiële Besparing</div>
                    <div className="text-2xl font-bold text-green-600">
                      €{optimization.potential_savings?.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Door {optimization.stores_needed} winkels te bezoeken
                    </div>
                  </div>
                  
                  {optimization.optimization?.map((opt: any) => (
                    <div key={opt.store.id} className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold mb-2">{opt.store.chain}</div>
                      <div className="text-sm space-y-1">
                        {opt.items.slice(0, 3).map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.product.name}</span>
                            <span className="font-semibold">€{item.total.toFixed(2)}</span>
                          </div>
                        ))}
                        {opt.items.length > 3 && (
                          <div className="text-gray-500 text-xs">
                            +{opt.items.length - 3} meer...
                          </div>
                        )}
                      </div>
                      <div className="mt-2 pt-2 border-t flex justify-between font-bold">
                        <span>Totaal</span>
                        <span>€{opt.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!activeList && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Geen actieve lijst</h2>
            <p className="text-gray-500 mb-6">Maak een nieuwe lijst om te beginnen!</p>
            <button
              onClick={createNewList}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
            >
              + Maak Eerste Lijst
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
