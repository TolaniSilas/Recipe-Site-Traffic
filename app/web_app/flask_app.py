# Import necessary libraries.
from flask import Flask, render_template, redirect, jsonify, url_for, request
import requests
import json


# Initialize the Flask application
app = Flask(__name__, template_folder="templates")


@app.route("/", methods=["GET"])
def redirect_to_recipe_traffic():
    """
    Redirects the root URL ("/") to the recipe traffic prediction page.

    This function is useful for ensuring users land on the correct page 
    when they visit the website without specifying a route.
    """
    return redirect("/recipe_traffic/")



@app.route("/recipe_traffic/", methods=["GET", "POST"])
def handle_recipe_traffic():
    """
    Handles requests for the recipe traffic prediction page.

    - GET request: Loads the recipe traffic input form.
    - POST request: Processes user input for recipe traffic prediction.
    
    Returns:
        - JSON response with prediction result on success.
        - JSON error message with status code 400 for invalid inputs.
    """

    if request.method == "POST":

        # Extract data from the submitted form.
        data_info = request.form

        try:

            # Retrieve and convert input values from the form.
            calories = float(data_info.get("calories"))
            carbohydrate = float(data_info.get("carbohydrate"))
            sugar = float(data_info.get("sugar"))  # Fix syntax error here
            protein = float(data_info.get("protein"))
            category = str(data_info.get("category"))
            servings = int(data_info.get("servings"))


        except ValueError:
            # Handle cases where input values are not properly formatted.

            return jsonify({
                "status": "error",
                "code": 400,
                "message": "Invalid input. Please ensure all numerical fields contain valid numbers."
            }), 400

        except Exception as e:
            # Handle unexpected errors gracefully.

            return jsonify({
                "status": "error",
                "code": 500,
                "message": "An unexpected error occurred.",
                "details": str(e)
            }), 500
        
        # Define in a dictionary the data information to send to the model api endpoint.
        input_data = {
            "calories": calories,
            "carbohydrate": carbohydrate,
            "sugar": sugar,
            "protein": protein,
            "category": category,
            "servings": servings
            }
            
        # Call the model FastAPI Endpoint.
        model_endpoint = "https://tastybytes/recipe_traffic_model"

        try:
            response = requests.post(model_endpoint, json=input_data)

            # Raise an error for unsuccessful responses.
            response.raise_for_status()


        except requests.exceptions.RequestException as e:
            return jsonify({"error": f"Error calling the model endpoint: {str(e)}"}), 500
    
        response = response.json()
        
        



    # If the request is GET, render the html page.
    return render_template("index.html")





if __name__ == "__main__":

    # Run the Flask app with debugging set to False(Production Environment).
    app.run(debug=True)

