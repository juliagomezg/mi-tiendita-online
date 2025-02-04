import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const cartContext = useContext(CartContext);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [showCartDropdown, setShowCartDropdown] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleLogout = () => {
    authContext?.logout();
    cartContext?.clearCart();
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex flex-wrap justify-between items-center relative">
      <Link to="/" className="text-2xl font-bold flex items-center">
        🛍️ Mi Tienda
      </Link>

      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchQuery}
        onChange={handleSearch}
        className="px-4 py-2 rounded text-black w-1/3"
      />

      <div className="flex gap-4 items-center">
        <div className="relative">
          <button
            onClick={() => setShowCartDropdown(!showCartDropdown)}
            className="bg-white text-blue-600 px-4 py-2 rounded"
          >
            🛒 Carrito ({cartContext?.totalItems || 0})
          </button>
          {showCartDropdown && cartContext?.cart.length > 0 && (
            <div className="absolute right-0 mt-2 w-64 bg-white border p-4 rounded shadow-lg">
              {cartContext.cart.slice(0, 3).map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.title}</span>
                  <span>{item.quantity}x</span>
                </div>
              ))}
              <Link to="/cart" className="text-2xl block text-center text-blue-500 mt-2 font-bold items-center">
               
               Ver lista 🛍️

              </Link>
            </div>
          )}
        </div>

        {authContext?.user?.role === "ADMIN" && (
          <Link
            to="/admin/products"
            className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
          >
            Crear Producto
          </Link>
        )}

        {authContext?.user ? (
          <div className="flex items-center gap-4">
            <span>👤 {authContext.user.username} {authContext.user.role === "ADMIN" && "(ADMIN)"}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-300 transition">
              Login
            </Link>
            <Link to="/signup" className="bg-gray-200 text-blue-600 px-4 py-2 rounded hover:bg-gray-300 transition">
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
