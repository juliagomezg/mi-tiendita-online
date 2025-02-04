import { FC, useContext } from "react";
import { Link } from "react-router-dom";
import { Product } from "../types";
import { CartContext } from "../context/CartContext";

interface Props {
  product: Product;
}

const ProductCard: FC<Props> = ({ product }) => {
  const cartContext = useContext(CartContext);

  const handleAddToCart = () => {
    cartContext?.addToCart(product);
  };

  return (
    <div className="border rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white overflow-hidden flex flex-col">
      {/* Enlace al detalle del producto */}
      <Link to={`/product/${product.id}`} className="block flex-grow">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-52 object-contain bg-gray-100 p-4"
        />
        <div className="p-4">
          {/* Título del producto */}
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {product.title}
          </h2>
          {/* Precio del producto */}
          <p className="text-gray-500 mt-2">${product.price.toFixed(2)}</p>
        </div>
      </Link>

      {/* Botón "Añadir al Carrito" */}
      <button
        onClick={handleAddToCart}
        className="bg-blue-600 text-white py-2 mt-auto w-full hover:bg-blue-700 transition"
      >
        🛒 Añadir al carrito
      </button>
    </div>
  );
};

export default ProductCard;
