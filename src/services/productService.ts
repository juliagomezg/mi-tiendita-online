import axios from "axios";
import { Product } from "../types";

const API_URL = "https://fakestoreapi.com/products";
const CACHE_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutos en milisegundos

// ✅ Función para manejar el caché con expiración
const getCachedData = (key: string) => {
  const cachedData = localStorage.getItem(key);
  if (!cachedData) return null;

  const { data, timestamp } = JSON.parse(cachedData);
  if (Date.now() - timestamp > CACHE_EXPIRATION_TIME) {
    localStorage.removeItem(key);
    return null;
  }

  return data;
};

// ✅ Guardar en caché con timestamp
const setCachedData = (key: string, data: any) => {
  const cacheEntry = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(cacheEntry));
};

// ✅ Obtener todos los productos con caché y reintentos
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    // 1️⃣ Buscar en caché
    const cachedProducts = getCachedData("products");
    if (cachedProducts) {
      console.log("🟢 Cargando productos desde caché");
      return cachedProducts;
    }

    console.log("🔄 Llamando a la API de productos...");
    
    // 2️⃣ Intentar varias veces en caso de fallo
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await axios.get(API_URL);
        setCachedData("products", response.data);
        return response.data;
      } catch (error) {
        console.warn(`⚠️ Intento ${attempt} fallido`);
        if (attempt === 3) throw error;
      }
    }
  } catch (error) {
    console.error("❌ Error al obtener los productos:", error);
    throw new Error("No se pudieron cargar los productos. Intenta más tarde.");
  }
};

// ✅ Obtener un producto por ID con caché y reintentos
export const getProductById = async (id: number): Promise<Product> => {
  try {
    // 1️⃣ Buscar en caché primero
    const cachedProducts = getCachedData("products");
    if (cachedProducts) {
      const foundProduct = cachedProducts.find((p: Product) => p.id === id);
      if (foundProduct) {
        console.log(`🟢 Producto ${id} obtenido desde caché`);
        return foundProduct;
      }
    }

    console.log(`🔄 Llamando a la API para obtener el producto ${id}`);
    
    // 2️⃣ Intentar varias veces en caso de fallo
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
      } catch (error) {
        console.warn(`⚠️ Intento ${attempt} fallido para obtener producto ${id}`);
        if (attempt === 3) throw error;
      }
    }
  } catch (error) {
    console.error(`❌ Error al obtener el producto ${id}:`, error);
    throw new Error("No se pudo cargar el producto.");
  }
};
