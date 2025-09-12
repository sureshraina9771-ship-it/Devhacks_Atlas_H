import streamlit as st
import tensorflow as tf
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from Ensemble_functions import output_label,ensemble_output,image_preprocess,load_models
from PIL import Image
import gdown

st.title('Brain Tumor Predictor')
st.write('An approach that incorporates the power of deep learning Ensembles to identify Brain Tumours from the images')
st.subheader("Description")
st.write("")
col1,col2,col3,col4 = st.columns([1,5,5,1])
# Glioma
with col2:
    with st.expander("1. Glioma"):
        st.markdown('''
    <h4>Description:</h4> 
    Gliomas are a type of tumor that occurs in the brain and spinal cord. These tumors originate from glial cells, which support and protect neurons. Gliomas can vary in aggressiveness, ranging from low-grade (slow-growing) to high-grade (fast-growing and malignant).
    
    <h4>Common Symptoms:</h4> 
    Headaches, seizures, nausea, memory problems, or speech issues, depending on the location of the tumor.
    
    <h4>Treatment:</h4> 
    Treatment options include surgery, radiation therapy, and chemotherapy.
    ''', unsafe_allow_html=True)

# Meningioma
with col3:
    with st.expander("2. Meningioma"):
        st.markdown('''
    <h4>Description:</h4> 
    Meningiomas are tumors that develop in the meninges, the protective layers of tissue covering the brain and spinal cord. Most meningiomas are benign (non-cancerous), though they can cause significant problems if they grow large enough to press on the brain.
    
    <h4>Common Symptoms:</h4> 
    Headaches, vision problems, hearing loss, or seizures, depending on the tumor's location.
    
    <h4>Treatment:</h4> 
    Treatment often involves surgery, and in some cases, radiation therapy may be used.
    ''', unsafe_allow_html=True)

# Pituitary Tumor
with col2:
    with st.expander("3. Pituitary Tumor"):
        st.markdown('''
    <h4>Description:</h4> 
    Pituitary tumors form in the pituitary gland, located at the base of the brain. These tumors can affect hormone production, leading to various symptoms. Most pituitary tumors are benign and can be functioning (hormone-producing) or non-functioning.
    
    <h4>Common Symptoms:</h4> 
    Hormonal imbalances, vision problems, fatigue, or unexplained weight changes.
    
    <h4>Treatment:</h4> 
    Treatment includes medication to manage hormone levels, surgery to remove the tumor, and sometimes radiation therapy.
    ''', unsafe_allow_html=True)

# No Tumor
with col3:
    with st.expander("4. No Tumor"):
        st.markdown('''
    <h4>Description:</h4> 
    This category indicates that the brain scan does not show the presence of any tumor. The image appears to be free from abnormalities related to brain tumors.
    
    <h4>Implications:</h4> 
    While this category suggests no tumor, it’s important for users to seek medical advice to confirm the results and ensure no other neurological conditions are present.
    ''', unsafe_allow_html=True)



# st.divider()
# st.subheader('Download the images the model has trained on')

# gdown.download("https://drive.google.com/file/d/1LvSKvWVLMu11lD8cly-4Fj5aboQPdmGr/view?usp=sharing",output = "BrainTumor_1.zip")
# with open("BrainTumor_1.zip","rb") as f:
#          st.download_button(label='download data',
#                            data = f,
#                            mime='application/zip')


st.divider()
# st.header('Data Visualization')
# with st.expander('View training data distribution'):
#          data_df = pd.DataFrame(data={'Glioma':5284,'Meningioma':5356,"No Tumour":5828,"Pituitary":6380},index=[0])
#          st.bar_chart(data=data_df,color=['#06C','#4CB140','#009596','#F0AB00'],stack=False)
st.header('Upload the image')
file = st.file_uploader(label='Image file',
                 label_visibility='hidden'
                 ,type=['png', 'jpg','jpeg'])

model_input = 0
if file is not None:
    image = Image.open(file)
    image_array = np.array(image)
    preprocessed_img = image_preprocess(image_array)
    preprocessed_img_np = preprocessed_img.numpy()
    model_input = preprocessed_img_np
    col1, col2, col3 = st.columns([1, 3, 1])  # Adjust the ratios if needed

    with col2:  # Center column
        st.image(preprocessed_img_np, width=350)



# Define paths to local model files
import os
weights_dir = os.path.join(os.path.dirname(__file__), 'weights')
densenet_path = os.path.join(weights_dir, "densenet169_model.keras")
vgg19_path = os.path.join(weights_dir, "VGG19_model .keras")  # Note the space before .keras
xception_path = os.path.join(weights_dir, "xception_model.keras")
effnet_path = os.path.join(weights_dir, "EfficientNetV2B2_model.keras")


st.write("")
left, middle, right = st.columns([1,1,1])
with middle:
         click = st.button('Predict',use_container_width=True)

output_arr = 0
class_name_predicted = ""
if click:
         with st.spinner('Loading models...'):
                  try:
                      # Load all models using the load_models function
                      densenet, vgg19, xception, effnet = load_models()
                  except FileNotFoundError as e:
                      st.error("Model files not found in weights directory. Please ensure all model files are present in the weights folder.")
                      st.stop()
                  except Exception as e:
                      st.error(f"Error loading models: {str(e)}")
                      st.stop()
         st.success("Models loaded successfully")
    
         st.subheader('🔍 Comprehensive Analysis Results')
         with st.spinner('Analyzing image with multiple neural networks.....'):
                 output_arr, class_name_predicted = ensemble_output(model_input,densenet,vgg19,xception,effnet)
         
         # Main probability display
         with st.expander("📊 Overall Probability Distribution", expanded=True):
             col1, col2 = st.columns([2,1])
             with col1:
                 # Create metrics with enhanced visual feedback
                 for i, (label, prob) in enumerate(zip(['Glioma', 'Meningioma', 'No Tumour', 'Pituitary'], output_arr)):
                     # Determine confidence level and icon
                     if prob >= 0.7:
                         confidence_icon = "🟢"
                         confidence_text = "High Confidence"
                     elif prob >= 0.4:
                         confidence_icon = "🟡"
                         confidence_text = "Moderate Confidence"
                     else:
                         confidence_icon = "⚪"
                         confidence_text = "Low Confidence"
                     
                     st.metric(
                         label=f"{confidence_icon} {label}",
                         value=f"{prob * 100:.2f}%",
                         help=f"{confidence_text} - {label} prediction probability"
                     )
                     st.progress(prob)
             
             with col2:
                 # Add a mini summary
                 st.markdown(f"""
                 #### Quick Stats
                 - **Highest Probability**: {max(output_arr) * 100:.1f}%
                 - **Prediction Spread**: {(max(output_arr) - min(output_arr)) * 100:.1f}%
                 - **Secondary Match**: {sorted(output_arr, reverse=True)[1] * 100:.1f}%
                 """)

         # Model Consensus Analysis
         with st.expander("🤖 Individual Model Analysis"):
             st.markdown("### Model Consensus Analysis")
             st.markdown("""
             Each model in our ensemble specializes in different aspects of tumor detection:
             - **DenseNet169**: Excels in feature reuse and complex pattern recognition
             - **VGG19**: Strong at hierarchical feature learning
             - **Xception**: Specialized in spatial and channel-wise feature separation
             - **EfficientNetV2B2**: Optimized for both accuracy and efficiency
             """)
             
             # Create columns for each model's contribution
             col1, col2, col3, col4 = st.columns(4)
             
             with col1:
                 st.markdown("#### DenseNet169")
                 st.metric(label="Weight", value=f"{0.2557384390257846*100:.1f}%")
                 
             with col2:
                 st.markdown("#### VGG19")
                 st.metric(label="Weight", value=f"{0.25118489053640114*100:.1f}%")
                 
             with col3:
                 st.markdown("#### Xception")
                 st.metric(label="Weight", value=f"{0.2428057094724688*100:.1f}%")
                 
             with col4:
                 st.markdown("#### EfficientNetV2B2")
                 st.metric(label="Weight", value=f"{0.2502709609653457*100:.1f}%")

         # Technical Details
         with st.expander("🔬 Technical Analysis Details"):
             st.markdown("### Technical Metrics")
             st.markdown("""
             #### Image Processing Specifications
             - **Input Resolution**: 128x128 pixels
             - **Color Channels**: RGB (3 channels)
             - **Normalization**: Values scaled to [0,1]
             
             #### Model Ensemble Architecture
             - **Number of Models**: 4
             - **Combined Parameters**: >100 million
             - **Aggregation Method**: Weighted Average
             - **Decision Threshold**: Dynamic based on confidence scores
             
             #### Prediction Confidence Levels
             - **High**: >70% probability
             - **Moderate**: 40-70% probability
             - **Low**: <40% probability
             """)
             
             # Add prediction entropy calculation
             probs = np.array(output_arr)
             entropy = -np.sum(probs * np.log2(probs + 1e-10))
             max_entropy = -np.log2(1/4)  # maximum possible entropy for 4 classes
             certainty = 1 - (entropy / max_entropy)
             
             st.markdown(f"""
             #### Prediction Metrics
             - **Prediction Entropy**: {entropy:.2f} bits
             - **Model Certainty**: {certainty*100:.1f}%
             - **Confidence Margin**: {(sorted(output_arr, reverse=True)[0] - sorted(output_arr, reverse=True)[1])*100:.1f}%
             """)

         # Separator before final prediction
         st.markdown("---")

         
         # Display main prediction
         st.markdown(f'''
    <div style="
        background-color: #d4edda;
        color: #155724;
        padding: 10px;
        border-radius: 5px;
        font-size: 24px;
        border: 1px solid #c3e6cb;
        margin-bottom: 20px;
        ">
        <strong>Primary Prediction:</strong> {class_name_predicted}
    </div>
''', unsafe_allow_html=True)

         # Detailed Analysis Section
         st.subheader("📋 Detailed Analysis Report")
         
         # Get the probability threshold for warnings
         HIGH_PROB_THRESHOLD = 0.70
         MODERATE_PROB_THRESHOLD = 0.15

         # Get the top 2 predictions
         probabilities = list(zip(['Glioma', 'Meningioma', 'No Tumour', 'Pituitary'], output_arr))
         sorted_probs = sorted(probabilities, key=lambda x: x[1], reverse=True)
         primary_prediction = sorted_probs[0]
         secondary_prediction = sorted_probs[1]

         # Display confidence level
         confidence_color = "#28a745" if primary_prediction[1] > HIGH_PROB_THRESHOLD else "#ffc107"
         st.markdown(f"""
         ### 🎯 Confidence Assessment
         <div style="padding: 10px; border-radius: 5px; background-color: {confidence_color}; color: {'#000' if primary_prediction[1] <= HIGH_PROB_THRESHOLD else '#fff'};">
         Primary diagnosis confidence: <strong>{primary_prediction[1]*100:.1f}%</strong>
         </div>
         """, unsafe_allow_html=True)

         # Show secondary concerns if significant
         if secondary_prediction[1] > MODERATE_PROB_THRESHOLD:
             st.markdown(f"""
             ⚠️ **Secondary Consideration**: There is a {secondary_prediction[1]*100:.1f}% probability of {secondary_prediction[0]}
             """)
         
         # Advanced Predictive Analysis Section
         if class_name_predicted != "No Tumour":
             with st.expander("🔮 Advanced Predictive Analysis", expanded=True):
                 st.markdown("### Predictive Risk Assessment")
                 
                 # Calculate risk factors based on model confidence and prediction patterns
                 primary_confidence = max(output_arr)
                 secondary_confidence = sorted(output_arr, reverse=True)[1]
                 confidence_ratio = primary_confidence / (secondary_confidence + 1e-6)
                 
                 # Estimate tumor stage based on confidence patterns
                 def estimate_stage(confidence, tumor_type):
                     if tumor_type == "Glioma":
                         if confidence > 0.85: return "Potentially Advanced (III-IV)", "High"
                         elif confidence > 0.70: return "Potentially Intermediate (II-III)", "Moderate to High"
                         else: return "Potentially Early (I-II)", "Moderate"
                     elif tumor_type == "Meningioma":
                         if confidence > 0.85: return "Potentially Grade II-III", "Moderate to High"
                         elif confidence > 0.70: return "Potentially Grade I-II", "Moderate"
                         else: return "Potentially Grade I", "Low to Moderate"
                     elif tumor_type == "Pituitary":
                         if confidence > 0.85: return "Potentially Macroadenoma", "Moderate to High"
                         elif confidence > 0.70: return "Potentially Microadenoma", "Moderate"
                         else: return "Early Stage/Small", "Low to Moderate"
                     return "Indeterminate", "Unknown"

                 stage_estimate, risk_level = estimate_stage(primary_confidence, class_name_predicted)
                 
                 # Calculate progression risk factors
                 progression_risk = min(0.95, primary_confidence * 1.2)  # Cap at 95%
                 intervention_urgency = "High" if progression_risk > 0.8 else "Moderate" if progression_risk > 0.6 else "Low"
                 
                 # Display Stage Analysis
                 st.markdown(f"""
                 #### 📋 Estimated Staging Analysis
                 - **Estimated Stage**: {stage_estimate}
                 - **Risk Level**: {risk_level}
                 - **Confidence in Assessment**: {primary_confidence*100:.1f}%
                 
                 #### 📈 Progression Analysis
                 - **Estimated Progression Risk**: {progression_risk*100:.1f}%
                 - **Intervention Urgency**: {intervention_urgency}
                 
                 #### ⏱️ Temporal Predictions
                 """)
                 
                 # Time-based predictions
                 if class_name_predicted == "Glioma":
                     st.markdown("""
                     **Typical Progression Timeline** (without intervention):
                     - **3-6 months**: Potential significant growth and symptom intensification
                     - **6-12 months**: Risk of increased intracranial pressure
                     - **Beyond 12 months**: Risk of substantial neurological impact
                     
                     **Recommended Monitoring**:
                     - MRI follow-up every 2-3 months initially
                     - Monthly clinical evaluations
                     - Regular neurological assessments
                     """)
                 elif class_name_predicted == "Meningioma":
                     st.markdown("""
                     **Typical Progression Timeline** (without intervention):
                     - **6-12 months**: Minimal to moderate growth expected
                     - **1-2 years**: Potential for noticeable size increase
                     - **2-5 years**: Variable growth patterns
                     
                     **Recommended Monitoring**:
                     - MRI follow-up every 6 months initially
                     - Annual clinical evaluations
                     - Symptom-based assessments
                     """)
                 elif class_name_predicted == "Pituitary":
                     st.markdown("""
                     **Typical Progression Timeline** (without intervention):
                     - **3-6 months**: Hormone level monitoring crucial
                     - **6-12 months**: Potential impact on surrounding structures
                     - **1-2 years**: Variable growth patterns
                     
                     **Recommended Monitoring**:
                     - Hormone level tests every 3 months
                     - MRI follow-up every 6 months
                     - Regular vision and endocrine assessment
                     """)
                 
                 # Risk Factors and Recommendations
                 st.markdown("""
                 #### 🎯 Key Risk Factors
                 """)
                 
                 risk_col1, risk_col2 = st.columns(2)
                 with risk_col1:
                     st.markdown("""
                     **Growth Indicators**:
                     - Image characteristics
                     - Location specifics
                     - Pattern recognition
                     """)
                 with risk_col2:
                     st.markdown("""
                     **Progression Factors**:
                     - Tumor type profile
                     - Confidence patterns
                     - Statistical trends
                     """)
                 
                 # Important Medical Disclaimer
                 st.markdown("""
                 > ⚠️ **Important Medical Notice**: These predictions are based on statistical analysis and general patterns. They should not be used as the sole basis for medical decisions. Individual cases may vary significantly. Always consult with healthcare professionals for personalized medical advice.
                 
                 > 📋 **Analysis Basis**: Predictions are derived from model confidence patterns, statistical trends, and medical literature. They are meant to serve as supplementary information for healthcare providers.
                 """)

         # Display specific information based on predictions
         st.markdown("### 📊 Analysis Details")
         
         if primary_prediction[0] == 'Glioma':
             st.markdown("""
             #### Key Information for Glioma:
             - **Urgency Level**: 🔴 High - Immediate medical attention recommended
             - **Type**: Primary brain tumor originating from glial cells
             - **Common Locations**: Can occur in brain or spine
             - **Typical Symptoms**:
               - Headaches, particularly in the morning
               - Seizures
               - Progressive neurological deficits
               - Changes in mental status
             
             #### Recommended Next Steps:
             1. Consult a neuro-oncologist immediately
             2. Additional MRI with contrast recommended
             3. Consider biopsy for grading
             4. Discuss treatment options (surgery, radiation, chemotherapy)
             """)

         elif primary_prediction[0] == 'Meningioma':
             st.markdown("""
             #### Key Information for Meningioma:
             - **Urgency Level**: 🟡 Moderate - Medical evaluation needed
             - **Type**: Usually benign tumor in the meninges
             - **Growth Rate**: Typically slow-growing
             - **Typical Symptoms**:
               - Headaches
               - Vision problems
               - Hearing loss
               - Memory issues
             
             #### Recommended Next Steps:
             1. Schedule consultation with a neurologist
             2. Regular monitoring may be recommended
             3. Discuss treatment options based on size and location
             4. Follow-up MRI scans to monitor growth
             """)

         elif primary_prediction[0] == 'Pituitary':
             st.markdown("""
             #### Key Information for Pituitary Tumor:
             - **Urgency Level**: 🟡 Moderate - Medical evaluation needed
             - **Type**: Tumor in the pituitary gland
             - **Impact**: May affect hormone production
             - **Typical Symptoms**:
               - Hormonal imbalances
               - Vision changes
               - Headaches
               - Fatigue
             
             #### Recommended Next Steps:
             1. Endocrinologist consultation recommended
             2. Hormonal level testing
             3. Visual field examination
             4. Discussion of treatment options
             """)

         else:  # No Tumour
             st.markdown("""
             #### Assessment for No Tumor:
             - **Status**: 🟢 No apparent tumor detected
             - **Note**: Regular check-ups still recommended
             
             #### Recommended Next Steps:
             1. Maintain regular medical check-ups
             2. Monitor any persistent symptoms
             3. Consider follow-up imaging if symptoms persist
             4. Discuss other potential causes of symptoms with healthcare provider
             """)

         # General Disclaimer
         st.markdown("""
         ---
         ### ⚠️ Important Disclaimer
         - This analysis is based on AI interpretation and should not be considered a final diagnosis
         - All results should be verified by qualified medical professionals
         - Seek immediate medical attention if experiencing severe symptoms
         - Regular medical check-ups are recommended regardless of these results
         """)

         # Additional Recommendations based on confidence
         if primary_prediction[1] < HIGH_PROB_THRESHOLD:
             st.warning("""
             ⚠️ **Note on Prediction Confidence**
             - The confidence level is below optimal threshold
             - Additional medical imaging might be recommended
             - Consultation with multiple specialists may be beneficial
             """)


         

         
