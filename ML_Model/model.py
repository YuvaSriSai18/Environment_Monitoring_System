from flask import Flask, request, jsonify
from flask_cors import CORS 
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load and preprocess the dataset
file_path = "ML_Model/city_day.csv"  # Use forward slashes for better compatibility

if not os.path.exists(file_path):
    raise FileNotFoundError(f"Dataset file not found at {file_path}")

df = pd.read_csv(file_path)

# Drop columns with excessive missing values and non-numeric data
threshold = 10000
columns_to_keep = [col for col in df.columns if df[col].isnull().sum() < threshold]
df = df[columns_to_keep].dropna().reset_index(drop=True)
df = df.drop(columns=['City', 'Date'], errors='ignore')  # Drop unnecessary columns if they exist

# Check if the dataset contains the target column 'AQI_Bucket'
if 'AQI_Bucket' not in df.columns:
    raise ValueError("Dataset does not contain the required 'AQI_Bucket' column.")

# Separate features and target
X = df.drop(columns=['AQI_Bucket'], errors='ignore')  # Ensure AQI_Bucket is dropped only if it exists
y = df['AQI_Bucket']

# Encode target labels
encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Train a Random Forest Classifier
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Accuracy score
accuracy = rf_model.score(X_test, y_test)
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# Prediction function
def predict_aqi_bucket(input_data):
    """
    Predict the AQI Bucket based on input air quality parameters.
    :param input_data: A dictionary containing values for all required features.
    :return: Predicted AQI Bucket.
    """
    # Check that input_data contains all necessary columns
    missing_features = [col for col in X.columns if col not in input_data]
    if missing_features:
        raise ValueError(f"Missing features in input data: {missing_features}")

    # Create DataFrame from input dictionary and ensure correct column order
    input_df = pd.DataFrame([input_data])[X.columns]

    # Predict AQI Bucket
    prediction_encoded = rf_model.predict(input_df)[0]
    prediction_label = encoder.inverse_transform([prediction_encoded])[0]
    return prediction_label

@app.route('/', methods=['GET'])
def home():
    """
    Home route to indicate server is running.
    """
    return jsonify({"message": "Server is running"}), 200

# Define API endpoint
@app.route('/predict', methods=['POST'])
def predict():
    """
    Handle POST request for AQI Bucket prediction.
    Expects JSON input with air quality parameters.
    """
    try:
        # Get input data from the request
        input_data = request.get_json()

        # Validate input data and predict AQI Bucket
        predicted_bucket = predict_aqi_bucket(input_data)

        # Return the predicted AQI bucket as JSON
        return jsonify({"Predicted AQI Bucket": predicted_bucket})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred.", "details": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)  # Prevent Flask from using auto-reloader
