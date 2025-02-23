import { useState } from "react";
import axios from "axios";
import "./Recipes.scss";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedIntolerances, setSelectedIntolerances] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/recipes`, {
        params: { intolerances: selectedIntolerances.join(","), number: 1 },
        headers: { "Content-Type": "application/json" },
      });

      setRecipes(response.data.results);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  return (
    <div className="recipes">
      <h1 className="recipes__title">Recipes Based on Food Intolerances</h1>

      <div className="recipes__intolerances">
        {[
          "Dairy",
          "Egg",
          "Gluten",
          "Grain",
          "Peanut",
          "Seafood",
          "Sesame",
          "Shellfish",
          "Soy",
          "Sulfite",
          "Tree Nut",
          "Wheat",
        ].map((item) => (
          <label key={item} className="recipes__intolerance">
            <input
              type="checkbox"
              value={item}
              className="recipes__checkbox"
              onChange={(e) =>
                setSelectedIntolerances((prev) =>
                  e.target.checked
                    ? [...prev, item]
                    : prev.filter((i) => i !== item)
                )
              }
            />
            {item}
          </label>
        ))}
      </div>

      <button className="recipes__button" onClick={handleSearch}>
        Search
      </button>

      {recipes.length > 0 && (
        <div className="recipes__list">
          <h2 className="recipes__list-title">Recipes</h2>
          {recipes.map((recipe) => (
            <a
              key={recipe.id}
              href={`https://spoonacular.com/recipes/${recipe.title.replace(
                /\s+/g,
                "-"
              )}-${recipe.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="recipes__card"
            >
              <h3 className="recipes__card-title">{recipe.title}</h3>
              <img
                src={recipe.image}
                alt={recipe.title}
                className="recipes__card-image"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
