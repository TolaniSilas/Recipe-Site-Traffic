from fastapi import FastAPI, HTTPException, Request
from .schemas import PredictionInput
from src import TastyBytesModel


# Instantiate the FastAPI application.
app = FastAPI()


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
    Endpoint to predict recipe that would result in low or high traffic on the company's website based on the provided information.

    Args:
        request (PredictionInput): The request body containing the applicant's 
        income, coapplicant's income, loan amount, and credit history.

    Returns:
        dict: A dictionary containing:
            - `prediction` (str): A string indicating whether the recipe will result in 
              high or low traffic on the website ("1.0" for high, "0.0" for low).
            - `probability` (float): A float value representing the probability of the 
              high or low traffic prediction.

    Raises:
        HTTPException: If there is an error during the prediction process, a 500 
        Internal Server Error is raised with the error detail.
    """
    try:
        # Extract user information from the request body.
        calories = request.Calories
        carbohydrate = request.Carbohydrate
        sugar = request.Sugar
        protein = request.Protein
        category = request.Category
        servings = request.Servings
        
        # Initialize the Tasty Bytes model.
        model = TastyBytesModel(
            calories=calories, 
            carbohydrate=carbohydrate, 
            sugar=sugar,
            protein=protein, 
            category=category, 
            servings=servings
        )

        # Generate recipe traffic prediction and probability.
        traffic_category, prediction_probability = model.predict_traffic_increase()
        
        # Prepare the response in a serializable format.
        response = {
            "prediction": str(traffic_category),
            "probability": float(prediction_probability)
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