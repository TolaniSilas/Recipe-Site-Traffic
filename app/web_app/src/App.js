import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JavaScript

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
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#08bfad" }}>
        <div className="container">
          {/* TastyBytes Logo */}
          <a className="navbar-brand text-white fs-3 fw-bold" href="#" style={{ fontFamily: 'Playfair Display, serif' }}>
            TastyBytes
          </a>

          {/* Mobile View: Toggle Button and Dark Mode */}
          <div className="d-lg-none d-flex align-items-center">
            <button
              className="btn btn-link text-white text-decoration-none me-3"
              onClick={toggleDarkMode}
              style={{ fontSize: "1.5rem" }}
            >
              <i className={darkMode ? "bi bi-sun-fill" : "bi bi-moon-fill"}></i>
            </button>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
              style={{
                borderColor: "white",
                fontSize: "0.8rem",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0ec3f0")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          {/* Large Screen: Inline Navigation */}
          <div className="collapse navbar-collapse d-none d-lg-flex justify-content-end align-items-center">
            <ul className="navbar-nav d-flex align-items-center">
              <li className="nav-item me-2">
                <a
                  href="#prediction"
                  className="btn"
                  style={{
                    backgroundColor: "#09a5ed", // Button background color
                    color: "white", // Text color
                    border: "none",
                    padding: "7px 15px",
                    borderRadius: "6px",
                  }}
                >
                  Run Prediction
                </a>
              </li>
              <li className="nav-item me-2">
                <a
                  href="#about"
                  className="btn"
                  style={{
                    backgroundColor: "#09a5ed", // Button background color
                    color: "white", // Text color
                    border: "none",
                    padding: "7px 15px",
                    borderRadius: "6px",
                  }}
                >
                  About
                </a>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-link text-white text-decoration-none"
                  onClick={toggleDarkMode}
                  style={{ fontSize: "1.5rem" }}
                >
                  <i className={darkMode ? "bi bi-sun-fill" : "bi bi-moon-fill"}></i>
                </button>
              </li>
            </ul>
          </div>

          {/* Offcanvas Menu for Mobile */}
          <div
            className={`offcanvas offcanvas-end d-lg-none ${darkMode ? "bg-dark text-white" : "bg-light text-dark"}`}
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            style={{
              width: "80%",
              height: "90%",
              transition: "transform 0.3s ease-in-out", // Faster transition (0.3s)
            }}
          >
            <div className="offcanvas-header" style={{ backgroundColor: "#08bfad" }}>
              <h5 className="offcanvas-title text-white" id="offcanvasNavbarLabel">
                Menu
              </h5>
              <button
                type="button"
                className="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body d-flex flex-column align-items-center">
              <ul className="navbar-nav w-100">
                <li className="nav-item mb-3 text-center">
                  <a
                    href="#prediction"
                    className="btn"
                    style={{
                      backgroundColor: "#09a5ed", // Button background color
                      color: "white", // Text color
                      border: "none",
                      padding: "10px 15px", // Adjust padding for smaller buttons
                      borderRadius: "4px",
                    }}
                  >
                    Run Prediction
                  </a>
                </li>
                <li className="nav-item mb-3 text-center">
                  <a
                    href="#about"
                    className="btn"
                    style={{
                      backgroundColor: "#09a5ed", // Button background color
                      color: "white", // Text color
                      border: "none",
                      padding: "10px 15px", // Adjust padding for smaller buttons
                      borderRadius: "4px",
                    }}
                  >
                    About
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container text-center my-5">
        <h2 className="animate__animated animate__fadeInDown">Welcome to TastyBytes</h2>
        <p className="animate__animated animate__fadeInUp">
          Your go-to app for predicting recipe traffic and analyzing recipe data.
        </p>
        <img
          src="https://dribbble.com/shots/25339033-Mingola-Bakery-Logo-Design-Branding?utm_source=Clipboard_Shot&utm_campaign=Aditya-Chhatrala&utm_content=Mingola%20Bakery%20Logo%20Design%20%26%20Branding&utm_medium=Social_Share&utm_source=Clipboard_Shot&utm_campaign=Aditya-Chhatrala&utm_content=Mingola%20Bakery%20Logo%20Design%20%26%20Branding&utm_medium=Social_Share"
          alt="Recipe Types"
          className="img-fluid rounded shadow animate__animated animate__zoomIn"
        />
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-white px-3 px-md-5">
        <div className="container text-center">
          <h2 className="text-primary fw-bold mb-4 animate__animated animate__fadeInDown">About Tasty Bytes</h2>
          <p className="text-secondary fs-5 animate__animated animate__fadeInUp">
            Tasty Bytes is a powerful, data-driven platform built to predict recipe traffic and uncover actionable insights into recipe performance. Our mission is to empower decision-makers in the food industry with the intelligence they need to spotlight recipes that truly resonate with users.
          </p>

          <div className="row row-cols-1 row-cols-md-3 g-4 mt-5 text-start">
            {/* Challenge */}
            <div
              className="col p-3 animate__animated animate__fadeInLeft"
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow for depth
              }}
            >
              <h3 className="text-warning fw-bold">🎯 The Challenge</h3>
              <p className="text-muted mt-2">
                Selecting which recipes to feature has often relied on guesswork or random choices, leading to poor performance and missed opportunities. The lack of a structured, predictive approach resulted in inconsistent user engagement and ineffective homepage content.
              </p>
            </div>

            {/* Solution */}
            <div
              className="col p-3 animate__animated animate__fadeInUp"
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow for depth
              }}
            >
              <h3 className="text-success fw-bold">🤖 The Solution</h3>
              <p className="text-muted mt-2">
                Tasty Bytes leverages machine learning to accurately predict which types of recipes are most likely to attract high user traffic. By analyzing historical data and identifying performance trends, it replaces guesswork with smart, data-backed decision-making.
              </p>
            </div>

            {/* Result */}
            <div
              className="col p-3 animate__animated animate__fadeInRight"
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow for depth
              }}
            >
              <h3 className="text-danger fw-bold">🚀 The Result</h3>
              <p className="text-muted mt-2">
                With Tasty Bytes, chefs, stakeholders, product managers, bloggers, and food brands can confidently choose recipes that drive engagement and grow subscriber bases. The result? More informed decisions, better-performing homepages, and a delicious increase in traffic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prediction Section */}
      <section id="prediction" className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <h2 className="text-center mb-4">Run a Prediction</h2>
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
              <div className="text-center">
                <button className="btn btn-primary" type="submit">
                  Predict
                </button>
                <button className="btn btn-secondary ms-2" type="button" onClick={handleClear}>
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

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
      {/* Footer */}
      <footer
        className="text-center py-3"
        style={{ backgroundColor: "#08bfad", color: "white" }}
      >
        <p>
          Tasty Bytes | Powered by FastAPI and React
        </p>
      </footer>
    </div>
  );
}

export default App;