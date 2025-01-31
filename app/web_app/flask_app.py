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
        str: A placeholder response ("Hi") for now.
    """

    if request.method == "POST":

        # Extract the data infromation from the submitted form.
        data_info = request.form
        





    return "Hi"


# Run the Flask application if this script is executed directly
if __name__ == "__main__":
    app.run(debug=True)




if __name__ == "__main__":

    # Run the Flask app with debugging set to False(Production Environment).
    app.run(debug=True)

