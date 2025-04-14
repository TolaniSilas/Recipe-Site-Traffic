import os
import sys

# Add the project root directory to the Python path.
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # Go up three levels
sys.path.append(project_root)

from src.model import TastyModel
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from schemas import PredictionInput
from decimal import Decimal


# Instantiate the FastAPI application.
app = FastAPI()

# Add CORS middleware.
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Define a GET endpoint for the health check.
@app.get("/health")
def health():
    """
    Health check endpoint to confirm the service is running.

    Returns:
        dict: A dictionary with a single key "status" and value "Service is running!".
    """
    return {"status": "Service is running!"}


# Define a POST endpoint for predicting loan eligibility based on user information.
@app.post("/recipe_type")
async def recipe_type(request: PredictionInput):
    """
    Endpoint to predict whether a recipe will result in high or low traffic on the company's website.

    Args:
        request (PredictionInput): The request body containing details about the recipe, including:
            - Calories (float): The number of calories in the recipe.
            - Carbohydrate (float): The amount of carbohydrates (in grams).
            - Sugar (float): The sugar content (in grams).
            - Protein (float): The protein content (in grams).
            - Category (str): The category of the recipe.
            - Servings (int): The number of servings the recipe provides.

    Returns:
        dict: A dictionary containing:
            - prediction (str): "1.0" for high traffic, "0.0" for low traffic.
            - probability (float): Probability of the predicted outcome.

    Raises:
        HTTPException: If an error occurs during the prediction process.
    """

    try:
        # Extract user information from the request body.
        calories = request.calories
        carbohydrate = request.carbohydrate
        sugar = request.sugar
        protein = request.protein
        category = request.category
        servings = request.servings


        # Construct the absolute path to the "models" directory.
        model_path = os.path.join(project_root, "models", "tasty_model1.joblib")

        # Initialize the trained Tasty Model.
        model = TastyModel()

        try:
            # Load the model.
            model.load_model(filename=model_path)
            print("Model loaded successfully!")
        except FileNotFoundError:
            print("Model file not found. Check the file path.")
        except Exception as e:
            print(f"An error occurred: {e}")

        # Generate recipe traffic prediction and probability.
        traffic_category, prediction_probability = model.predict_traffic_increase(
            calories=calories, 
            carbohydrate=carbohydrate, 
            sugar=sugar,
            protein=protein, 
            category=category, 
            servings=servings
        )
        
        response = {
            "prediction": str(traffic_category),
            "probability": float(Decimal(prediction_probability).quantize(Decimal("0.01")))  # Round to 2 decimal places
            }
        
        # Return the result as a JSON response.
        return response
        
    except Exception as e:
        # Raise an HTTPException with status code 500 if an error occurs.
        raise HTTPException(status_code=500, detail=str(e))




if __name__ == "__main__":
    """
    Steps:
    1. Import the Uvicorn ASGI server.
    2. Print a message to indicate that the API endpoint is starting.
    3. Run the Uvicorn server with the specified host, port, and reload settings.
    """
    
    import uvicorn
    
    # Print a message to the console indicating the API server is starting.
    print("Starting Model API Endpoint!")
    
    # Start the Uvicorn ASGI server to serve the FastAPI application.
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)