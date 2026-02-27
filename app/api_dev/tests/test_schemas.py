from app.api_dev.schemas import PredictionInput, PredictionOutput


def test_prediction_input_model_creates_instance() -> None:
    """PredictionInput accepts valid numeric and string fields."""

    # define a sample payload matching the PredictionInput schema.
    payload = {
        "calories": 200.0,
        "carbohydrate": 40.0,
        "sugar": 15.0,
        "protein": 10.0,
        "category": "Lunch/Snacks",
        "servings": 2,
    }

    # create an instance of PredictionInput to verify that the schema correctly validates and assigns the input data.
    instance = PredictionInput(**payload)

    # verify that the instance fields match the input payload values.
    assert instance.calories == 200.0
    
    assert instance.category == "Lunch/Snacks"
    
    assert instance.servings == 2



def test_prediction_output_model_creates_instance() -> None:
    """PredictionOutput constrains probability to 0-1."""

    # create an instance of PredictionOutput to verify that the schema correctly validates the response or output data.
    result = PredictionOutput(prediction="High Traffic", trafficProbability=0.92)

    # verify that the instance fields match the expected output values and constraints.
    assert result.prediction == "High Traffic"
    
    assert 0.0 <= result.trafficProbability <= 1.0

