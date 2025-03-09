from typing import Tuple


class TastyModel:
    """Represents a recipe and predicts its potential impact on website traffic."""

    def __init__(self, calories: float, carbohydrate: float, sugar: float, 
                 protein: float, category: str, servings: int):
        """Initializes a TastyBytesModel instance.

        Args:
            calories (float): The number of calories in the recipe.
            carbohydrate (float): The amount of carbohydrates in grams.
            sugar (float): The amount of sugar in grams.
            protein (float): The amount of protein in grams.
            category (str): The recipe category (e.g., "Dessert", "Vegan").
            servings (int): The number of servings.
        """

        self.calories = calories
        self.carbohydrate = carbohydrate
        self.sugar = sugar
        self.protein = protein
        self.category = category
        self.servings = servings


    def predict_traffic_increase(self) -> tuple[str, float]:
        """Predicts the potential increase in website traffic based on recipe features.

        Returns:
            tuple[str, float]: A tuple containing the predicted traffic category 
            ('High Traffic', 'Low Traffic') and the confidence score in prediction (between 0 and 1).
        """
        # Example heuristic-based prediction logic for traffic increase
        traffic_score = (
            (self.protein * 0.4) + 
            (self.carbohydrate * 0.3) - 
            (self.sugar * 0.2) + 
            (self.servings * 0.1)
        )
        
        # Normalize the traffic score between 0 and 1
        predicted_traffic_increase = min(max(traffic_score, 0), 1)

        # Categorize the traffic impact
        if predicted_traffic_increase > 0.5:
            traffic_category = "High Traffic"
            
        else:
            traffic_category = "Low Traffic"

        return traffic_category, predicted_traffic_increase
    