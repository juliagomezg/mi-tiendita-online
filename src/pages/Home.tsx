import { useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import { Product } from "../types";
import ProductCard from "../components/ProductCard";
import Categories from "../components/Categories";

interface HomeProps {
  searchQuery: string;
  localProducts: Product[];
}

const Home = ({ searchQuery, localProducts }: HomeProps) => {
  const { products, filteredProducts, loading, error } = useProducts(localProducts, searchQuery);

  // 🟢 Memoizar productos sugeridos para evitar recomputaciones innecesarias
  const suggestedProducts = useMemo(() => products.slice(0, 6), [products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-500">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold text-red-600">¡Error!</h2>
        <p className="text-gray-500 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center mt-10">
          <h2 className="text-2xl font-bold text-gray-700">¡No encontramos productos! 😢</h2>
          <p className="text-gray-500 mt-2">
            Pero no te preocupes, tenemos algunas opciones para ti:
          </p>

          {/* 🟢 Productos sugeridos (memorizados con useMemo) */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-600 mb-4">
              Sugerencias para ti:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedProducts.map((suggestedProduct) => (
                <ProductCard key={suggestedProduct.id} product={suggestedProduct} />
              ))}
            </div>
          </div>

          {/* 🟢 Categorías dinámicas */}
          <Categories />
        </div>
      )}
    </div>
  );
};

export default Home;
