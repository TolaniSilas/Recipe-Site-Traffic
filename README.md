# Recipe Site Traffic
This repository is tasked with assisting Tasty Bytes Company in the decision-making process for selecting which recipes should be displayed on the homepage in order to increase website traffic, thereby boosting subscriptions.


## Problem statement

The product team at Tasty Bytes needs a data-driven way to decide **which recipes to feature on the homepage** to increase traffic and subscriptions. The request is to build a system that can **predict which recipes will be popular at least 80% of the time** while minimizing the chance of showing unpopular recipes. There isn’t time for a perfect solution, so the goal is to design a practical end‑to‑end pipeline, document the key decisions, and deliver a clear report and presentation for non‑technical stakeholders.

## Solution overview

- **Data-driven modeling**: Use historical recipe traffic data to learn patterns from nutrition and category features.
- **ML backend API**: Serve a trained classification model behind a **FastAPI** service that predicts **High** vs **Low** traffic and returns a probability.
- **Interactive web app**: Provide a **React** frontend where product and content teams can quickly test recipe ideas and visualize confidence.
- **Transparent reporting**: Capture assumptions, trade‑offs, and results in code, documentation, and a short narrative report that can be shared with the product team.

## Architecture

- **ML backend (`src/`, `app/api_dev/`)**
  - **Model & training utilities**:
    - `src/model/TastyBytesModel.py`: `TastyModel` class with preprocessing (scaling, encoding), model training, cross‑validation, metrics, feature importance, and model save/load (`joblib`).
    - `src/utils.py`: helper functions (e.g. IQR-based outlier handling, Optuna objective for hyperparameter tuning).
  - **API service**:
    - `app/api_dev/main.py`: FastAPI app exposing:
      - `GET /health` - health check.
      - `POST /recipe_type` - takes nutrition + category + servings, loads `models/tasty_model1.joblib`, and returns `prediction` (`"High Traffic"` / `"Low Traffic"`) and `trafficProbability` (0-1).
    - `app/api_dev/schemas.py`: Pydantic models for **request** (`PredictionInput`) and **response** (`PredictionOutput`).

- **Frontend web app (`app/web_app/`)**
  - React SPA (`App.js`, `index.js`) with:
    - A hero and “About Tasty Bytes” section explaining the challenge/solution/result for stakeholders.
    - A prediction form for entering **calories, carbohydrate, sugar, protein, category, servings**.
    - A results panel with **label + probability** and a pie chart (Chart.js / `react-chartjs-2`).
    - Modern UI built with **Bootstrap 5**, **Bootstrap Icons**, **Lucide React**, and **AOS** animations.
    - Optional **dark mode** toggle for better usability.

- **Data & documentation**
  - Raw/processed data files in `data/` (e.g. `recipe_site_traffic_2212.csv`, `cleaned_data.csv`).
  - Project brief and analysis prompt in `Practical+-+DSP+-+Recipe+Site+Traffic+-+2212.pdf`.
  - Top-level `LICENSE` (Apache 2.0).

## Getting started

### Backend (ML API)

- **Prerequisites**
  - Python **3.10+**
  - `uv` (recommended) or `pip`

- **Install dependencies** (from the repository root):

  