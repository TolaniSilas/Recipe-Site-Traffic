# Tasty Bytes - ML Backend API

FastAPI service that predicts **high** or **low** recipe site traffic using a trained scikit-learn model. Consumed by the Tasty Bytes web app.

## Requirements

- **Python 3.10+**
- **Model artifact:** `models/tasty_model1.joblib` at the **repository root** (create via training with `TastyModel` if missing).

## Setup

From the **repository root**:

```bash
uv sync
```

## Run

From the **repository root** (so `src` and `models/` resolve):

```bash
uvicorn app.api_dev.main:app --host 127.0.0.1 --port 8000 --reload
```

- **Base URL:** `http://127.0.0.1:8000`
- **Health:** `GET /health`
- **Predict:** `POST /recipe_type` - JSON: `calories`, `carbohydrate`, `sugar`, `protein`, `category`, `servings`. Returns `prediction` and `trafficProbability`.

Request/response schemas: see `schemas.py`. Interactive docs: `http://127.0.0.1:8000/docs`.

## Production Usage Recommendation

- Set `allow_origins` in CORS middleware to your frontend origin(s).
- Run with a production ASGI server (e.g. `uvicorn main:app --host 0.0.0.0 --port 8000` from a context where `app.api_dev.main` is importable).
- For Docker, build from the repo root so the image includes `src/` and `models/`.
