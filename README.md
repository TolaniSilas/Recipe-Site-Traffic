# Recipe Site Traffic
This repository is tasked with assisting Tasty Bytes Company in the decision-making process for selecting which recipes should be displayed on the homepage in order to increase website traffic, thereby boosting subscriptions.

## Problem statement

The product team at Tasty Bytes needs a data-driven way to choose which recipes to feature on the homepage so they can **maximize high-traffic recipes** and **minimize low-traffic ones**, with a target of correctly identifying popular recipes around 80% of the time.

## Solution

This project delivers an end-to-end system that:

- **Trains and serves** a scikit-learn model via a **FastAPI** backend to predict **High** vs **Low** recipe traffic and return a probability.
- Exposes an **interactive React + Bootstrap web app** where users enter recipe details and see a prediction with confidence.
- Uses historical recipe traffic data to learn patterns from nutrition and category features.

For detailed setup and usage, see:

- Backend API: `app/api_dev/README.md`
- Frontend web app: `app/web_app/README.md`

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/TolaniSilas/Recipe-Site-Traffic.git

cd Recipe-Site-Traffic
```

### 2. Install uv (Python package manager)

On Linux/macOS:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Verify:

```bash
uv --version
```

### 3. Create and activate a virtual environment (uv)

```bash
uv venv           # creates .venv in the project root

source .venv/bin/activate  # activate (Linux/macOS)
```

With the venv active, you can install Python dependencies using `uv sync` as shown in the quick start below.

## Quick start

From the **repository root**:

### 1. Backend API (FastAPI)

```bash
# Install Python dependencies (using uv + pyproject.toml)
uv sync

# Run API (development)
uvicorn app.api_dev.main:app --host 127.0.0.1 --port 8000 --reload
```

- Base URL: `http://127.0.0.1:8000`
- Docs: `http://127.0.0.1:8000/docs`
- Requires a trained model at `models/tasty_model1.joblib`.

More details and production notes: `app/api_dev/README.md`.

### 2. Frontend web app (React)

```bash
cd app/web_app
npm install
npm start
```

- App: `http://localhost:3000`
- Expects the API at `http://127.0.0.1:8000`.

Build & deployment details: `app/web_app/README.md`.

## Project structure

```text
Recipe-Site-Traffic
├── app/
│   ├── api_dev/        # fastAPI backend (ML API)
│   └── web_app/        # react SPA frontend
├── src/
│   ├── model/          # TastyModel and ML logic
│   └── utils.py        # preprocessing, optuna objective, and other helper function.
├── data/               # recipe traffic datasets
├── models/             # saved or stored trained model 
├── pyproject.toml      # python project config & dependencies
├── README.md           # this current file
└── LICENSE             # MIT license
```

## Testing

### 1. Python unit & API tests

All backend tests live under `app/api_dev/tests/` and use **pytest**.

From the **repository root** (with your virtualenv active and deps installed via `uv sync`):

```bash
uv run pytest app/api_dev/tests --headed
```

This runs:

- `test_main_api.py` – FastAPI endpoints (`/health`, `/recipe_type`) using a TestClient (model is monkeypatched, so no real `.joblib` required).
- `test_schemas.py` – Pydantic request/response models (`PredictionInput`, `PredictionOutput`).

### 2. Playwright end-to-end test (web + API)

There is a basic E2E test in `app/api_dev/tests/test_app_e2e_playwright.py` that:

- Starts a real browser (Chromium via Playwright).
- Navigates to the React app.
- Fills the prediction form and submits.
- Asserts that **Prediction Results** and a probability percentage are shown.

To run it:

1. Ensure **backend and frontend are running** ( via local dev servers). Check the web_app readme.md and api_dev readme.md to do this.
2. Install Playwright and browsers (Chromium only if you prefer):

   ```bash
   uv pip install playwright pytest-playwright --system
   uv run playwright install chromium
   ```

3. Run the E2E test:

   ```bash
   pytest app/api_dev/tests/test_app_e2e_playwright.py

   # or using headed (visible browser):

   # pytest app/api_dev/tests/test_app_e2e_playwright.py --headed
   ```

## Contributing

Contributions are welcome. Please open an issue or submit a pull request with a clear description of your change.


## License

This project is licensed under the MIT License. See the [`LICENSE`](LICENSE) file for the full text and terms.