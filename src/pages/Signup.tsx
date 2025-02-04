import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos
    setLoading(true);

    try {
      const response = await fetch("https://fakestoreapi.com/users", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Error en el registro");
      }

      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000); // Redirigir a login tras 2s
    } catch (error) {
      setError("❌ No se pudo crear la cuenta. Inténtalo de nuevo.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">📝 Crear Cuenta</h2>
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        {/* Usuario */}
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
          required
        />

        {/* Contraseña */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>

        {/* Mensajes */}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">✅ Registro exitoso. Redirigiendo...</p>}

        {/* Botón de Registro */}
        <button
          type="submit"
          className={`py-2 rounded text-white transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "🔄 Registrando..." : "📝 Registrarse"}
        </button>
      </form>

      {/* Enlace a Login */}
      <p className="text-center mt-4 text-gray-500">
        ¿Ya tienes cuenta?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Inicia sesión aquí
        </a>
      </p>
    </div>
  );
};

export default Signup;
