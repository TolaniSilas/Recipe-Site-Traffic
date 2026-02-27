from typing import Tuple, List, Union, Tuple
from pathlib import Path
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib



class TastyModel:

    def __init__(self, model=None):
        """
        Initialize the TastyModel.

        This method initializes the TastyModel class with the following attributes:
        - model: The machine learning model to be used for predictions. If no model is provided, 
                 a placeholder message is set indicating that a classifier is needed.
        - preprocessor: A ColumnTransformer object that will be set during the preprocessing step.
        - metrics: A dictionary to store evaluation metrics for the model.

        Args:
            model (optional): A scikit-learn classifier instance. Defaults to None.

        Usage:
            >>> from sklearn.ensemble import RandomForestClassifier
            >>> model = RandomForestClassifier()
            >>> tasty_model = TastyModel(model=model)
        """

        # if model is None:
        #     raise ValueError("A scikit-learn classifier model must be provided!")
        
        self.model = model
        self.preprocessor = None  # This will be set during preprocessing!
        self.metrics = {}

        
    def preprocess(self, df: pd.DataFrame, cols_to_drop: List, target_column: str, test_size: int, cv: bool):
        """Apply preprocessing steps to the input DataFrame.
        
        This method performs the following steps:
        1. Drops specified columns from the DataFrame.
        2. Encodes the target column with binary values (Low -> 0, High -> 1).
        3. Splits the data into training and testing sets with stratification.
        4. Identifies numerical and categorical features.
        5. Applies MinMax scaling to numerical features.
        6. Applies OneHot encoding to categorical features.

        Args:
            df (pd.DataFrame): The input DataFrame containing the data to be preprocessed.
            cols_to_drop (List): A list of column names to be dropped from the DataFrame.
            target_column (str): The name of the target column to be encoded and predicted.
            test_size (int): The proportion of the dataset to include in the test split.

        Returns:
            Tuple: A tuple containing the preprocessed training features, training labels,
                preprocessed testing features, and testing labels.
        """
      
        self.target_column = target_column
        X = df.drop(columns=cols_to_drop, axis=1)
        y = df[self.target_column]

        # Encode target variable: low -> 0, high -> 1.
        y = df[self.target_column].map({'Low': 0, 'High': 1}) 

        if cv:
            
            # Ensure X is in pandas DataFrames.
            X = pd.DataFrame(X, columns=X.columns)
    
            # Identify numerical and categorical features.
            numerical_features = X.select_dtypes(include=['float64', 'int64']).columns.tolist()
            categorical_features = X.select_dtypes(include=['category', 'object']).columns.tolist()
    
            # Define the ColumnTransformer for preprocessing.
            self.preprocessor = ColumnTransformer(
                transformers=[
                    ('num', MinMaxScaler(), numerical_features),
                    ('cat', OneHotEncoder(), categorical_features)
                    ]
                    )
            
            # Apply the preprocessing on the training and test data.
            X_preprocessed = self.preprocessor.fit_transform(X)

            return X_preprocessed, y

        else:
            # Split data into train and test sets.
            X_train, X_test, y_train, y_test = train_test_split(
                X.values, y.values, test_size=test_size, random_state=42, stratify=y, shuffle=True)
            
            # Ensure X_train and X_test are pandas DataFrames.
            X_train = pd.DataFrame(X_train, columns=X.columns)
            X_test = pd.DataFrame(X_test, columns=X.columns)
    
            # Identify numerical and categorical features.
            numerical_features = X.select_dtypes(include=['float64', 'int64']).columns.tolist()
            categorical_features = X.select_dtypes(include=['category', 'object']).columns.tolist()
    
            # Define the ColumnTransformer for preprocessing.
            self.preprocessor = ColumnTransformer(
                transformers=[
                    ('num', MinMaxScaler(), numerical_features),
                    ('cat', OneHotEncoder(), categorical_features)
                    ]
                    )
            
            # Apply the preprocessing on the training and test data.
            X_train_preprocessed = self.preprocessor.fit_transform(X_train)
            X_test_preprocessed = self.preprocessor.transform(X_test)

            return X_train_preprocessed, y_train, X_test_preprocessed, y_test 

    
    def train(self, df: pd.DataFrame, cols_to_drop: List, target_column: str, test_size: int = 0.15):
        """Train the model using the provided DataFrame.

        This method performs the following steps:
        1. Preprocesses the input DataFrame.
        2. Fits the model on the preprocessed training data.
        3. Predicts the labels for both training and testing data.
        4. Calculates and stores evaluation metrics for both training and testing data.

        Args:
            df (pd.DataFrame): The input DataFrame containing the data to be used for training.
            cols_to_drop (List): A list of column names to be dropped from the DataFrame.
            target_column (str): The name of the target column to be predicted.
            test_size (int, optional): The proportion of the dataset to include in the test split. Defaults to 0.15.

        Returns:
            None
        """
        
        # Retrieve the preprocessed data.
        X_train, y_train, X_test, y_test = self.preprocess(df, cols_to_drop, target_column, test_size, cv=False)

        # Fit the model on the training data.
        self.model.fit(X_train, y_train)

        # Predict the labels for the training and testing data.
        train_pred = self.model.predict(X_train)
        test_pred = self.model.predict(X_test)

        # Store training evaluation metrics.
        self.metrics.update({
            "train_accuracy": accuracy_score(y_train, train_pred),
            "train_precision": precision_score(y_train, train_pred),
            "train_recall": recall_score(y_train, train_pred),
            "train_f1_score": f1_score(y_train, train_pred)
        })

        # Store testing evaluation metrics.
        self.metrics.update({
            "test_accuracy": accuracy_score(y_test, test_pred),
            "test_precision": precision_score(y_test, test_pred),
            "test_recall": recall_score(y_test, test_pred),
            "test_f1_score": f1_score(y_test, test_pred)
            })

        # Print the testing accuracy.
        print(f"Model Trained - Accuracy: {self.metrics['test_accuracy']:.4f} ")


    def evaluate(self):
        """
        Print evaluation metrics.
        This method prints the evaluation metrics stored in the `self.metrics` dictionary.
        If no metrics are available, it prompts the user to train or load a model first.

        Returns:
            None
        """
        
        if self.metrics:
            print("Model Performance Metrics!")

            for metric, value in self.metrics.items():
                print(f"{metric.capitalize()}: {value:.4f}")

        else:
            print("No trained model found. Please train or load a model first!")


    def cross_validate(self, df: pd.DataFrame, cols_to_drop: List, target_column: str,  cv: int = 5):
        """
        Perform cross-validation on the model.

        This method performs the following steps:
        1. Preprocesses the input DataFrame.
        2. Performs cross-validation on the preprocessed training data.
        3. Prints the cross-validation scores and their mean.

        Args:
            df (pd.DataFrame): The input DataFrame containing the data to be used for cross-validation.
            cols_to_drop (List): A list of column names to be dropped from the DataFrame.
            target_column (str): The name of the target column to be predicted.
            cv (int, optional): The number of cross-validation folds. Defaults to 5.

        Returns:
            None
        """

        # Retrieve the preprocessed data.
        X, y = self.preprocess(df, cols_to_drop, target_column, test_size=1, cv=True)

        # Perform cross-validation.
        scores = cross_val_score(self.model, X, y, cv=cv)

        # Print cross-validation scores.
        print(f"Cross-validation scores: {scores}")
        print(f"Mean cross-validation score: {np.mean(scores):.4f}")


    def feature_importance(self, ):
        """
        Show feature importance (for tree-based models).

        This method displays a bar chart of feature importances if the model has the attribute `feature_importances_`.
        If the model does not support feature importances, it prints a message indicating that feature importance
        is not available for this model.

        Returns:
            None
        """
        
        if hasattr(self.model, "feature_importances_"):
            importance = self.model.feature_importances_

            # Get feature names from the ColumnTransformer.
            feature_names = []
            for name, transformer, columns in self.preprocessor.transformers_:
                if name == 'num':
                    feature_names.extend(columns)

                elif name == 'cat':
                    # Get the names of the one-hot encoded features.
                    encoder = transformer
                    encoded_feature_names = encoder.get_feature_names_out(columns)
                    feature_names.extend(encoded_feature_names)

            plt.figure(figsize=(10, 5))
            plt.barh(range(len(importance)), importance)
            plt.xlabel("Feature Importance")
            plt.ylabel("Feature Index")
            plt.title("Feature Importance")
            plt.show()

        else:
            print("Feature importance not available for this model!")


    def save_model(self, filename: Union[Path, str]):
        """
        Save the trained model.

        This method saves the trained model to the specified file using joblib.

        Args:
            filename (Union[Path, str]): The file path where the model should be saved.

        Returns:
            None
        """
        
        if self.model and self.preprocessor:

            # Save both the model and the preprocessor as a dictionary.
            joblib.dump({'model': self.model, 'preprocessor': self.preprocessor}, filename)
            print(f"Model and preprocessor saved to {filename}")
    
        else:
            print("Model and/or preprocessor not found. Ensure both are set before saving.")


    def load_model(self, filename: Union[Path, str]):
        """
        Load a saved model.

        This method loads a trained model from the specified file using joblib.

        Args:
            filename (Union[Path, str]): The file path from where the model should be loaded.

        Returns:
            None
        """

        try:

            # Load the dictionary containing the model and preprocessor.
            loaded_data = joblib.load(filename)
            self.model = loaded_data['model']
            self.preprocessor = loaded_data['preprocessor']
            print(f"Model and preprocessor loaded successfully from {filename}")

        except FileNotFoundError:
            print(f"File not found: {filename}")
        
        except KeyError:
            print("The loaded file does not contain both model and preprocessor.")

        except Exception as e:
            print(f"An error occurred while loading the model: {e}")


    def predict_traffic_increase(self, calories: float, carbohydrate: float, sugar: float, 
                                 protein: float, category: str, servings: int) -> Tuple[str, float]:
        """
        Predict the potential increase in website traffic based on recipe features.
        
        This method preprocesses the input data and uses the trained model to predict the traffic category.

        Args:
            calories (float): The number of calories in the recipe.
            carbohydrate (float): The amount of carbohydrates in the recipe.
            sugar (float): The amount of sugar in the recipe.
            protein (float): The amount of protein in the recipe.
            category (str): The category of the recipe.
            servings (int): The number of servings the recipe makes.

        Returns:
            Tuple[str, float]: A tuple containing the predicted traffic category 
                            ('High Traffic' or 'Low Traffic') and the confidence score.
        """

        if self.model is None or self.preprocessor is None:
            raise ValueError("Model must be trained and preprocessor must be set before making predictions.")

        # Create a DataFrame from the input data.
        input_data = pd.DataFrame({
            'calories': [calories],
            'carbohydrate': [carbohydrate],
            'sugar': [sugar],
            'protein': [protein],
            'category': [category],
            'servings': [servings]
        })

        # Apply the preprocessing to the input data.
        input_data_preprocessed = self.preprocessor.transform(input_data)

        # Make predictions.
        prediction = self.model.predict(input_data_preprocessed)[0]
        prediction_probability = self.model.predict_proba(input_data_preprocessed)[0, 1]

        # Categorize the traffic impact.
        traffic_category = "High Traffic" if prediction == 1 else "Low Traffic"

        if traffic_category == "High Traffic":

            return traffic_category, prediction_probability
        
        elif traffic_category == "Low Traffic":
            prediction_probability = 1 - prediction_probability

            return traffic_category, prediction_probability

        
