import os
import gdown

# Create weights directory if it doesn't exist
weights_dir = os.path.join(os.path.dirname(__file__), 'weights')
os.makedirs(weights_dir, exist_ok=True)

# Model URLs and filenames
models = {
    "densenet169_model.keras": "1alRU89gEjm1hc1TJZ965Sg40gJrXap5g",
    "VGG19_model.keras": "1E_qVWwNkDj-vbYO0Rlx4JoexCxGtIw9_",
    "xception_model.keras": "1YMo2BkbuqCwoRi6-XfT0P5SIWyf82VEE",
    "EfficientNetV2B2_model.keras": "1xsk9pUCAQuztZyaa5UJwAq4cwxChUIfl"
}

print("Downloading model files...")
for filename, file_id in models.items():
    output_path = os.path.join(weights_dir, filename)
    if not os.path.exists(output_path):
        print(f"Downloading {filename}...")
        url = f"https://drive.google.com/uc?id={file_id}"
        gdown.download(url, output_path, quiet=False)
        print(f"Downloaded {filename}")
    else:
        print(f"{filename} already exists, skipping download")

print("\nAll models have been downloaded to the weights directory.")
