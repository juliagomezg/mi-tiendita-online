import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const CartPage = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return <p className="text-center text-gray-500">El carrito no está disponible.</p>;
  }

  const { cart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart, totalPrice } = cartContext;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">🛒 Carrito de Compras</h1>

      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500">Tu carrito está vacío.</p>
          <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            🏠 Seguir Comprando
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item) => (
              <li key={item.id} className="flex items-center justify-between border-b pb-4">
                {/* Imagen del producto */}
                <img src={item.image} alt={item.title} className="w-20 h-20 object-contain rounded" />

                {/* Información del producto */}
                <div className="flex-1 ml-4">
                  <p className="font-bold">{item.title}</p>
                  <p className="text-gray-500">${item.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                </div>

                {/* Controles de cantidad */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                  >
                    ➖
                  </button>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                  >
                    ➕
                  </button>
                </div>

                {/* Eliminar producto */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>

          {/* Resumen del carrito */}
          <div className="mt-6 text-right border-t pt-4">
            <h2 className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</h2>
          </div>

          {/* Botones de acción */}
          <div className="mt-6 flex justify-between">
            <button
              onClick={clearCart}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              🗑 Vaciar Carrito
            </button>

            <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
              🏠 Seguir Comprando
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
