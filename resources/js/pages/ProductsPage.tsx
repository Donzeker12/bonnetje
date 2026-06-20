import { useState, useEffect } from 'react';
import { productApi } from '../lib/api';
import { Product, User } from '../types/models';
import { Link } from '@inertiajs/react';
import PageHeader from '../components/PageHeader';

interface ProductsPageProps {
  auth: {
    user: User | null;
  };
}

export default function ProductsPage({ auth }: ProductsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Search products when query changes
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.length < 2) {
        setProducts([]);
        setHasSearched(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await productApi.search(searchQuery);
        setProducts(response.data.data || []);
        setHasSearched(true);
      } catch (error) {
        console.error('Error searching products:', error);
        setProducts([]);
        setHasSearched(true);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={<><span className="hidden sm:inline">🔍 Producten Zoeken</span><span className="sm:hidden">🔍 Zoeken</span></>}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Box */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek producten op naam, merk of barcode..."
              className="w-full text-lg border-2 border-gray-300 rounded-lg px-6 py-4 focus:border-indigo-500 focus:outline-none"
              autoFocus
            />
            {isSearching && (
              <div className="absolute right-4 top-5 text-gray-400">
                🔄 Zoeken...
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            💡 Typ minimaal 2 karakters om te zoeken
          </p>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="bg-white rounded-lg shadow">
            {products.length > 0 ? (
              <div className="divide-y">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="p-6 hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {product.name}
                        </h3>
                        <div className="flex gap-4 text-sm text-gray-600 mb-2">
                          {product.brand && (
                            <span>🏷️ {product.brand}</span>
                          )}
                          {product.category && (
                            <span>📁 {product.category}</span>
                          )}
                          {product.unit && product.unit_amount && (
                            <span>
                              📦 {product.unit_amount} {product.unit}
                            </span>
                          )}
                        </div>
                        {product.description && (
                          <p className="text-sm text-gray-500 mb-2">
                            {product.description}
                          </p>
                        )}
                        <div className="text-xs text-gray-400">
                          Barcode: {product.barcode}
                        </div>
                      </div>

                      {/* Price Info */}
                      <div className="ml-6 text-right">
                        {product.prices && product.prices.length > 0 ? (
                          <div>
                            <div className="text-sm text-gray-500 mb-1">
                              Vanaf
                            </div>
                            <div className="text-3xl font-bold text-green-600">
                              €{Math.min(...product.prices.map(p => parseFloat(p.price))).toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {product.prices.length} {product.prices.length === 1 ? 'winkel' : 'winkels'}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">
                            Geen prijzen bekend
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price Comparison Preview */}
                    {product.prices && product.prices.length > 0 && (
                      <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-3">
                        {product.prices.slice(0, 4).map((price) => (
                          <div
                            key={price.id}
                            className="bg-gray-50 rounded p-2 text-sm"
                          >
                            <div className="font-semibold text-gray-700">
                              {price.store?.chain || 'Onbekend'}
                            </div>
                            <div className="text-lg font-bold text-indigo-600">
                              €{parseFloat(price.price).toFixed(2)}
                            </div>
                            {price.is_promotion && (
                              <div className="text-xs text-orange-600">
                                🔥 Aanbieding
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                  Geen producten gevonden
                </h3>
                <p className="text-gray-500 mb-6">
                  Er zijn nog geen producten in de database met "{searchQuery}"
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto text-left">
                  <p className="text-sm text-blue-800 mb-3">
                    💡 <strong>Hoe kun je producten toevoegen?</strong>
                  </p>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="font-bold">📸</span>
                      <div>
                        <strong>Scan barcodes</strong> in de supermarkt en voeg direct prijzen toe
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">🧾</span>
                      <div>
                        <strong>Upload kassabonnen</strong> om meerdere producten tegelijk toe te voegen
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">✍️</span>
                      <div>
                        <strong>Handmatig aanmaken</strong> als je de barcode weet
                      </div>
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-blue-300">
                    <Link
                      href="/scan"
                      className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                      🚀 Start met Scannen
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State (before search) */}
        {!hasSearched && searchQuery.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              Welkom bij Product Zoeken
            </h3>
            <p className="text-gray-500 mb-6">
              Vind de beste prijzen voor al je boodschappen
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-3xl mb-3">🔍</div>
                <h4 className="font-bold text-gray-900 mb-2">Zoek Producten</h4>
                <p className="text-sm text-gray-600">
                  Vind producten op naam, merk of barcode
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-3xl mb-3">💰</div>
                <h4 className="font-bold text-gray-900 mb-2">Vergelijk Prijzen</h4>
                <p className="text-sm text-gray-600">
                  Zie direct waar het goedkoopst is
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-3xl mb-3">📝</div>
                <h4 className="font-bold text-gray-900 mb-2">Voeg toe aan Lijst</h4>
                <p className="text-sm text-gray-600">
                  Maak je boodschappenlijst direct
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
