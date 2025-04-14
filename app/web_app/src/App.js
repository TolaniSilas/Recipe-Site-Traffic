import React, { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    calories: "",
    carbohydrate: "",
    sugar: "",
    protein: "",
    category: "",
    servings: "",
  });

  const [responseData, setResponseData] = useState({
    prediction: null,
    trafficProbability: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0:8000/recipe_type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResponseData({
        prediction: data.prediction,
        trafficProbability: data.trafficProbability,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Recipe Traffic Prediction</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="calories"
          placeholder="Calories"
          value={formData.calories}
          onChange={handleChange}
        />
        <input
          type="text"
          name="carbohydrate"
          placeholder="Carbohydrate"
          value={formData.carbohydrate}
          onChange={handleChange}
        />
        <input
          type="text"
          name="sugar"
          placeholder="Sugar"
          value={formData.sugar}
          onChange={handleChange}
        />
        <input
          type="text"
          name="protein"
          placeholder="Protein"
          value={formData.protein}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />
        <input
          type="text"
          name="servings"
          placeholder="Servings"
          value={formData.servings}
          onChange={handleChange}
        />
        <button type="submit">Predict</button>
      </form>
      {responseData.prediction && (
        <div>
          <p>Prediction: {responseData.prediction}</p>
          <p>Traffic Probability: {responseData.trafficProbability}</p>
        </div>
      )}
    </div>
  );
}

export default App;

