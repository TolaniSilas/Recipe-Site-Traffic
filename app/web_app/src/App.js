import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Target, Bot, Rocket } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; 
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles

// Register the required components.
ChartJS.register(ArcElement, Tooltip, Legend);

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

const CATEGORY_OPTIONS = [
  "Beverages",
  "Breakfast",
  "Chicken",
  "Dessert",
  "Lamb",
  "Lunch/Snacks",
  "Potato",
  "Pork",
  "Beef",
  "Vegetable",
];

function App() {
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

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1150, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once
    });
  }, []);

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
      const payload = {
        calories: Number(formData.calories),
        carbohydrate: Number(formData.carbohydrate),
        sugar: Number(formData.sugar),
        protein: Number(formData.protein),
        category: formData.category,
        servings: Number(formData.servings),
      };
      const response = await fetch(`${API_BASE_URL}/recipe_type`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      setErrorMessage("Failed to fetch prediction. Please try again!");
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

  const chartData = {
    labels: ["Predicted traffic", "Other"],
    datasets: [
      {
        data: [
          responseData.trafficProbability * 100 || 0,
          100 - (responseData.trafficProbability * 100 || 0) || 100,
        ],
        backgroundColor: ["#08bfad", "rgba(8, 191, 173, 0.2)"],
        borderWidth: 0,
      },
    ],
  };

  const isHighTraffic = responseData.prediction && String(responseData.prediction).toLowerCase().includes("high");

  return (
    <div className="app-shell" data-theme={darkMode ? "dark" : "light"}>
      <nav className="navbar navbar-expand-lg navbar-theme">
        <div className="container">
          <a className="navbar-brand fw-bold nav-brand" href="/">
            TastyBytes
          </a>

          <div className="d-lg-none d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-link text-decoration-none p-2 nav-theme-btn"
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <i className={darkMode ? "bi bi-sun-fill fs-5" : "bi bi-moon-fill fs-5"} />
            </button>
            <button
              className="navbar-toggler nav-toggler-btn"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
              aria-label="Open menu"
            >
              <span className="navbar-toggler-icon" />
            </button>
          </div>

          <div className="collapse navbar-collapse d-none d-lg-flex justify-content-end align-items-center">
            <ul className="navbar-nav d-flex align-items-center gap-2">
              <li className="nav-item">
                <a href="#prediction" className="nav-cta">
                  Run Prediction
                </a>
              </li>
              <li className="nav-item">
                <a href="#about" className="nav-cta">
                  About
                </a>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-link text-decoration-none p-2 nav-theme-btn"
                  onClick={toggleDarkMode}
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  <i className={darkMode ? "bi bi-sun-fill fs-5" : "bi bi-moon-fill fs-5"} />
                </button>
              </li>
            </ul>
          </div>

          <div
            className={`offcanvas offcanvas-end d-lg-none ${darkMode ? "bg-dark text-white" : "bg-light"}`}
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header offcanvas-header-theme">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
              <button type="button" className={`btn-close offcanvas-close-btn ${darkMode ? "btn-close-white" : ""}`} data-bs-dismiss="offcanvas" aria-label="Close" />
            </div>
            <div className="offcanvas-body d-flex flex-column align-items-center pt-4">
              <a href="#prediction" className="nav-cta mb-3 w-100 text-center" data-bs-dismiss="offcanvas">
                Run Prediction
              </a>
              <a href="#about" className="nav-cta mb-3 w-100 text-center" data-bs-dismiss="offcanvas">
                About
              </a>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero-section" data-aos="fade-up">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-md-6 text-md-start">
              <h2 className="fw-bold mb-3">Discover the Power of Recipe Insights</h2>
              <p className="mb-0">Predict which recipes will drive traffic and subscriptions.</p>
            </div>
            <div className="col-md-6 text-center">
              <img src="/images/hero-image.jpeg" alt="Recipe insight" className="img-fluid rounded shadow" />
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="about-section py-5" data-aos="fade-right">
        <div className="container text-center">
          <h2 className="section-title mb-4">About Tasty Bytes</h2>
          <p className="about-description mx-auto" style={{ maxWidth: "720px" }}>
            Tasty Bytes is a <span className="text-highlight">data-driven platform</span> that predicts recipe traffic and uncovers actionable insights. Our mission is to help decision-makers in the food industry spotlight recipes that resonate with users.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-4 mt-5 text-start">
            <div className="about-card" data-aos="fade-left">
              <h3 className="text-warning d-flex align-items-center gap-2">
                <Target size={22} aria-hidden />
                The Challenge
              </h3>
              <p>Choosing which recipes to feature was often guesswork, leading to inconsistent engagement and missed opportunities.</p>
            </div>
            <div className="about-card" data-aos="fade-up">
              <h3 className="text-success d-flex align-items-center gap-2">
                <Bot size={22} aria-hidden />
                The Solution
              </h3>
              <p>We use machine learning to predict which recipes attract high traffic, replacing guesswork with data-backed decisions.</p>
            </div>
            <div className="about-card" data-aos="fade-right">
              <h3 className="text-info d-flex align-items-center gap-2">
                <Rocket size={22} aria-hidden />
                The Result
              </h3>
              <p>Confidently choose recipes that drive engagement and grow subscribers—better homepages and more traffic.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="prediction" className="container my-5" data-aos="zoom-in">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-9">
            <h2 className="section-title text-center mb-4">Run a Prediction</h2>
            <form className="prediction-form" onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="calories" className="form-label">Calories (per serving)</label>
                  <input
                    id="calories"
                    className="form-control"
                    type="number"
                    min="0"
                    step="1"
                    name="calories"
                    placeholder="e.g. 200"
                    value={formData.calories}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="carbohydrate" className="form-label">Carbohydrate (g)</label>
                  <input
                    id="carbohydrate"
                    className="form-control"
                    type="number"
                    min="0"
                    step="0.1"
                    name="carbohydrate"
                    placeholder="e.g. 50"
                    value={formData.carbohydrate}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="sugar" className="form-label">Sugar (g)</label>
                  <input
                    id="sugar"
                    className="form-control"
                    type="number"
                    min="0"
                    step="0.1"
                    name="sugar"
                    placeholder="e.g. 20"
                    value={formData.sugar}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="protein" className="form-label">Protein (g)</label>
                  <input
                    id="protein"
                    className="form-control"
                    type="number"
                    min="0"
                    step="0.1"
                    name="protein"
                    placeholder="e.g. 10"
                    value={formData.protein}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="category" className="form-label">Category</label>
                  <select
                    id="category"
                    className="form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select category</option>
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="servings" className="form-label">Servings</label>
                  <input
                    id="servings"
                    className="form-control"
                    type="number"
                    min="1"
                    step="1"
                    name="servings"
                    placeholder="e.g. 4"
                    value={formData.servings}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="d-flex flex-wrap gap-2 justify-content-center mt-4">
                <button className="btn btn-predict" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2 loading-spinner" role="status" aria-hidden="true" />
                      Predicting…
                    </>
                  ) : (
                    "Predict"
                  )}
                </button>
                <button className="btn btn-clear" type="button" onClick={handleClear} disabled={isLoading}>
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>

        {errorMessage && (
          <div className="alert alert-danger alert-api mt-3" role="alert">
            {errorMessage}
          </div>
        )}
      </section>

      {responseData.prediction && (
        <section className="container my-5 text-center" data-aos="fade-up">
          <div className="result-card">
            <h3 className="section-title mb-3">Prediction Results</h3>
            <p className="mb-2">
              Traffic is predicted as{" "}
              <span className={`badge badge-traffic ${isHighTraffic ? "bg-success" : "bg-secondary"}`}>
                {responseData.prediction}
              </span>
            </p>
            <p className="mb-4 text-muted">
              Confidence: <strong style={{ color: "var(--brand)" }}>{(responseData.trafficProbability * 100).toFixed(1)}%</strong>
            </p>
            <div className="result-chart-wrap">
              <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          </div>
        </section>
      )}

      <footer className="footer-bar text-center py-4">
        <p>Tasty Bytes · Powered by FastAPI & React</p>
      </footer>
    </div>
  );
}

export default App;