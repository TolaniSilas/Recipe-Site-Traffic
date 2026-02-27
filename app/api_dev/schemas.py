from pydantic import BaseModel, Field


class PredictionInput(BaseModel):
    """
    Defines the input schema for recipe site traffic prediction in the Tasty Bytes application.
    Ensures type validation and provides documentation for API endpoints.

    Attributes:
        calories: Total kilocalories in the recipe (must be positive)
        carbohydrate: Carbohydrate content in grams
        sugar: Total sugar content in grams
        protein: Protein content in grams
        category: Recipe category (e.g., 'Lunch/Snacks', 'Beverages', 'Potato')
        servings: Number of servings the recipe yields (must be ≥1)

    Note:
        All nutritional values should be provided per serving.
    """

    calories: float
    carbohydrate: float
    sugar: float
    protein: float
    category: str
    servings: int



class PredictionOutput(BaseModel):
    """
    Defines the response schema for the recipe traffic prediction endpoint.

    Attributes:
        prediction: Predicted traffic class (e.g. 'High Traffic' or 'Low Traffic').
        trafficProbability: Probability of the predicted class, between 0 and 1.
    """

    prediction: str = Field(..., description="Predicted traffic class, e.g. 'High Traffic' or 'Low Traffic'")
    trafficProbability: float = Field(..., ge=0.0, le=1.0, description="Probability of the predicted class (0-1)")
