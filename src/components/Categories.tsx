import React from "react";

const Categories = () => {
  const categories = ["electronics", "jewelery", "men's clothing", "women's clothing"];

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-600">Explora nuestras categorías:</h3>
      <div className="flex justify-center gap-4 mt-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => alert(`¡Redirigiendo a ${category}!`)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
