import { useState, useEffect } from "react";
import { getAllProducts } from "../services/productService";
import { Product } from "../types";

export const useProducts = (localProducts: Product[], searchQuery: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getAllProducts();
        const combinedProducts = [...localProducts, ...data];

        setProducts(combinedProducts);
        setFilteredProducts(combinedProducts); // Evitar estado vacío en Home
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Ocurrió un error al cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [localProducts]);

  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => {
        const filtered = products.filter((product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [products, searchQuery, loading]);

  return { products, filteredProducts, loading, error };
};
