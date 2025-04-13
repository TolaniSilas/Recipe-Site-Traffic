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

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setPrediction(data.result);
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
      {prediction && <p>Prediction: {prediction}</p>}
    </div>
  );
}

export default App;


