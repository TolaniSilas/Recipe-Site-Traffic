import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons
import "./App.css";

function App() {
  // State for form data
  const [formData, setFormData] = useState({
    calories: "",
    carbohydrate: "",
    sugar: "",
    protein: "",
    category: "",
    servings: "",
  });

  // State for backend response
  const [responseData, setResponseData] = useState({
    prediction: null,
    trafficProbability: null,
  });

  // State for loading, error, and dark mode
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    setIsLoading(true); // Start loading

    // Validate form data
    if (!formData.calories || !formData.carbohydrate || !formData.sugar || !formData.protein || !formData.category || !formData.servings) {
      alert("Please fill in all fields.");
      setIsLoading(false);
      return;
    }
    if (isNaN(formData.calories) || isNaN(formData.carbohydrate) || isNaN(formData.sugar) || isNaN(formData.protein) || isNaN(formData.servings)) {
      alert("Please enter valid numbers for numeric fields.");
      setIsLoading(false);
      return;
    }

    // Proceed with the fetch request
    try {
      const response = await fetch("http://127.0.0.1:8000/recipe_type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResponseData({
        prediction: data.prediction,
        trafficProbability: data.trafficProbability,
      });
    } catch (error) {
      setErrorMessage("Failed to fetch prediction. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Handle form reset
  const handleClear = () => {
    setFormData({
      calories: "",
      carbohydrate: "",
      sugar: "",
      protein: "",
      category: "",
      servings: "",
    });
    setResponseData({
      prediction: null,
      trafficProbability: null,
    });
  };

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Save form data to localStorage
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  // Load form data from localStorage
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("formData"));
    if (savedData) setFormData(savedData);
  }, []);

  // Chart data for traffic probability
  const chartData = {
    labels: ["Traffic Probability", "Remaining"],
    datasets: [
      {
        data: [
          responseData.trafficProbability * 100 || 0,
          100 - responseData.trafficProbability * 100 || 100,
        ],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  return (
    <div className={darkMode ? "bg-dark text-white" : "bg-light text-dark"}>
      {/* Header Bar */}
      <header className="container-fluid py-3 bg-primary text-white d-flex justify-content-between align-items-center">
        <span className="fs-3 fw-bold">TastyBytes</span>
        <div>
          <a href="#prediction" className="text-white me-3 text-decoration-none">
            Run Prediction
          </a>
          <a href="#about" className="text-white me-3 text-decoration-none">
            About
          </a>
          <button
            className="btn btn-link text-white text-decoration-none"
            onClick={toggleDarkMode}
            style={{ fontSize: "1.5rem" }}
          >
            <i className={darkMode ? "bi bi-sun-fill" : "bi bi-moon-fill"}></i>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container text-center my-5">
        <h2>Welcome to TastyBytes</h2>
        <p>Your go-to app for predicting recipe traffic and analyzing recipe data.</p>
        <img
          src="https://via.placeholder.com/600x300" // Replace with your image URL
          alt="Recipe Types"
          className="img-fluid rounded shadow"
        />
      </section>

      {/* About Section */}
      <section id="about" className="container my-5 p-4" style={{ backgroundColor: "#f8f9fa" }}>
        <h2>About TastyBytes</h2>
        <p>
          TastyBytes is a powerful tool designed to predict recipe traffic and provide insights into recipe performance. 
          This project contributes to the food industry by helping chefs, bloggers, and food enthusiasts understand 
          which recipes are likely to attract more traffic.
        </p>
      </section>

      {/* Prediction Section */}
      <section id="prediction" className="container my-5">
        <h2>Run a Prediction</h2>
        <form className="p-4 bg-light rounded shadow" onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            type="text"
            name="calories"
            placeholder="Calories"
            value={formData.calories}
            onChange={handleChange}
            title="Enter the number of calories in the recipe (e.g., 200)"
          />
          <input
            className="form-control mb-3"
            type="text"
            name="carbohydrate"
            placeholder="Carbohydrate"
            value={formData.carbohydrate}
            onChange={handleChange}
            title="Enter the amount of carbohydrates in grams (e.g., 50)"
          />
          <input
            className="form-control mb-3"
            type="text"
            name="sugar"
            placeholder="Sugar"
            value={formData.sugar}
            onChange={handleChange}
            title="Enter the amount of sugar in grams (e.g., 20)"
          />
          <input
            className="form-control mb-3"
            type="text"
            name="protein"
            placeholder="Protein"
            value={formData.protein}
            onChange={handleChange}
            title="Enter the amount of protein in grams (e.g., 10)"
          />
          <input
            className="form-control mb-3"
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            title="Enter the recipe category (e.g., Dessert)"
          />
          <input
            className="form-control mb-3"
            type="text"
            name="servings"
            placeholder="Servings"
            value={formData.servings}
            onChange={handleChange}
            title="Enter the number of servings (e.g., 4)"
          />
          <button className="btn btn-primary" type="submit">
            Predict
          </button>
          <button className="btn btn-secondary ms-2" type="button" onClick={handleClear}>
            Clear
          </button>
        </form>

        {isLoading && <p className="text-center mt-3">Loading...</p>}
        {errorMessage && <p className="text-danger text-center mt-3">{errorMessage}</p>}
        {responseData.prediction && (
          <div className="mt-4 text-center">
            <h3>Prediction Results</h3>
            <p><strong>Prediction:</strong> {responseData.prediction}</p>
            <p><strong>Traffic Probability:</strong> {responseData.trafficProbability}</p>
            <div className="mt-4">
              <Pie data={chartData} />
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center py-3" style={{ backgroundColor: "#343a40", color: "white" }}>
        <p>Recipe Traffic Prediction App © 2025</p>
        <p>Powered by FastAPI and React</p>
      </footer>
    </div>
  );
}

export default App;

