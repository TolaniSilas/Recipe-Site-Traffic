from pydantic import BaseModel

class PredictionInput(BaseModel):
    """
    This defines the Tasty Bytes recipe site traffic prediction input.
    """
    calories: float
    carbohydrate: float
    sugar: float
    protein: float
    category: str 
    servings: int
        