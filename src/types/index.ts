export interface Product {
  readonly id: number; // No se puede modificar el ID
  title: string;
  price: number;
  description: string;
  category: string | null; // Algunas APIs pueden devolver null
  image: string;
  rating?: { // Opcional en caso de que no tenga calificación
    rate: number;
    count: number;
  };
}

// Tipo especial para productos nuevos (sin ID ni rating)
export interface NewProduct {
  title: string;
  price: number;
  description: string;
  category: string | null;
  image: string;
}
