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

## Repository structure

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

## Contributing

Contributions are welcome. Please open an issue or submit a pull request with a clear description of your change.


## License

This project is licensed under the MIT License. See the [`LICENSE`](LICENSE) file for the full text and terms.