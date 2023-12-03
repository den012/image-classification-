from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import base64
import os
import uuid

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

class COLORS:
    OK = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'

model = load_model('model.h5')

classes = ['airplane', 
           'automobile', 
           'bird', 
           'cat', 
           'deer', 
           'dog', 
           'frog', 
           'horse', 
           'ship', 
           'vehicle']

def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(32, 32))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.
    return img_array

def predict_class(img_path, confidence_threshold=0.3):
    img_array = preprocess_image(img_path)
    predictions = model.predict(img_array)
    prediction_class_index = np.argmax(predictions)
    confidence = predictions[0, prediction_class_index]

    if confidence < confidence_threshold:
        return "I can't recognize this yet."

    prediction_class = classes[prediction_class_index]
    return prediction_class

@app.route('/detect-image', methods=['POST'])
def detect_image():
    try:
        print("Request received")

        if 'file' not in request.files:
            return jsonify({'message': 'No file found'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'message': 'No file selected'}), 400

        # Save the file temporarily with a unique name
        temp_filename = f"{str(uuid.uuid4())}.png"
        temp_filepath = os.path.join("temp_images", temp_filename)

        file.save(temp_filepath)

        prediction_class = predict_class(temp_filepath)

        # Remove the temporary file
        os.remove(temp_filepath)

        return jsonify({'result': prediction_class})
    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    print("Starting Flask app...")
    app.run(host='0.0.0.0', port=5500, debug=True)
