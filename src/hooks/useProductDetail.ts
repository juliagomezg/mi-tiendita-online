import { useState, useEffect, useCallback } from "react";
import { getProductById } from "../services/productService";
import { Product } from "../types";

export const useProductDetail = (id: string | undefined, localProducts: Product[]) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Función optimizada para obtener el producto
  const fetchProduct = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      // Intenta obtener el producto desde la API
      const apiProduct = await getProductById(Number(id));
      setProduct(apiProduct);
    } catch (apiError) {
      console.warn(`⚠️ Producto ${id} no encontrado en la API, buscando en local...`);

      // Si la API falla, buscar en productos locales
      const localProduct = localProducts.find((p) => p.id.toString() === id);
      if (localProduct) {
        setProduct(localProduct);
      } else {
        setError("❌ Producto no encontrado.");
        setProduct(null);
      }
    } finally {
      setLoading(false);
    }
  }, [id, localProducts]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, error };
};
