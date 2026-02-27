import numpy as np
import optuna
from sklearn.ensemble import RandomForestClassifier



def iqr_outlier_handling(df, col):
    """
    Handles outliers in a specified column of a DataFrame using the Interquartile Range (IQR) method.
    
    The function computes the lower and upper bounds using the IQR (Interquartile Range) and replaces 
    values outside these bounds with the respective bound (lower or upper) to cap extreme values.
    
    Parameters:
    ----------
    df : pandas.DataFrame
        The DataFrame containing the data.
    
    col : str
        The name of the column (as a string) in the DataFrame for which outlier handling is to be applied.
    
    Returns:
    -------
    None
        The function modifies the DataFrame in place, capping the outlier values in the specified column.
    
    Notes:
    ------
    The function uses the standard IQR method where outliers are defined as values outside the range:
    [Q1 - 1.5 * IQR, Q3 + 1.5 * IQR], where Q1 is the 25th percentile, Q3 is the 75th percentile, and 
    IQR is the interquartile range (Q3 - Q1).
    """
    Q3 = df[col].quantile(0.75)
    Q1 = df[col].quantile(0.25)
    IQR = Q3 - Q1
    upper = Q3 + (1.5 * IQR)
    lower = Q1 - (1.5 * IQR)
    
    # Replace values below the lower bound with the lower bound
    df[col] = np.where(df[col] < lower, lower, df[col])
    
    # Replace values above the upper bound with the upper bound
    df[col] = np.where(df[col] > upper, upper, df[col])
    


# Define the objective function for Optuna.
def objective(trial):
    
    # Hyperparameters to optimize.
    n_estimators = trial.suggest_int("n_estimators", 100, 200)
    max_depth = trial.suggest_int("max_depth", 4, 9)
    min_samples_split = trial.suggest_int("min_samples_split", 2, 10)
    min_samples_leaf = trial.suggest_int("min_samples_leaf", 1, 10)
    max_features = trial.suggest_float("max_features", 0.5, 0.9)
    
    # Create the Random Forest model with the trial's parameters.
    rf = RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=max_depth,
        min_samples_split=min_samples_split,
        min_samples_leaf=min_samples_leaf,
        max_features=max_features,
        random_state=42
    )

    return rf