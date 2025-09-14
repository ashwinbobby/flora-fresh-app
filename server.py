from flask import Flask, request, jsonify
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io

app = Flask(__name__)

# ================================
# CONFIG
# ================================
NUM_CLASSES = 38
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ================================
# LOAD STUDENT MODEL
# ================================
student = models.resnet18(weights=None)  # same architecture used for training
student.fc = nn.Linear(student.fc.in_features, NUM_CLASSES)
student.load_state_dict(torch.load("student_best.pth", map_location=DEVICE))
student = student.to(DEVICE)
student.eval()

# ================================
# TRANSFORM
# ================================
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225]),
])

# ================================
# ROUTE
# ================================
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    img = Image.open(io.BytesIO(file.read())).convert("RGB")
    img = transform(img).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        outputs = student(img)
        _, predicted = torch.max(outputs, 1)
        class_id = predicted.item()

    return jsonify({"prediction": int(class_id)})

# ================================
# RUN
# ================================
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
