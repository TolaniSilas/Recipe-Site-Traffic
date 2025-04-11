# import os
# import sys

# # Add the project root directory to the Python path.
# project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # Go up three levels
# sys.path.append(project_root)

# from src.model import TastyModel



# # Generate recipe traffic prediction and probability.
# traffic_category, prediction_probability = model.predict_traffic_increase(35.48, 38.56, 0.78, 0.92, "Potato", 4)

# # Prepare the response in a serializable format.
# response = {
#     "prediction": str(traffic_category),
#     "probability": float(prediction_probability)
# }

# print(response)