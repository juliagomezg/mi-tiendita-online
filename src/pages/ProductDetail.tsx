import { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Product } from "../types";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useProductDetail } from "../hooks/useProductDetail";

interface ProductDetailProps {
  localProducts: Product[];
}

const ProductDetail = ({ localProducts }: ProductDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const authContext = useContext(AuthContext);
  const cartContext = useContext(CartContext);

  const { product, loading, error } = useProductDetail(id, localProducts);

  if (error) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Producto no encontrado</h2>
        <p className="text-gray-500 mt-2">{error}</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Producto no disponible</h2>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
      <img
        src={product.image}
        alt={product.title}
        className="w-full max-h-96 mx-auto mb-4 object-contain rounded shadow-md"
      />
      <p className="text-gray-700 mt-4">{product.description}</p>
      <p className="text-lg font-semibold mt-2">${product.price.toFixed(2)}</p>

      {/* Botón de Comprar */}
      {authContext?.user ? (
        <button
          onClick={() => cartContext?.addToCart(product)}
          className="bg-blue-600 text-white px-6 py-2 mt-6 rounded hover:bg-blue-700"
        >
          🛒 Comprar
        </button>
      ) : (
        <div className="mt-6">
          <p className="text-gray-500">🔒 Inicia sesión para comprar este producto</p>
          <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Iniciar Sesión
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
