from typing import Any, Dict
import pytest
from fastapi.testclient import TestClient
from app.api_dev import main as main_module


@pytest.fixture
def sample_payload() -> Dict[str, Any]:
    """valid payload matching PredictionInput schema."""

    return {
        "calories": 250.0,
        "carbohydrate": 45.0,
        "sugar": 18.0,
        "protein": 12.0,
        "category": "Dessert",
        "servings": 4,
    }



def test_health_endpoint(client: TestClient) -> None:
    """health check should return 200 and expected json."""

    # make a GET request to the /health endpoint.
    response = client.get("/health")

    # verify the endpoint returns a 200 status code, indicating a successful request.
    assert response.status_code == 200

    # verify the health endpoint returns the expected json response.
    assert response.json() == {"status": "Service is running!"}



def test_recipe_type_success(monkeypatch: pytest.MonkeyPatch, client: TestClient, sample_payload: Dict[str, Any]) -> None:
    """
    /recipe_type returns a valid PredictionOutput payload.

    the TastyModel is monkeypatched so the test does not depend on a real model file.
    """

    # define a fake model class to replace TastyModel during this test.
    class FakeModel:
        def __init__(self) -> None:
            self.loaded_path = None

        def load_model(self, filename: str) -> None:
            self.loaded_path = filename

        def predict_traffic_increase(
            self,
            *,
            calories: float,
            carbohydrate: float,
            sugar: float,
            protein: float,
            category: str,
            servings: int,
        ):
            
            # verify that the model receives the expected input values from the API request.
            assert calories == sample_payload["calories"]

            assert carbohydrate == sample_payload["carbohydrate"]

            assert sugar == sample_payload["sugar"]

            assert protein == sample_payload["protein"]

            assert category == sample_payload["category"]

            assert servings == sample_payload["servings"]


            return "High Traffic", 0.87


    # patch TastyModel in the main module.
    monkeypatch.setattr(main_module, "TastyModel", FakeModel)

    # make a POST request to the /recipe_type endpoint with the sample payload.
    response = client.post("/recipe_type", json=sample_payload)

    # verify the endpoint returns a 200 status code.
    assert response.status_code == 200

    # extract the data from the response. 
    data = response.json()

    # verify the response contains the expected prediction output structure and ensure values accede to contraints.
    assert data["prediction"] == "High Traffic"

    assert isinstance(data["trafficProbability"], float)

    assert 0.0 <= data["trafficProbability"] <= 1.0