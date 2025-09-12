import tensorflow as tf
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

def image_preprocess(image):
    # Convert NumPy array to TensorFlow tensor
    image = tf.convert_to_tensor(image, dtype=tf.float32)
    if len(image.shape) == 2:
        image = tf.expand_dims(image, axis=-1)
    # If the image is grayscale, convert to RGB
    if image.shape[-1] == 1:  # Check if it's grayscale
        image = tf.image.grayscale_to_rgb(image)

    # Resize the image
    image = tf.image.resize(image, size=(128, 128))

    # Rescale the image
    image = tf.keras.layers.Rescaling(1.0 / 255.0)(image)
    return image

def ensemble_output(image_input,densenet,vgg19,xception,effnet):

  class_names = ['Glioma', 'Meningioma', 'No Tumour', 'Pituitary']

  # Add additional dimension in axis=0 to pass to the models as input
  image_input = tf.expand_dims(image_input,axis=0)

  # Extracting the outputs from each model
  densenet_output = densenet(image_input)
  vgg19_output = vgg19(image_input)
  xception_output = xception(image_input)
  effnet_output = effnet(image_input)
  print(f"Densenet output:\n{densenet_output}\nLabel:{tf.argmax(densenet_output,axis=1)}")
  print(f"VGG 19 output:\n{vgg19_output}\nLabel:{tf.argmax(vgg19_output,axis=1)}")
  print(f"Xception output:\n{xception_output}\nLabel:{tf.argmax(xception_output,axis=1)}")
  print(f"Efficient net output:\n{effnet_output}\nLabel:{tf.argmax(effnet_output,axis=1)}")

  # Model weights
  model_weights = np.array([0.2557384390257846,0.25118489053640114, 0.2428057094724688,0.2502709609653457])

  # Label outputs given by the model
  dense_final = np.argmax(densenet_output,axis=1)
  vgg_final = np.argmax(vgg19_output,axis=1)
  xception_final = np.argmax(xception_output,axis=1)
  effnet_final = np.argmax(effnet_output,axis=1)

  model_label_output = np.array([dense_final,vgg_final,xception_final,effnet_final])
  print(model_label_output)
  output_arr = output_label(model_label_output,model_weights=model_weights)
  class_label_idx = np.argmax(output_arr)
  print(class_label_idx)
  print(class_names[class_label_idx])
  return output_arr,class_names[class_label_idx]


def load_models():
    """Load all models from the weights directory"""
    import os
    weights_dir = os.path.join(os.path.dirname(__file__), 'weights')
    
    # Define model paths
    densenet_path = os.path.join(weights_dir, "densenet169_model.keras")
    vgg19_path = os.path.join(weights_dir, "VGG19_model .keras")  # Note the space before .keras
    xception_path = os.path.join(weights_dir, "xception_model.keras")
    effnet_path = os.path.join(weights_dir, "EfficientNetV2B2_model.keras")
    
    # Check if all model files exist
    if not all(os.path.exists(path) for path in [densenet_path, vgg19_path, xception_path, effnet_path]):
        raise FileNotFoundError("One or more model files are missing from the weights directory")
    
    # Load all models
    densenet = tf.keras.models.load_model(densenet_path)
    vgg19 = tf.keras.models.load_model(vgg19_path)
    xception = tf.keras.models.load_model(xception_path)
    effnet = tf.keras.models.load_model(effnet_path)
    
    return densenet, vgg19, xception, effnet

def output_label(arr,model_weights):
  output_arr = np.zeros((arr.shape[0]))
  for i in range(len(arr)):
    output_arr[arr[i]] = output_arr[arr[i]] + model_weights[i]
  return output_arr
