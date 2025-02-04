import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../types";
import { useUploadImage } from "../hooks/useUploadImage"; // Hook separado para Cloudinary

interface AdminProductsProps {
  onProductCreated: (newProduct: Product) => void;
}

const AdminProducts = ({ onProductCreated }: AdminProductsProps) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("electronics"); // Categoría por defecto
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { imageFile, imagePreview, handleImageChange, resetImage, uploadImage } = useUploadImage();

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!title || !price || !description || !category || !imageFile) {
      setError("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    const parsedPrice = parseFloat(price);
    if (parsedPrice <= 0) {
      setError("El precio debe ser mayor a 0.");
      setLoading(false);
      return;
    }

    const imageUrl = await uploadImage();
    if (!imageUrl) {
      setError("Error al subir la imagen. Inténtalo de nuevo.");
      setLoading(false);
      return;
    }

    const newProduct: Product = {
      id: `local-${Date.now()}`,
      title,
      price: parsedPrice,
      description,
      image: imageUrl,
      category,
    };

    onProductCreated(newProduct);

    setTitle("");
    setPrice("");
    setDescription("");
    setCategory("electronics");
    resetImage();
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      navigate("/");
    }, 2000);

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Crear Producto</h2>
      <form onSubmit={handleCreateProduct} className="flex flex-col gap-4">
        <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded" required />
        <input type="number" placeholder="Precio" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2 rounded" required />
        <textarea placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded" required />

        {/* Selector de Categoría */}
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded">
          <option value="electronics">Electrónica</option>
          <option value="jewelery">Joyería</option>
          <option value="men's clothing">Ropa de Hombre</option>
          <option value="women's clothing">Ropa de Mujer</option>
        </select>

        {/* Input para subir imagen */}
        <input type="file" accept="image/*" onChange={handleImageChange} className="border p-2 rounded" />

        {/* Previsualización de imagen con botón para eliminar */}
        {imagePreview && (
          <div className="relative mt-2">
            <img src={imagePreview} alt="Previsualización" className="max-w-full h-40 object-cover rounded" />
            <button type="button" onClick={resetImage} className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-sm">
              ❌
            </button>
          </div>
        )}

        {/* Mensajes */}
        {success && <p className="text-green-500">Producto creado exitosamente. Redirigiendo...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {loading && <p className="text-yellow-500">Subiendo imagen y creando producto...</p>}

        <button type="submit" className={`py-2 rounded ${loading ? "bg-gray-400" : "bg-blue-600 text-white hover:bg-blue-700"}`} disabled={loading}>
          {loading ? "Creando..." : "Crear Producto"}
        </button>
      </form>
    </div>
  );
};

export default AdminProducts;
