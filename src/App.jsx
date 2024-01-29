// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/random?apiKey=ef9b141bb0434016904ffe375a903760&number=5`
        );
        setRecipes(response.data.recipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);
  useEffect(() => {
    fetchRecipes();
  }, [searchTerm]);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=ef9b141bb0434016904ffe375a903760&query=${searchTerm}&number=5`
      );
      setRecipes(response.data.results);
      setSelectedRecipe(null);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleImageClick = async (recipe) => {
    try {
      const detailedResponse = await axios.get(
        `https://api.spoonacular.com/recipes/${recipe.id}/analyzedInstructions?apiKey=ef9b141bb0434016904ffe375a903760`
      );
  
      
      const instructions =
        detailedResponse.data.length > 0
          ? detailedResponse.data[0].steps.map((step) => step.step)
          : [];
  
      setSelectedRecipe({ ...recipe, instructions });
    } catch (error) {
      console.error('Error fetching detailed recipe information:', error);
      
      setSelectedRecipe(recipe);
    }
  };
  

  const handleSearch = () => {
    fetchRecipes();
  };

  return (
    <div className="container">
      <div>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search for recipes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
      <div className="food-images">
        {recipes.map((recipe) => (
          <img
            key={recipe.id}
            src={recipe.image}
            alt={recipe.title}
            className="food-image"
            onClick={() => handleImageClick(recipe)}
          />
        ))}
      </div>
      <div className="recipe-details">
        {selectedRecipe && (
          <div>
            <h2>{selectedRecipe.title}</h2>
            <p>{selectedRecipe.summary}</p>
            <p>Instructions: {selectedRecipe.instructions}</p>
          </div>
        )}
      </div>
      <ul className="recipe-list">
        {recipes.map((recipe) => (
          <li key={recipe.id} className="recipe-item">
            {recipe.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
