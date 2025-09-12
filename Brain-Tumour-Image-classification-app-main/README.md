# 🧠 Brain Tumor Image Classification App

A Streamlit-based web application for classifying brain tumors using MRI scans. It integrates four fine-tuned deep learning models and a **weight-aware decision module** to improve diagnostic accuracy. Each model is trained and evaluated independently, with contributions weighted by scaled validation accuracy during inference.

👉 **[Launch App 🚀](https://brain-tumour-image-classification-application-210924.streamlit.app/)**

---

## 📁 Dataset Sources

- **Original Dataset**: [Kaggle - Brain Tumor MRI Dataset](https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset)  
- **Modified & Augmented Dataset**: [Kaggle - Brain Tumor Classification by Rishi](https://www.kaggle.com/datasets/rishiksaisanthosh/brain-tumour-classification/data)  
  > Includes data augmentation techniques: `horizontal flip`, `vertical flip`, and `rotation`.

---

## 🧠 Pretrained Models Used

Each model was fine-tuned independently and contributes to the ensemble based on its scaled validation performance:

- ### 🔗 **DenseNet-169**
  Densely connected CNN that mitigates vanishing gradients and encourages feature reuse; known for efficiency in deep networks.

- ### 🔗 **VGG-19**
  Deep CNN with 19 layers, developed by Oxford's VGG group; known for simplicity and consistent architecture.

- ### 🔗 **Xception**
  Depthwise separable convolutions based on Inception architecture; excels in capturing spatial hierarchies efficiently.

- ### 🔗 **EfficientNetV2-B2**
  Optimized for speed and parameter efficiency; balances depth, width, and resolution.

* **NOTE:** Each of the model training notebook has also been uploaded
---

## ⚙️ Core Contributions

- **Multi-model ensemble with fixed weight voting**, where weights are proportional to validation accuracy.
- **Robust handling of multi-class classification tie cases**.
- Achieved **98.7% classification accuracy** across three tumor types (glioma, meningioma, pituitary).
- Streamlit deployment for real-time image upload and prediction.

---

## 📊 Workflow Overview

![Workflow Diagram](https://github.com/user-attachments/assets/d1a1d609-046f-492a-ba60-56686cbf11c4)

---

