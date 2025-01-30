from pydantic import BaseModel

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
    
    calories: float      # Total energy content in kilocalories (must be >0)
    carbohydrate: float  # Carbohydrate content in grams
    sugar: float         # Total sugar content in grams
    protein: float       # Protein content in grams
    category: str        # Meal type/category (e.g., 'vegetarian', 'quick meals')
    servings: int        # Number of servings yielded (minimum 1 serving)