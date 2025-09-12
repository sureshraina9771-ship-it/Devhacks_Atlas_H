import google.generativeai as genai

genai.configure(api_key="AIzaSyBDoJryxLzc8MBr7MRceEd31aIhA_E1uNI")  # Replace with your actual Gemini API key

models = genai.list_models()
for m in models:
    print(m.name)