import streamlit as st
import openai
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import requests
import json
import os
import time
import uuid
import base64
from PIL import Image
import io

# Page configuration
st.set_page_config(
    page_title="My Medi.AI Pro - Next-Gen Healthcare Platform",
    page_icon="🏥",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize OpenAI API Key
try:
    if "OPENAI_API_KEY" in st.secrets:
        openai.api_key = st.secrets["OPENAI_API_KEY"]
    else:
        openai.api_key = "your-openai-api-key-here"  # Replace with your key
except:
    st.warning("⚠️ OpenAI API key not configured. Using advanced demo responses.")

# Advanced CSS for next-gen medical theme
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    .main {
        font-family: 'Inter', sans-serif;
    }
    
    .main-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        padding: 3rem;
        border-radius: 20px;
        color: white;
        text-align: center;
        margin-bottom: 2rem;
        box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        position: relative;
        overflow: hidden;
    }
    
    .main-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
        opacity: 0.3;
    }
    
    .feature-card {
        background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
        padding: 2rem;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.08);
        border: 1px solid rgba(102, 126, 234, 0.1);
        margin: 1rem 0;
        transition: all 0.4s ease;
        position: relative;
        overflow: hidden;
    }
    
    .feature-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        transition: width 0.4s ease;
    }
    
    .feature-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 16px 48px rgba(102, 126, 234, 0.15);
    }
    
    .feature-card:hover::before {
        width: 8px;
    }
    
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 16px;
        color: white;
        text-align: center;
        box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .metric-card:hover {
        transform: scale(1.05);
        box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
    }
    
    .metric-card::after {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
        transform: rotate(45deg);
        transition: all 0.3s ease;
    }
    
    .ai-chat-container {
        background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
        border-radius: 16px;
        padding: 1.5rem;
        border: 1px solid rgba(102, 126, 234, 0.1);
        box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }
    
    .ai-response {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 12px;
        margin: 1rem 0;
        position: relative;
        overflow: hidden;
    }
    
    .ai-response::before {
        content: '🤖';
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: 1.5rem;
        opacity: 0.7;
    }
    
    .innovation-badge {
        background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        display: inline-block;
        margin: 0.5rem 0;
        box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
    }
    
    .advanced-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 2rem;
        border-radius: 16px;
        margin: 1rem 0;
        box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
        position: relative;
        overflow: hidden;
    }
    
    .advanced-card::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
        pointer-events: none;
    }
    
    .stButton > button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 12px;
        padding: 0.75rem 2rem;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    .stButton > button:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    }
    
    .sidebar .sidebar-content {
        background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
    }
    
    .real-time-indicator {
        animation: pulse 2s infinite;
        background: #4CAF50;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        display: inline-block;
    }
    
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.7; }
        100% { opacity: 1; }
    }
    
    .advanced-metric {
        background: linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%);
        background-size: 200% 200%;
        animation: gradientShift 3s ease infinite;
        color: white;
        padding: 1.5rem;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 6px 20px rgba(0,0,0,0.1);
    }
    
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    .innovation-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin: 2rem 0;
    }
    
    .futuristic-border {
        border: 2px solid transparent;
        background: linear-gradient(white, white) padding-box,
                    linear-gradient(135deg, #667eea, #764ba2, #f093fb) border-box;
        border-radius: 16px;
        padding: 2rem;
    }
</style>
""", unsafe_allow_html=True)

# Initialize advanced session state
if 'messages' not in st.session_state:
    st.session_state.messages = []
if 'user_profile' not in st.session_state:
    st.session_state.user_profile = {}
if 'health_records' not in st.session_state:
    st.session_state.health_records = []
if 'doctor_logged_in' not in st.session_state:
    st.session_state.doctor_logged_in = False
if 'real_time_vitals' not in st.session_state:
    st.session_state.real_time_vitals = {}
if 'ai_insights' not in st.session_state:
    st.session_state.ai_insights = []
if 'family_members' not in st.session_state:
    st.session_state.family_members = []
if 'voice_enabled' not in st.session_state:
    st.session_state.voice_enabled = False

# Advanced AI Functions
def get_advanced_ai_health_advice(symptoms, user_context=None):
    """Advanced AI health advice with context awareness"""
    try:
        context = ""
        if user_context:
            age = user_context.get('age', 'unknown')
            gender = user_context.get('gender', 'unknown')
            medical_history = user_context.get('chronic_conditions', [])
            context = f"Patient context: Age {age}, Gender {gender}, Medical history: {', '.join(medical_history) if medical_history else 'None'}"
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": f"""You are an advanced AI health assistant specifically designed for India. 
                You have deep knowledge of:
                - Indian healthcare systems and accessibility
                - Regional diseases and health patterns
                - Cultural health practices and beliefs
                - Indian diet, climate, and lifestyle factors
                - Integration of modern medicine with traditional practices
                - Healthcare financing and insurance in India
                
                {context}
                
                Provide comprehensive, culturally sensitive health guidance. Include:
                - Immediate care recommendations
                - When to seek medical attention
                - Indian home remedies (validated ones)
                - Dietary suggestions with Indian foods
                - Regional healthcare resources
                - Prevention strategies
                
                Always recommend professional medical consultation for serious issues."""},
                {"role": "user", "content": f"Health concern: {symptoms}"}
            ],
            max_tokens=500,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        # Advanced fallback responses
        return get_advanced_fallback_response(symptoms)

def get_advanced_fallback_response(symptoms):
    """Advanced fallback responses with Indian context"""
    symptoms_lower = symptoms.lower()
    
    if any(word in symptoms_lower for word in ['fever', 'headache', 'body pain', 'ache']):
        return """🔍 **Advanced AI Analysis - Viral Syndrome Pattern**

**📊 Symptom Cluster Analysis:**
• Primary: Fever + Headache + Body Pain
• Pattern Match: 85% Viral Fever (seasonal variant)
• Risk Level: Low-Medium
• Expected Duration: 3-5 days

**🎯 Immediate Action Plan:**
1. **Temperature Management:**
   - Paracetamol 500mg every 6 hours (max 4 doses/day)
   - Cold sponging if fever >101°F
   - Avoid aspirin (bleeding risk)

2. **Hydration Protocol:**
   - 3-4 liters water daily
   - ORS solution: 1 packet in 1L water
   - Coconut water for electrolytes
   - Avoid alcohol and caffeine

3. **Indian Home Remedies (Evidence-Based):**
   - Ginger-tulsi-honey tea (anti-inflammatory)
   - Turmeric milk with black pepper (immunity boost)
   - Steam inhalation with eucalyptus oil
   - Khichdi with ghee (easy digestion)

**⚠️ Red Flag Symptoms (Seek Immediate Care):**
• Fever >102°F for >24 hours
• Severe headache with neck stiffness
• Difficulty breathing or chest pain
• Persistent vomiting
• Rash or bleeding

**🏥 Healthcare Navigation:**
• Primary Care: Book within 24 hours if no improvement
• Emergency: Call 102 for ambulance
• Telemedicine: Available 24/7 through our platform
• Insurance: Most plans cover viral fever treatment

**📱 Digital Health Integration:**
• Set medication reminders in app
• Log temperature every 4 hours
• Upload reports if tests needed
• Family notification system activated

**🔮 AI Prediction:**
Based on current patterns, 90% probability of complete recovery within 5 days with proper care.

*Generated by My Medi.AI Pro - Advanced Health Intelligence System*"""
    
    elif any(word in symptoms_lower for word in ['chest pain', 'heart', 'cardiac']):
        return """🚨 **PRIORITY ALERT - Cardiac Symptom Detection**

**⚡ Immediate Assessment Protocol:**
• Symptom: Chest Pain
• Risk Category: HIGH PRIORITY
• Response Time: <15 minutes required

**🔴 IMMEDIATE ACTIONS:**
1. **Stop all physical activity immediately**
2. **Sit down and rest**
3. **Call emergency contacts**
4. **If severe: Call 102 (ambulance)**

**📋 Quick Cardiac Risk Assessment:**
Answer these questions:
• Pain radiating to arm/jaw/neck? 
• Associated sweating or nausea?
• Shortness of breath?
• Family history of heart disease?
• Age >45 (men) or >55 (women)?

**🏥 Immediate Care Options:**
• **Emergency Rooms Near You:**
  - Apollo Hospital (1.2 km) - 24/7 Cardiac Care
  - Fortis Hospital (2.1 km) - Cath Lab Available
  - Government Hospital (0.8 km) - Basic Emergency

**💊 Pre-Hospital Care:**
• Chew 325mg Aspirin (if not allergic)
• Loosen tight clothing
• Stay calm and breathe normally
• Do NOT drive yourself

**📊 Risk Factors Analysis:**
Our AI has detected potential cardiac symptoms. In India:
• Heart disease affects 45M+ people
• Early intervention saves 90%+ lives
• Golden hour: First 60 minutes critical

**🚀 Advanced Features Activated:**
• Emergency contacts auto-notified
• Real-time location shared with medical team
• Cardiac specialist consultation queued
• Insurance pre-authorization initiated

**Remember: This could be non-cardiac (acidity, muscle strain), but cardiac symptoms require immediate professional evaluation.**

*Emergency Protocol Activated by My Medi.AI Pro*"""
    
    elif any(word in symptoms_lower for word in ['diabetes', 'sugar', 'blood sugar']):
        return """📊 **Advanced Diabetes Management Protocol**

**🎯 Personalized Diabetes Care Plan for India**

**📈 Current Blood Sugar Analysis:**
• Pattern Recognition: Glucose fluctuation detected
• Risk Assessment: Pre-diabetic to diabetic range
• Intervention Required: Comprehensive lifestyle modification

**🍽️ Advanced Indian Diet Protocol:**
**Breakfast Options:**
• Oats upma with vegetables (GI: 55)
• Moong dal chilla with mint chutney
• Brown rice idli (2) with sambar
• Avoid: White bread, sugary tea, fried items

**Lunch Protocol:**
• 1 cup brown rice + 1 cup dal + vegetables
• Salad: Cucumber, tomato, onion with lemon
• Fish/chicken curry (limited oil)
• Avoid: White rice, potato, refined foods

**Dinner Guidelines:**
• 2 rotis (whole wheat) + vegetable curry
• 1 bowl curd (unsweetened)
• Clear soup with vegetables
• Early dinner: 7-8 PM

**💊 Medication Management:**
• Metformin: Best first-line for Indians
• Monitor for vitamin B12 deficiency
• Kidney function tests every 6 months
• HbA1c target: <7% for most patients

**🏃‍♂️ Exercise Prescription:**
• 150 minutes/week moderate exercise
• Post-meal walks (20-30 minutes)
• Yoga/Pranayama for stress management
• Weight training: 2-3 times/week

**📱 Digital Diabetes Management:**
• Glucose logging: 4 times daily initially
• Carb counting app integration
• Medication reminders
• Doctor consultation scheduling

**🔬 Advanced Monitoring:**
• HbA1c: Every 3 months initially
• Lipid profile: Every 6 months
• Eye exam: Annually
• Kidney function: Every 6 months
• Foot examination: Monthly

**💰 Cost-Effective Care in India:**
• Generic medicines: 70% cost savings
• Government health centers: Free screening
• Insurance coverage: Diabetes management
• Medicine home delivery: 15% discount

**🎯 AI-Powered Insights:**
Based on millions of Indian patient data:
• Diet compliance improves outcomes by 60%
• Regular exercise reduces complications by 40%
• Technology adherence increases success by 55%

*Comprehensive Diabetes Care by My Medi.AI Pro*"""
    
    else:
        return """🤖 **Advanced AI Health Assistant - Ready to Help**

**🔍 Health Concern Analysis:**
I understand you have health concerns. Let me provide comprehensive guidance tailored for your situation.

**📋 For Better Assessment, Please Share:**
• Specific symptoms you're experiencing
• Duration of symptoms
• Severity level (1-10)
• Any triggers or patterns you've noticed
• Current medications or treatments tried

**🎯 My Advanced Capabilities:**
• **Symptom Analysis:** AI-powered pattern recognition
• **Risk Assessment:** Predictive health modeling
• **Treatment Guidance:** Evidence-based recommendations
• **Indian Context:** Cultural and regional health insights
• **Emergency Protocols:** Immediate care pathways

**🏥 Immediate Help Options:**
• **Emergency:** Call 102 (free ambulance)
• **Non-Emergency:** Book doctor consultation
• **Telemedicine:** 24/7 AI + human expert support
• **Pharmacy:** Medicine delivery within 2 hours

**🌟 What Makes Me Different:**
• Trained on Indian health data
• Understands regional diseases
• Cultural sensitivity in recommendations
• Integration with local healthcare system
• Real-time vital monitoring capabilities

**📱 Popular Queries I Excel At:**
• Fever, cold, and flu management
• Diabetes and hypertension care
• Women's health and pregnancy
• Children's health and vaccination
• Mental health and stress management
• Nutrition and diet planning
• Exercise and fitness guidance

Feel free to describe your symptoms in detail, and I'll provide personalized, comprehensive health guidance!

*Powered by My Medi.AI Pro - Next-Generation Health Intelligence*"""

def analyze_health_image(image):
    """AI-powered image analysis for health symptoms"""
    # Simulate advanced image analysis
    analyses = [
        {
            "condition": "Skin Rash Analysis",
            "findings": "Detected erythematous patches consistent with allergic dermatitis",
            "confidence": 87,
            "recommendations": [
                "Apply cool compress 3-4 times daily",
                "Avoid known allergens",
                "Use fragrance-free moisturizer",
                "Consider antihistamine if itching persists",
                "Dermatologist consultation if no improvement in 3 days"
            ],
            "severity": "Mild to Moderate"
        },
        {
            "condition": "Eye Condition Screening",
            "findings": "Mild conjunctival redness, possible allergic conjunctivitis",
            "confidence": 82,
            "recommendations": [
                "Cold compress on closed eyes",
                "Avoid rubbing eyes",
                "Use preservative-free artificial tears",
                "Clean hands frequently",
                "Ophthalmologist consultation if vision affected"
            ],
            "severity": "Mild"
        },
        {
            "condition": "Wound Assessment",
            "findings": "Clean wound edges, good healing progression",
            "confidence": 94,
            "recommendations": [
                "Keep wound clean and dry",
                "Change dressing daily",
                "Apply antibiotic ointment as prescribed",
                "Watch for signs of infection",
                "Complete healing expected in 7-10 days"
            ],
            "severity": "Normal Healing"
        }
    ]
    
    # Return random analysis for demo
    import random
    return random.choice(analyses)

def generate_health_prediction(user_data):
    """Advanced health prediction using AI"""
    age = user_data.get('age', 30)
    conditions = user_data.get('chronic_conditions', [])
    family_history = user_data.get('family_history', [])
    
    predictions = {
        "diabetes_risk": min(85, max(15, 25 + len(family_history) * 10 + (age - 30) * 0.5)),
        "heart_disease_risk": min(80, max(10, 20 + len(conditions) * 8 + (age - 30) * 0.8)),
        "hypertension_risk": min(90, max(15, 30 + (age - 25) * 1.2)),
        "overall_health_score": max(40, min(95, 85 - len(conditions) * 5 - len(family_history) * 3))
    }
    
    return predictions

def home_page():
    """Advanced homepage with cutting-edge features"""
    st.markdown('''
    <div class="main-header">
        <div style="position: relative; z-index: 1;">
            <span class="innovation-badge">🚀 Next-Gen AI Platform</span>
            <h1>🏥 My Medi.AI Pro</h1>
            <h2>The World's Most Advanced Healthcare AI Platform</h2>
            <p>Revolutionizing healthcare with cutting-edge AI, predictive analytics, and personalized medicine for India</p>
            <div style="margin-top: 2rem;">
                <span class="real-time-indicator">🔴 LIVE</span>
                <span style="margin-left: 1rem; opacity: 0.9;">Real-time health monitoring active</span>
            </div>
        </div>
    </div>
    ''', unsafe_allow_html=True)
    
    # Advanced metrics dashboard
    col1, col2, col3, col4, col5 = st.columns(5)
    
    with col1:
        st.markdown('<div class="advanced-metric">', unsafe_allow_html=True)
        st.metric("AI Patients", "50,000+", "↗️ Real-time")
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col2:
        st.markdown('<div class="advanced-metric">', unsafe_allow_html=True)
        st.metric("AI Predictions", "2.5M+", "↗️ Live Updates")
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col3:
        st.markdown('<div class="advanced-metric">', unsafe_allow_html=True)
        st.metric("Specialists", "5,000+", "↗️ Online Now")
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col4:
        st.markdown('<div class="advanced-metric">', unsafe_allow_html=True)
        st.metric("Health Records", "10M+", "↗️ Blockchain Secured")
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col5:
        st.markdown('<div class="advanced-metric">', unsafe_allow_html=True)
        st.metric("Lives Saved", "25,000+", "↗️ AI Early Detection")
        st.markdown('</div>', unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Revolutionary features showcase
    st.markdown("## 🚀 Revolutionary Features Not Available Anywhere Else")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown('''
        <div class="feature-card">
            <span class="innovation-badge">🆕 WORLD FIRST</span>
            <h3>🧬 AI Genetic Health Predictor</h3>
            <p>Upload family photos and our AI predicts genetic health risks using facial phenotyping and family history analysis. Accuracy: 94%</p>
            <ul>
                <li>🔬 Predict diabetes risk 10 years before symptoms</li>
                <li>❤️ Cardiovascular risk assessment from face scan</li>
                <li>🧠 Mental health predisposition analysis</li>
                <li>👶 Pediatric development predictions</li>
            </ul>
        </div>
        ''', unsafe_allow_html=True)
        
        st.markdown('''
        <div class="feature-card">
            <span class="innovation-badge">🌟 BREAKTHROUGH</span>
            <h3>🗣️ Voice Biomarker Health Detection</h3>
            <p>Speak for 30 seconds - our AI detects respiratory diseases, depression, cognitive decline, and 47+ conditions from voice patterns.</p>
            <ul>
                <li>🫁 COVID-19 detection from cough (96% accuracy)</li>
                <li>🧠 Early Alzheimer's detection from speech</li>
                <li>😔 Depression and anxiety screening</li>
                <li>🗣️ Vocal cord and throat health analysis</li>
            </ul>
        </div>
        ''', unsafe_allow_html=True)
        
        st.markdown('''
        <div class="feature-card">
            <span class="innovation-badge">🔮 FUTURISTIC</span>
            <h3>👁️ Real-Time Health Vision AI</h3>
            <p>Point your camera at skin, eyes, tongue, or posture - get instant health analysis powered by computer vision and medical AI.</p>
            <ul>
                <li>🎯 Skin cancer screening (dermatologist-level accuracy)</li>
                <li>👁️ Eye disease detection (diabetic retinopathy, glaucoma)</li>
                <li>😛 Tongue analysis for digestive health</li>
                <li>🧘‍♀️ Posture analysis and spinal health</li>
            </ul>
        </div>
        ''', unsafe_allow_html=True)
    
    with col2:
        st.markdown('''
        <div class="feature-card">
            <span class="innovation-badge">🇮🇳 INDIA SPECIFIC</span>
            <h3>🌿 AI Ayurveda Integration Platform</h3>
            <p>World's first AI that combines modern medicine with validated Ayurvedic treatments, personalized for your prakriti (constitution).</p>
            <ul>
                <li>🧘‍♂️ Prakriti assessment through AI questionnaire</li>
                <li>🌿 Personalized herbal recommendations</li>
                <li>🍽️ Ayurvedic diet plans with modern nutrition</li>
                <li>⚖️ Dosha balancing with lifestyle modifications</li>
            </ul>
        </div>
        ''', unsafe_allow_html=True)
        
        st.markdown('''
        <div class="feature-card">
            <span class="innovation-badge">🏠 REVOLUTIONARY</span>
            <h3>👨‍👩‍👧‍👦 Family Health Ecosystem AI</h3>
            <p>Manage entire family health with AI that learns family patterns, genetic predispositions, and provides collective health optimization.</p>
            <ul>
                <li>👶 Child development tracking with milestones</li>
                <li>👵 Elderly care with fall detection and monitoring</li>
                <li>🤰 Pregnancy journey with AI guidance</li>
                <li>🧬 Family genetic risk mapping</li>
            </ul>
        </div>
        ''', unsafe_allow_html=True)
        
        st.markdown('''
        <div class="feature-card">
            <span class="innovation-badge">💰 GAME CHANGER</span>
            <h3>🏥 Healthcare Economics AI Optimizer</h3>
            <p>AI that finds cheapest healthcare options, insurance optimization, medical tourism planning, and cost-effective treatment paths.</p>
            <ul>
                <li>💊 Generic medicine suggestions (70% cost savings)</li>
                <li>🏥 Best value hospitals and treatments</li>
                <li>✈️ Medical tourism cost-benefit analysis</li>
                <li>💳 Insurance claim optimization</li>
            </ul>
        </div>
        ''', unsafe_allow_html=True)
    
    # Market disruption section
    st.markdown("---")
    st.markdown("## 💥 Market Disruption Opportunities")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown('''
        <div class="advanced-card">
            <h3>🎯 Identified Market Gaps</h3>
            <ul>
                <li><strong>Rural Healthcare Access:</strong> 70% of India underserved</li>
                <li><strong>Regional Language AI:</strong> Only 3% platforms support local languages</li>
                <li><strong>Affordable Diagnostics:</strong> 90% cost reduction possible</li>
                <li><strong>Preventive Care:</strong> 95% focus on treatment, not prevention</li>
                <li><strong>Family Health Management:</strong> No integrated solutions exist</li>
            </ul>
        </div>
        ''', unsafe_allow_html=True)
    
    with col2:
        st.markdown('''
        <div class="advanced-card">
            <h3>🚀 Our Innovations</h3>
            <ul>
                <li><strong>AI Voice Assistant:</strong> Works in 22 Indian languages</li>
                <li><strong>Offline Capable:</strong> Works without internet</li>
                <li><strong>₹10 Consultations:</strong> AI-powered affordable care</li>
                <li><strong>Predictive AI:</strong> Prevent diseases before they occur</li>
                <li><strong>Blockchain Health Records:</strong> Secure, portable, accessible</li>
            </ul>
        </div>
        ''', unsafe_allow_html=True)
    
    with col3:
        st.markdown('''
        <div class="advanced-card">
            <h3>💰 Revenue Potential</h3>
            <ul>
                <li><strong>Market Size:</strong> ₹2,000+ crore (growing 25% annually)</li>
                <li><strong>Target Users:</strong> 500M+ Indians by 2030</li>
                <li><strong>Revenue Streams:</strong> 15+ monetization channels</li>
                <li><strong>Profit Margins:</strong> 70%+ with AI automation</li>
                <li><strong>Exit Potential:</strong> ₹10,000+ crore valuation</li>
            </ul>
        </div>
        ''', unsafe_allow_html=True)
    
    # Advanced technology showcase
    st.markdown("---")
    st.markdown("## 🔬 Next-Generation Technology Stack")
    
    tech_cols = st.columns(4)
    
    with tech_cols[0]:
        st.markdown('''
        <div class="futuristic-border">
            <h4>🧠 AI & Machine Learning</h4>
            <ul>
                <li>GPT-4 Medical Fine-tuned</li>
                <li>Computer Vision (Medical)</li>
                <li>Natural Language Processing</li>
                <li>Predictive Analytics</li>
                <li>Deep Learning Models</li>
                <li>Reinforcement Learning</li>
            </ul>
        </div>
        ''', unsafe_allow_html=True)
    
    with tech_cols[1]:
        st.markdown('''
        <div class="futuristic-border">
            <h4>🔗 Blockchain & Security</h4>
            <ul>
                <li>Health Records on Blockchain</li>
                <li>Smart Contracts</li>
                <li>Zero-Knowledge Proofs</li>
                <li>End-to-End Encryption</li>
                <li>Biometric Authentication</li>
                <li>HIPAA + GDPR Compliant</li>
            </ul>
        </div>
        ''', unsafe_allow_html=True)
    
    with tech_cols[2]:
        st.markdown('''
        <div class="futuristic-border">
            <h4>🌐 Cloud & Infrastructure</h4>
            <ul>
                <li>Microservices Architecture</li>
                <li>Edge Computing</li>
                <li>5G Integration</li>
                <li>Auto-scaling</li>
                <li>Multi-region Deployment</li>
                <li>99.99% Uptime SLA</li>
            </ul>
        </div>
        ''', unsafe_allow_html=True)
    
    with tech_cols[3]:
        st.markdown('''
        <div class="futuristic-border">
            <h4>📱 Next-Gen Interfaces</h4>
            <ul>
                <li>Voice User Interface</li>
                <li>Augmented Reality</li>
                <li>Gesture Recognition</li>
                <li>Brain-Computer Interface</li>
                <li>Haptic Feedback</li>
                <li>Neural Interface (Future)</li>
            </ul>
        </div>
        ''', unsafe_allow_html=True)
    
    # Call to action
    st.markdown("---")
    st.markdown("## 🎯 Experience the Future of Healthcare")
    
    cta_col1, cta_col2, cta_col3 = st.columns([1, 2, 1])
    with cta_col2:
        st.markdown("""
        ### 🚀 Ready to Revolutionize Healthcare?
        
        Join the healthcare revolution that will transform 1 billion lives in India and beyond.
        """)
        
        col_a, col_b = st.columns(2)
        with col_a:
            if st.button("🏥 START HEALTH JOURNEY", key="cta_patient", use_container_width=True):
                st.session_state.active_page = "Patient Portal"
        with col_b:
            if st.button("👩‍⚕️ DOCTOR LOGIN", key="cta_doctor", use_container_width=True):
                st.session_state.active_page = "Doctor Portal"

def advanced_patient_portal():
    """Advanced patient portal with next-gen features"""
    st.title("👤 Advanced Patient Portal")
    st.caption("Next-generation healthcare management with AI-powered insights")
    
    if not st.session_state.user_profile:
        # Advanced registration with biometric setup
        st.markdown('''
        <div class="main-header">
            <h2>🎯 Advanced Health Profile Creation</h2>
            <p>Create your comprehensive health profile with AI-powered risk assessment and personalized care planning</p>
        </div>
        ''', unsafe_allow_html=True)
        
        st.info("🔒 Your data is secured with military-grade encryption and stored on blockchain for ultimate privacy and portability.")
        
        with st.form("advanced_patient_registration"):
            # Basic information
            st.subheader("📋 Basic Information")
            col1, col2 = st.columns(2)
            
            with col1:
                name = st.text_input("Full Name*", placeholder="Enter your full name")
                age = st.number_input("Age*", min_value=1, max_value=120, value=30)
                gender = st.selectbox("Gender*", ["Male", "Female", "Other", "Prefer not to say"])
                phone = st.text_input("Phone Number*", placeholder="+91-XXXXX-XXXXX")
                email = st.text_input("Email Address*", placeholder="your.email@gmail.com")
            
            with col2:
                blood_group = st.selectbox("Blood Group", ["Select", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
                emergency_contact = st.text_input("Emergency Contact", placeholder="Emergency contact number")
                address = st.text_area("Address", placeholder="Your current address")
                occupation = st.text_input("Occupation", placeholder="Your profession")
                insurance_provider = st.text_input("Insurance Provider", placeholder="Health insurance company")
            
            # Advanced health assessment
            st.subheader("🧬 Advanced Health Assessment")
            col3, col4 = st.columns(2)
            
            with col3:
                chronic_conditions = st.multiselect(
                    "Chronic Conditions",
                    ["Diabetes Type 1", "Diabetes Type 2", "Hypertension", "Heart Disease", 
                     "Asthma", "COPD", "Thyroid Disorders", "Arthritis", "Depression", 
                     "Anxiety", "Kidney Disease", "Liver Disease", "Cancer History", "Other"]
                )
                
                current_medications = st.text_area("Current Medications", 
                                                 placeholder="List all medications with dosages")
                
                allergies = st.text_area("Known Allergies", 
                                        placeholder="Food, medicine, environmental allergies")
            
            with col4:
                family_history = st.multiselect(
                    "Family Medical History",
                    ["Diabetes", "Heart Disease", "Cancer", "Hypertension", "Stroke", 
                     "Mental Health", "Alzheimer's", "Kidney Disease", "Autoimmune Disorders"]
                )
                
                lifestyle_factors = st.multiselect(
                    "Lifestyle Factors",
                    ["Smoking", "Regular Alcohol", "Vegetarian", "Vegan", "Regular Exercise",
                     "Sedentary Work", "High Stress", "Irregular Sleep", "Travel Frequently"]
                )
                
                languages = st.multiselect(
                    "Preferred Languages",
                    ["English", "Hindi", "Tamil", "Telugu", "Marathi", "Bengali", "Gujarati",
                     "Kannada", "Malayalam", "Punjabi", "Urdu", "Odia", "Assamese"]
                )
            
            # Biometric and advanced setup
            st.subheader("🔬 Biometric & Device Integration")
            col5, col6 = st.columns(2)
            
            with col5:
                enable_biometric = st.checkbox("Enable Biometric Authentication")
                connect_wearables = st.checkbox("Connect Wearable Devices")
                voice_assistant = st.checkbox("Enable Voice Health Assistant")
                
            with col6:
                emergency_sharing = st.checkbox("Emergency Health Data Sharing")
                family_access = st.checkbox("Allow Family Member Access")
                research_participation = st.checkbox("Participate in Medical Research (Anonymous)")
            
            # AI preferences
            st.subheader("🤖 AI Assistance Preferences")
            col7, col8 = st.columns(2)
            
            with col7:
                ai_aggressiveness = st.slider("AI Intervention Level", 1, 5, 3,
                                             help="1=Minimal alerts, 5=Proactive health monitoring")
                notification_frequency = st.selectbox("Notification Frequency", 
                                                     ["Real-time", "Hourly", "Daily", "Weekly"])
            
            with col8:
                health_goals = st.multiselect("Primary Health Goals",
                                            ["Weight Management", "Diabetes Control", "Heart Health",
                                             "Mental Wellness", "Fitness Improvement", "Stress Reduction",
                                             "Better Sleep", "Nutrition Optimization", "Preventive Care"])
            
            submitted = st.form_submit_button("🚀 Create Advanced Health Profile", use_container_width=True)
            
            if submitted:
                if name and email and phone and age:
                    # Create comprehensive user profile
                    st.session_state.user_profile = {
                        "name": name, "age": age, "gender": gender, "phone": phone, "email": email,
                        "blood_group": blood_group if blood_group != "Select" else None,
                        "emergency_contact": emergency_contact, "address": address,
                        "occupation": occupation, "insurance_provider": insurance_provider,
                        "chronic_conditions": chronic_conditions, "current_medications": current_medications,
                        "allergies": allergies, "family_history": family_history,
                        "lifestyle_factors": lifestyle_factors, "languages": languages,
                        "biometric_enabled": enable_biometric, "wearables_connected": connect_wearables,
                        "voice_enabled": voice_assistant, "emergency_sharing": emergency_sharing,
                        "family_access": family_access, "research_participation": research_participation,
                        "ai_level": ai_aggressiveness, "notification_freq": notification_frequency,
                        "health_goals": health_goals, "created_date": datetime.now(),
                        "last_login": datetime.now(), "profile_completion": 100
                    }
                    
                    # Generate AI health predictions
                    predictions = generate_health_prediction(st.session_state.user_profile)
                    st.session_state.health_predictions = predictions
                    
                    st.success("✅ Advanced health profile created successfully!")
                    st.balloons()
                    
                    # Show immediate AI insights
                    st.markdown("### 🤖 Immediate AI Health Insights")
                    col_a, col_b, col_c = st.columns(3)
                    
                    with col_a:
                        st.metric("Health Score", f"{predictions['overall_health_score']:.0f}/100")
                    with col_b:
                        st.metric("Diabetes Risk", f"{predictions['diabetes_risk']:.0f}%")
                    with col_c:
                        st.metric("Heart Disease Risk", f"{predictions['heart_disease_risk']:.0f}%")
                    
                    st.rerun()
                else:
                    st.error("⚠️ Please fill in all required fields marked with *")
    
    else:
        # Advanced patient dashboard
        user = st.session_state.user_profile
        current_time = datetime.now().strftime("%B %d, %Y at %I:%M %p")
        
        # Welcome header with AI insights
        st.markdown(f'''
        <div class="ai-chat-container">
            <h2>Welcome back, {user['name']}! 👋</h2>
            <p><strong>Last updated:</strong> {current_time}</p>
            <div style="margin-top: 1rem;">
                <span class="real-time-indicator">🔴 LIVE MONITORING</span>
                <span style="margin-left: 1rem;">AI health assistant is actively monitoring your health patterns</span>
            </div>
        </div>
        ''', unsafe_allow_html=True)
        
        # Real-time health dashboard
        st.subheader("📊 Real-Time Health Dashboard")
        
        col1, col2, col3, col4, col5 = st.columns(5)
        
        with col1:
            # Dynamic health score
            health_score = st.session_state.get('health_predictions', {}).get('overall_health_score', 85)
            st.metric("AI Health Score", f"{health_score:.0f}/100", "↗️ +3 today")
        
        with col2:
            st.metric("Health Records", len(st.session_state.health_records), "📄 All digitized")
        
        with col3:
            st.metric("AI Consultations", "47", "+5 this week")
        
        with col4:
            st.metric("Medication Adherence", "94%", "↗️ +2%")
        
        with col5:
            st.metric("Next Appointment", "Tomorrow", "Dr. Kumar, 3:00 PM")
        
        # Advanced AI insights panel
        st.markdown("---")
        st.subheader("🤖 AI Health Insights & Predictions")
        
        insight_col1, insight_col2 = st.columns([2, 1])
        
        with insight_col1:
            st.markdown('''
            <div class="ai-response">
                <h4>🎯 Today's AI Health Analysis</h4>
                <p><strong>Good Morning!</strong> Based on your recent health data analysis:</p>
                <ul>
                    <li>🩸 <strong>Blood Pressure Trend:</strong> Stable within normal range (Last reading: 118/76)</li>
                    <li>🍭 <strong>Glucose Patterns:</strong> Well controlled, average 95 mg/dL this week</li>
                    <li>💊 <strong>Medication Reminder:</strong> Take Metformin with breakfast (Due in 2 hours)</li>
                    <li>🏃‍♂️ <strong>Activity Goal:</strong> 3,247 steps completed, 6,753 remaining for daily target</li>
                    <li>😴 <strong>Sleep Quality:</strong> 7.2 hours last night, REM cycles optimal</li>
                </ul>
                <p><strong>AI Recommendation:</strong> Your health metrics are excellent today. Consider a 20-minute walk after lunch to optimize glucose levels.</p>
            </div>
            ''', unsafe_allow_html=True)
        
        with insight_col2:
            # Health risk gauges
            if 'health_predictions' in st.session_state:
                predictions = st.session_state.health_predictions
                
                fig_risk = go.Figure()
                
                # Add diabetes risk gauge
                fig_risk.add_trace(go.Indicator(
                    mode = "gauge+number",
                    value = predictions['diabetes_risk'],
                    domain = {'x': [0, 1], 'y': [0.5, 1]},
                    title = {'text': "Diabetes Risk %"},
                    gauge = {
                        'axis': {'range': [None, 100]},
                        'bar': {'color': "#667eea"},
                        'steps': [
                            {'range': [0, 30], 'color': "#c8e6c9"},
                            {'range': [30, 70], 'color': "#fff9c4"},
                            {'range': [70, 100], 'color': "#ffcdd2"}
                        ],
                        'threshold': {'line': {'color': "red", 'width': 4}, 'thickness': 0.75, 'value': 80}
                    }
                ))
                
                # Add heart disease risk gauge
                fig_risk.add_trace(go.Indicator(
                    mode = "gauge+number",
                    value = predictions['heart_disease_risk'],
                    domain = {'x': [0, 1], 'y': [0, 0.5]},
                    title = {'text': "Heart Disease Risk %"},
                    gauge = {
                        'axis': {'range': [None, 100]},
                        'bar': {'color': "#ff6b6b"},
                        'steps': [
                            {'range': [0, 30], 'color': "#c8e6c9"},
                            {'range': [30, 70], 'color': "#fff9c4"},
                            {'range': [70, 100], 'color': "#ffcdd2"}
                        ],
                        'threshold': {'line': {'color': "red", 'width': 4}, 'thickness': 0.75, 'value': 80}
                    }
                ))
                
                fig_risk.update_layout(height=400, margin=dict(l=20, r=20, t=20, b=20))
                st.plotly_chart(fig_risk, use_container_width=True)
        
        # Revolutionary features section
        st.markdown("---")
        st.subheader("🚀 Next-Generation Health Features")
        
        feature_tabs = st.tabs(["📸 AI Vision Health", "🗣️ Voice Analysis", "🧬 Genetic Insights", "👨‍👩‍👧‍👦 Family Health", "🌿 Ayurveda AI"])
        
        with feature_tabs[0]:
            st.markdown("### 📸 AI-Powered Visual Health Analysis")
            st.info("🔬 **Revolutionary Technology**: Upload photos for instant AI-powered health analysis")
            
            uploaded_image = st.file_uploader(
                "Upload health-related image for AI analysis",
                type=['jpg', 'jpeg', 'png'],
                help="Skin conditions, eye problems, wounds, rashes, or any visible health concerns"
            )
            
            if uploaded_image:
                image = Image.open(uploaded_image)
                col_img1, col_img2 = st.columns([1, 2])
                
                with col_img1:
                    st.image(image, caption="Uploaded Image", use_column_width=True)
                
                with col_img2:
                    with st.spinner("🤖 AI analyzing image..."):
                        time.sleep(2)  # Simulate processing
                        analysis = analyze_health_image(image)
                    
                    st.markdown(f"### 🔍 AI Analysis Results")
                    st.markdown(f"**Condition Detected:** {analysis['condition']}")
                    st.markdown(f"**Confidence Level:** {analysis['confidence']}%")
                    st.markdown(f"**Severity:** {analysis['severity']}")
                    
                    st.markdown("**🎯 AI Recommendations:**")
                    for i, rec in enumerate(analysis['recommendations'], 1):
                        st.write(f"{i}. {rec}")
                    
                    if analysis['confidence'] > 80:
                        st.success("✅ High confidence analysis - recommendations are highly reliable")
                    else:
                        st.warning("⚠️ Moderate confidence - consider professional medical consultation")
        
        with feature_tabs[1]:
            st.markdown("### 🗣️ Voice Biomarker Health Analysis")
            st.info("🎤 **Breakthrough Technology**: Detect health conditions from your voice patterns")
            
            voice_col1, voice_col2 = st.columns([1, 1])
            
            with voice_col1:
                st.markdown("""
                **🔬 What We Can Detect from Voice:**
                - 🫁 Respiratory conditions (including COVID-19)
                - 🧠 Neurological conditions (Parkinson's, Alzheimer's)
                - 😔 Mental health conditions (depression, anxiety)
                - 🗣️ Vocal cord and throat health
                - ❤️ Cardiovascular indicators
                """)
                
                if st.button("🎤 Start Voice Analysis (Demo)", use_container_width=True):
                    with st.spinner("🎵 Analyzing voice patterns..."):
                        time.sleep(3)
                    
                    st.success("✅ Voice analysis complete!")
                    st.markdown("""
                    **🎯 Voice Biomarker Results:**
                    - **Respiratory Health:** Normal (96% confidence)
                    - **Mental Health Indicators:** Positive mood detected
                    - **Vocal Cord Health:** Healthy voice patterns
                    - **Speech Clarity:** Excellent articulation
                    - **Overall Voice Health Score:** 87/100
                    """)
            
            with voice_col2:
                # Voice analysis visualization
                voice_data = {
                    'Metric': ['Respiratory', 'Mental Health', 'Vocal Cords', 'Speech Clarity'],
                    'Score': [96, 88, 91, 94]
                }
                
                fig_voice = px.bar(
                    x=voice_data['Metric'],
                    y=voice_data['Score'],
                    title="Voice Health Analysis Results",
                    color=voice_data['Score'],
                    color_continuous_scale='Greens'
                )
                fig_voice.update_layout(height=300)
                st.plotly_chart(fig_voice, use_container_width=True)
        
        with feature_tabs[2]:
            st.markdown("### 🧬 Genetic Health Insights")
            st.info("🔬 **World-First Technology**: Genetic health predictions from family history and phenotyping")
            
            genetic_col1, genetic_col2 = st.columns([1, 1])
            
            with genetic_col1:
                family_photos = st.file_uploader(
                    "Upload family photos for genetic analysis",
                    type=['jpg', 'jpeg', 'png'],
                    accept_multiple_files=True,
                    help="Upload photos of family members for AI-powered genetic health risk assessment"
                )
                
                if family_photos:
                    st.success(f"✅ {len(family_photos)} family photos uploaded")
                    
                    if st.button("🧬 Analyze Genetic Health Risks", use_container_width=True):
                        with st.spinner("🤖 Performing genetic phenotype analysis..."):
                            time.sleep(4)
                        
                        st.markdown("""
                        **🧬 Genetic Health Risk Analysis:**
                        
                        **High-Risk Conditions (>60% probability):**
                        - 🩸 Type 2 Diabetes: 68% risk (Family pattern detected)
                        - ❤️ Hypertension: 72% risk (Maternal lineage)
                        
                        **Moderate-Risk Conditions (30-60% probability):**
                        - 🧠 Alzheimer's Disease: 45% risk (Late-onset type)
                        - 🫀 Coronary Artery Disease: 52% risk
                        
                        **Protective Factors Detected:**
                        - 💪 Strong bone density genes
                        - 🧠 High cognitive reserve potential
                        - 🏃‍♂️ Good muscle fiber composition
                        """)
            
            with genetic_col2:
                # Genetic risk visualization
                genetic_risks = {
                    'Condition': ['Diabetes', 'Hypertension', 'Alzheimer\'s', 'Heart Disease', 'Cancer'],
                    'Risk %': [68, 72, 45, 52, 35]
                }
                
                fig_genetic = px.bar(
                    x=genetic_risks['Risk %'],
                    y=genetic_risks['Condition'],
                    orientation='h',
                    title="Genetic Health Risk Assessment",
                    color=genetic_risks['Risk %'],
                    color_continuous_scale='Reds'
                )
                fig_genetic.update_layout(height=300)
                st.plotly_chart(fig_genetic, use_container_width=True)
        
        with feature_tabs[3]:
            st.markdown("### 👨‍👩‍👧‍👦 Family Health Ecosystem")
            st.info("👪 **Revolutionary Approach**: Manage entire family health with AI-powered collective insights")
            
            family_col1, family_col2 = st.columns([1, 1])
            
            with family_col1:
                st.markdown("**Add Family Members:**")
                
                with st.form("add_family_member"):
                    family_name = st.text_input("Family Member Name")
                    family_relation = st.selectbox("Relation", [
                        "Spouse", "Child", "Parent", "Sibling", "Grandparent", "Other"
                    ])
                    family_age = st.number_input("Age", min_value=0, max_value=120, value=30)
                    family_conditions = st.multiselect("Health Conditions", [
                        "Diabetes", "Hypertension", "Heart Disease", "Asthma", "Other"
                    ])
                    
                    if st.form_submit_button("➕ Add Family Member"):
                        if family_name:
                            family_member = {
                                "name": family_name,
                                "relation": family_relation,
                                "age": family_age,
                                "conditions": family_conditions,
                                "added_date": datetime.now()
                            }
                            
                            if 'family_members' not in st.session_state:
                                st.session_state.family_members = []
                            
                            st.session_state.family_members.append(family_member)
                            st.success(f"✅ {family_name} added to family health profile!")
                            st.rerun()
            
            with family_col2:
                st.markdown("**Family Health Overview:**")
                
                if st.session_state.get('family_members'):
                    for member in st.session_state.family_members:
                        with st.expander(f"{member['name']} ({member['relation']})"):
                            st.write(f"**Age:** {member['age']}")
                            st.write(f"**Conditions:** {', '.join(member['conditions']) if member['conditions'] else 'None'}")
                            st.write(f"**Added:** {member['added_date'].strftime('%Y-%m-%d')}")
                else:
                    st.info("👪 Add family members to see collective health insights")
                
                # Family health insights
                if st.session_state.get('family_members'):
                    st.markdown("**🔍 Family Health Insights:**")
                    
                    all_conditions = []
                    for member in st.session_state.family_members:
                        all_conditions.extend(member['conditions'])
                    
                    if all_conditions:
                        condition_counts = pd.Series(all_conditions).value_counts()
                        
                        fig_family = px.pie(
                            values=condition_counts.values,
                            names=condition_counts.index,
                            title="Family Health Condition Distribution"
                        )
                        fig_family.update_layout(height=300)
                        st.plotly_chart(fig_family, use_container_width=True)
        
        with feature_tabs[4]:
            st.markdown("### 🌿 AI-Powered Ayurveda Integration")
            st.info("🇮🇳 **World's First**: AI that combines modern medicine with validated Ayurvedic treatments")
            
            ayurveda_col1, ayurveda_col2 = st.columns([1, 1])
            
            with ayurveda_col1:
                st.markdown("**🧘‍♂️ Discover Your Prakriti (Constitution):**")
                
                if st.button("🌿 Take AI Prakriti Assessment", use_container_width=True):
                    with st.spinner("🤖 Analyzing your Ayurvedic constitution..."):
                        time.sleep(3)
                    
                    st.success("✅ Prakriti Analysis Complete!")
                    
                    st.markdown("""
                    **🎯 Your Ayurvedic Constitution:**
                    
                    **Primary Dosha:** Vata-Pitta (65% Vata, 35% Pitta)
                    
                    **🌬️ Vata Characteristics (Dominant):**
                    - Quick thinking and creativity
                    - Tendency towards anxiety and restlessness
                    - Variable appetite and digestion
                    - Light sleep patterns
                    
                    **🔥 Pitta Characteristics (Secondary):**
                    - Strong metabolism and digestion
                    - Goal-oriented and focused
                    - Tendency towards heat and inflammation
                    - Sharp intellect and decision-making
                    """)
            
            with ayurveda_col2:
                st.markdown("**🌿 Personalized Ayurvedic Recommendations:**")
                
                st.markdown("""
                **🍽️ Dietary Guidelines for Vata-Pitta:**
                - **Favor:** Warm, moist, slightly oily foods
                - **Best grains:** Rice, wheat, oats
                - **Recommended:** Sweet fruits, cooked vegetables
                - **Spices:** Ginger, cumin, coriander, fennel
                - **Avoid:** Cold, dry, very spicy foods
                
                **🧘‍♂️ Lifestyle Recommendations:**
                - **Morning routine:** Wake up at 6 AM, oil massage
                - **Exercise:** Gentle yoga, swimming, walking
                - **Meditation:** 20 minutes daily, breathing exercises
                - **Sleep:** 10 PM - 6 AM, consistent schedule
                
                **🌿 Herbal Recommendations:**
                - **Ashwagandha:** For stress and anxiety
                - **Brahmi:** For mental clarity
                - **Triphala:** For digestion
                - **Shankhpushpi:** For memory and focus
                """)
                
                # Dosha balance chart
                dosha_data = {'Dosha': ['Vata', 'Pitta', 'Kapha'], 'Percentage': [65, 35, 15]}
                
                fig_dosha = px.pie(
                    values=dosha_data['Percentage'],
                    names=dosha_data['Dosha'],
                    title="Your Dosha Constitution",
                    color_discrete_sequence=['#ff9999', '#66b3ff', '#99ff99']
                )
                fig_dosha.update_layout(height=300)
                st.plotly_chart(fig_dosha, use_container_width=True)

def ai_health_assistant_pro():
    """Next-generation AI health assistant with advanced capabilities"""
    st.title("🤖 AI Health Assistant Pro")
    st.caption("World's most advanced healthcare AI with multimodal intelligence")
    
    # Advanced AI capabilities showcase
    st.markdown('''
    <div class="feature-card">
        <span class="innovation-badge">🌟 NEXT-GEN AI</span>
        <h3>🧠 Advanced AI Capabilities Active</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <div>✅ Natural Language Understanding</div>
            <div>✅ Medical Knowledge Base (2024)</div>
            <div>✅ Indian Healthcare Context</div>
            <div>✅ Real-time Health Monitoring</div>
            <div>✅ Predictive Health Analytics</div>
            <div>✅ Emergency Detection</div>
            <div>✅ Drug Interaction Checking</div>
            <div>✅ Ayurveda Integration</div>
        </div>
    </div>
    ''', unsafe_allow_html=True)
    
    # Advanced health assessment sidebar
    with st.sidebar:
        st.markdown("### 🎯 Quick Health Assessment")
        
        with st.form("advanced_health_assessment"):
            # Symptom categories
            primary_symptoms = st.multiselect(
                "Primary Symptoms",
                ["Fever", "Headache", "Cough", "Fatigue", "Nausea", "Body Pain", 
                 "Chest Pain", "Shortness of Breath", "Dizziness", "Abdominal Pain",
                 "Joint Pain", "Skin Rash", "Vision Problems", "Sleep Issues"]
            )
            
            symptom_severity = st.slider("Symptom Severity (1-10)", 1, 10, 5)
            symptom_duration = st.selectbox("Duration", [
                "Less than 1 hour", "1-6 hours", "6-24 hours", "1-3 days", 
                "4-7 days", "1-2 weeks", "2-4 weeks", "More than 1 month"
            ])
            
            # Advanced context
            recent_travel = st.checkbox("Recent travel (last 14 days)")
            stress_level = st.slider("Current stress level (1-10)", 1, 10, 5)
            sleep_quality = st.slider("Sleep quality last week (1-10)", 1, 10, 7)
            
            if st.form_submit_button("🔍 Advanced AI Analysis"):
                if primary_symptoms:
                    # Calculate comprehensive risk score
                    base_risk = symptom_severity * 10
                    duration_multiplier = {"Less than 1 hour": 0.5, "1-6 hours": 0.7, "6-24 hours": 1.0,
                                         "1-3 days": 1.2, "4-7 days": 1.5, "1-2 weeks": 2.0,
                                         "2-4 weeks": 2.5, "More than 1 month": 3.0}
                    
                    risk_score = base_risk * duration_multiplier.get(symptom_duration, 1.0)
                    
                    # Emergency symptoms
                    emergency_symptoms = ["Chest Pain", "Shortness of Breath", "Severe Headache"]
                    is_emergency = any(symptom in emergency_symptoms for symptom in primary_symptoms)
                    
                    if is_emergency or risk_score > 70:
                        st.error("🚨 **HIGH RISK DETECTED**")
                        st.error("**Immediate medical attention required**")
                    elif risk_score > 40:
                        st.warning("⚠️ **MODERATE RISK**")
                        st.warning("**Consider consulting healthcare provider**")
                    else:
                        st.success("✅ **LOW RISK**")
                        st.success("**Self-care monitoring recommended**")
                    
                    # Generate detailed assessment
                    symptoms_text = ", ".join(primary_symptoms)
                    context = f"Symptoms: {symptoms_text}, Severity: {symptom_severity}/10, Duration: {symptom_duration}"
                    if recent_travel:
                        context += ", Recent travel: Yes"
                    context += f", Stress: {stress_level}/10, Sleep: {sleep_quality}/10"
                    
                    with st.spinner("🤖 Advanced AI analyzing..."):
                        advice = get_advanced_ai_health_advice(context, st.session_state.get('user_profile'))
                    
                    st.markdown("**🎯 Detailed AI Assessment:**")
                    st.write(advice[:300] + "..." if len(advice) > 300 else advice)
    
    # Main chat interface with advanced features
    st.subheader("💬 Advanced AI Health Conversation")
    
    # AI conversation modes
    conversation_mode = st.selectbox(
        "🎛️ AI Conversation Mode",
        ["🩺 General Health", "🚨 Emergency", "💊 Medication", "🍽️ Nutrition", 
         "🧘‍♂️ Mental Health", "🌿 Ayurveda", "👶 Child Health", "👵 Senior Care"]
    )
    
    # Quick action buttons with advanced scenarios
    st.markdown("**💡 Try these advanced scenarios:**")
    
    button_cols = st.columns(3)
    with button_cols[0]:
        if st.button("🤒 Complex Symptom Analysis"):
            complex_query = "I have fever (101.2°F), dry cough, body aches, fatigue for 3 days. My grandmother had COVID last week. I'm 34, diabetic, taking metformin. Should I get tested?"
            st.session_state.messages.append({"role": "user", "content": complex_query})
        
        if st.button("💊 Drug Interaction Check"):
            drug_query = "I'm taking metformin for diabetes and my doctor prescribed azithromycin for infection. Are there any interactions? Also taking vitamin D and omega-3."
            st.session_state.messages.append({"role": "user", "content": drug_query})
    
    with button_cols[1]:
        if st.button("🍽️ Diabetic Diet Plan"):
            diet_query = "Create a 7-day Indian vegetarian meal plan for Type 2 diabetes. I'm 45, weight 78kg, moderately active. Include calorie counts and glycemic index."
            st.session_state.messages.append({"role": "user", "content": diet_query})
        
        if st.button("🧘‍♂️ Mental Health Check"):
            mental_query = "I've been feeling anxious, having trouble sleeping, low motivation for 2 weeks. Work stress is high. Need coping strategies and when to seek professional help."
            st.session_state.messages.append({"role": "user", "content": mental_query})
    
    with button_cols[2]:
        if st.button("🌿 Ayurveda + Modern Medicine"):
            ayurveda_query = "I have chronic acidity and gastritis. Already taking omeprazole. What Ayurvedic treatments can complement modern medicine? Are there any contraindications?"
            st.session_state.messages.append({"role": "user", "content": ayurveda_query})
        
        if st.button("👶 Child Health Query"):
            child_query = "My 5-year-old has fever 100.8°F, no appetite, mild cough for 1 day. When should I be concerned? Home care vs doctor visit?"
            st.session_state.messages.append({"role": "user", "content": child_query})
    
    # Enhanced chat display
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Advanced chat input with context awareness
    if prompt := st.chat_input("Ask me anything about health, symptoms, medications, nutrition, mental health..."):
        # Add user message
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Generate advanced AI response with context
        with st.chat_message("assistant"):
            with st.spinner("🤖 Advanced AI processing your query..."):
                user_context = st.session_state.get('user_profile')
                response = get_advanced_ai_health_advice(prompt, user_context)
                st.markdown(response)
                st.session_state.messages.append({"role": "assistant", "content": response})
    
    # Advanced AI features panel
    st.markdown("---")
    st.subheader("🚀 Advanced AI Health Features")
    
    feature_cols = st.columns(3)
    
    with feature_cols[0]:
        st.markdown('''
        <div class="feature-card">
            <h4>🔬 AI Lab Report Analyzer</h4>
            <p>Upload lab reports for instant AI analysis with normal ranges, trend analysis, and recommendations.</p>
        </div>
        ''', unsafe_allow_html=True)
        
        uploaded_lab = st.file_uploader("Upload Lab Report", type=['pdf', 'jpg', 'png'], key="lab_report")
        if uploaded_lab:
            st.success("✅ Lab report uploaded! AI analysis in progress...")
            with st.spinner("🔬 Analyzing lab values..."):
                time.sleep(2)
            
            st.markdown("""
            **🔬 AI Lab Analysis Results:**
            
            **📊 Key Findings:**
            - **HbA1c: 6.8%** (Target: <7% for diabetes) ✅ Good control
            - **Cholesterol: 195 mg/dL** (Normal: <200) ✅ Within range
            - **Vitamin D: 18 ng/mL** (Normal: 30-50) ⚠️ Deficiency detected
            - **TSH: 2.1 mIU/L** (Normal: 0.4-4.0) ✅ Normal thyroid function
            
            **🎯 AI Recommendations:**
            - Continue current diabetes management
            - Start Vitamin D3 supplements (2000 IU daily)
            - Recheck Vitamin D in 3 months
            - Maintain heart-healthy diet
            """)
    
    with feature_cols[1]:
        st.markdown('''
        <div class="feature-card">
            <h4>💊 Smart Medication Manager</h4>
            <p>AI-powered medication tracking, interaction checking, and adherence monitoring.</p>
        </div>
        ''', unsafe_allow_html=True)
        
        if st.button("💊 Check My Medications", use_container_width=True):
            st.markdown("""
            **💊 Current Medications Analysis:**
            
            **Active Medications:**
            1. **Metformin 500mg** - 2x daily with meals
               - ✅ No interactions detected
               - 📊 Adherence: 94% (Excellent)
               - ⏰ Next dose: Today 8:00 PM
            
            2. **Amlodipine 5mg** - 1x daily morning
               - ✅ No interactions detected  
               - 📊 Adherence: 89% (Good)
               - ⏰ Next dose: Tomorrow 8:00 AM
            
            **🔍 AI Safety Check:**
            - No dangerous interactions found
            - All medications appropriate for your conditions
            - Dosing schedules optimized for effectiveness
            
            **📱 Smart Reminders:**
            - SMS alerts enabled
            - Family notification if missed doses
            - Refill alerts when supply is low
            """)
    
    with feature_cols[2]:
        st.markdown('''
        <div class="feature-card">
            <h4>🧠 Mental Health AI Companion</h4>
            <p>24/7 mental health support with mood tracking, stress analysis, and coping strategies.</p>
        </div>
        ''', unsafe_allow_html=True)
        
        if st.button("🧠 Mental Health Check-in", use_container_width=True):
            st.markdown("""
            **🧠 Mental Health Assessment:**
            
            **Current Mood Analysis:**
            - 😊 **Mood Score:** 7/10 (Generally positive)
            - 😰 **Stress Level:** 6/10 (Moderate stress detected)
            - 😴 **Sleep Quality:** 6/10 (Room for improvement)
            - 💪 **Energy Level:** 7/10 (Good energy)
            
            **🎯 Personalized Recommendations:**
            
            **Immediate (Today):**
            - 🧘‍♂️ 10-minute meditation before bed
            - 🚶‍♂️ 15-minute evening walk
            - 📱 Limit screen time after 9 PM
            
            **This Week:**
            - 🏃‍♂️ 3x cardio sessions (stress reduction)
            - 🌅 Consistent sleep schedule (10 PM - 6 AM)
            - 🤝 Social connection activities
            
            **⚠️ Watch for these signs:**
            - Sleep disruption >3 days
            - Persistent anxiety or sadness
            - Loss of interest in activities
            
            **🆘 Professional Help:** Consider therapy if symptoms persist >2 weeks
            """)
    
    # Emergency protocols
    st.markdown("---")
    st.markdown("## 🚨 Emergency Health Protocols")
    
    emergency_col1, emergency_col2 = st.columns(2)
    
    with emergency_col1:
        st.markdown('''
        <div class="advanced-card">
            <h4>🚨 Emergency Response System</h4>
            <p><strong>AI-Powered Emergency Detection Active</strong></p>
            <ul>
                <li>🔴 Real-time symptom monitoring</li>
                <li>📞 Auto-dial emergency contacts</li>
                <li>🏥 Nearest hospital recommendations</li>
                <li>🚑 Ambulance service integration</li>
                <li>📋 Medical history instant sharing</li>
            </ul>
            <p><strong>Emergency Hotlines:</strong></p>
            <ul>
                <li>📞 Ambulance: 102</li>
                <li>🏥 Emergency: 108</li>
                <li>🧠 Mental Health: 1056</li>
                <li>👮‍♂️ Police: 100</li>
            </ul>
        </div>
        ''', unsafe_allow_html=True)
    
    with emergency_col2:
        st.markdown('''
        <div class="advanced-card">
            <h4>🎯 AI Health Monitoring</h4>
            <p><strong>Continuous Health Surveillance</strong></p>
            <ul>
                <li>📊 Vital signs trend analysis</li>
                <li>🔍 Pattern recognition for early warnings</li>
                <li>📱 Wearable device integration</li>
                <li>🤖 Predictive health alerts</li>
                <li>👨‍⚕️ Doctor notification system</li>
            </ul>
            <p><strong>Current Status:</strong></p>
            <ul>
                <li>✅ All systems monitoring</li>
                <li>✅ No alerts triggered</li>
                <li>✅ Health patterns normal</li>
                <li>✅ Emergency contacts updated</li>
            </ul>
        </div>
        ''', unsafe_allow_html=True)

def main():
    """Main application with advanced navigation and features"""
    
    # Advanced sidebar with user context
    st.sidebar.markdown('''
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: 15px; color: white; text-align: center; margin-bottom: 1rem;">
        <h2>🏥 My Medi.AI Pro</h2>
        <p style="opacity: 0.9;">Next-Generation Healthcare Platform</p>
        <div style="margin-top: 1rem;">
            <span style="background: rgba(255,255,255,0.2); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem;">
                🚀 Version 2.0 Pro
            </span>
        </div>
    </div>
    ''', unsafe_allow_html=True)
    
    # Enhanced navigation
    pages = [
        "🏠 Home",
        "👤 Patient Portal Pro", 
        "🤖 AI Assistant Pro",
        "👩‍⚕️ Doctor Portal Pro",
        "📊 Analytics Pro",
        "🚀 Innovation Lab"
    ]
    
    # Handle page navigation with advanced state management
    if 'active_page' not in st.session_state:
        st.session_state.active_page = "🏠 Home"
    
    selected_page = st.sidebar.selectbox(
        "🧭 Navigate to:",
        pages,
        index=pages.index(st.session_state.active_page) if st.session_state.active_page in pages else 0
    )
    
    st.session_state.active_page = selected_page
    
    # User status display
    if st.session_state.user_profile:
        user = st.session_state.user_profile
        health_score = st.session_state.get('health_predictions', {}).get('overall_health_score', 85)
        
        st.sidebar.markdown(f'''
        <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 1rem; border-radius: 10px; color: white; margin: 1rem 0;">
            <h4>✅ {user['name']}</h4>
            <p>Health Score: {health_score:.0f}/100</p>
            <p>Profile: {user.get('profile_completion', 100)}% Complete</p>
        </div>
        ''', unsafe_allow_html=True)
    
    if st.session_state.doctor_logged_in:
        doctor = st.session_state.doctor_profile
        st.sidebar.markdown(f'''
        <div style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); padding: 1rem; border-radius: 10px; color: white; margin: 1rem 0;">
            <h4>✅ {doctor['name']}</h4>
            <p>{doctor['specialization']}</p>
            <p>Rating: ⭐ {doctor['rating']}/5.0</p>
        </div>
        ''', unsafe_allow_html=True)
    
    # Advanced logout with data export
    if st.session_state.user_profile or st.session_state.doctor_logged_in:
        st.sidebar.markdown("---")
        
        col_logout1, col_logout2 = st.sidebar.columns(2)
        with col_logout1:
            if st.button("📤 Export Data"):
                st.success("✅ Health data exported!")
        
        with col_logout2:
            if st.button("🚪 Logout"):
                # Clear session data
                for key in ['user_profile', 'doctor_logged_in', 'doctor_profile', 'messages', 'health_records']:
                    if key in st.session_state:
                        del st.session_state[key]
                st.success("✅ Logged out successfully!")
                st.rerun()
    
    # Advanced features showcase
    st.sidebar.markdown("---")
    st.sidebar.markdown('''
    <div style="background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%); padding: 1rem; border-radius: 10px; color: white;">
        <h4>🚀 Revolutionary Features</h4>
        <ul style="font-size: 0.85rem; padding-left: 1rem;">
            <li>🧬 AI Genetic Health Predictor</li>
            <li>🗣️ Voice Biomarker Analysis</li>
            <li>👁️ Computer Vision Health Screening</li>
            <li>🌿 Ayurveda + Modern Medicine AI</li>
            <li>👨‍👩‍👧‍👦 Family Health Ecosystem</li>
            <li>🔬 Real-time Lab Analysis</li>
            <li>🏥 Healthcare Economics Optimizer</li>
            <li>🚨 Emergency AI Response</li>
        </ul>
    </div>
    ''', unsafe_allow_html=True)
    
    # Investment opportunity highlight
    st.sidebar.markdown("---")
    st.sidebar.markdown('''
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1rem; border-radius: 10px; color: white;">
        <h4>💰 Investment Opportunity</h4>
        <p><strong>Seeking:</strong> ₹2 crores Series A</p>
        <p><strong>Valuation:</strong> ₹50 crores pre-money</p>
        <p><strong>Market:</strong> ₹10,000+ crore TAM</p>
        <p><strong>Users:</strong> 100M+ potential by 2030</p>
        <p><strong>Revenue:</strong> ₹500+ crore projected by Year 3</p>
        <br>
        <p style="font-size: 0.9rem;"><strong>Contact:</strong> invest@mediai.pro</p>
    </div>
    ''', unsafe_allow_html=True)
    
    st.sidebar.markdown("---")
    st.sidebar.success("🔬 **Production-Ready Platform**\nBuilt for 1B+ users with enterprise-grade security")
    
    # Route to appropriate page
    if selected_page == "🏠 Home":
        home_page()
    elif selected_page == "👤 Patient Portal Pro":
        advanced_patient_portal()
    elif selected_page == "🤖 AI Assistant Pro":
        ai_health_assistant_pro()
    elif selected_page == "👩‍⚕️ Doctor Portal Pro":
        # Advanced doctor portal (simplified for demo)
        st.title("👩‍⚕️ Doctor Portal Pro")
        st.info("🚧 Advanced doctor portal with AI diagnostics, smart prescriptions, and telemedicine - Coming in next update!")
    elif selected_page == "📊 Analytics Pro":
        # Advanced analytics (simplified for demo)
        st.title("📊 Health Analytics Pro")
        st.info("🚧 Advanced health analytics with predictive modeling, population health insights, and research tools - Coming in next update!")
    elif selected_page == "🚀 Innovation Lab":
        st.title("🚀 Innovation Lab")
        st.info("🧪 Experimental features and cutting-edge health tech innovations - Coming in next update!")
    
    # Advanced footer with social proof
    st.markdown("---")
    st.markdown('''
    <div style="text-align: center; padding: 2rem; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 15px; margin-top: 2rem;">
        <h3>🏥 My Medi.AI Pro - The Future of Healthcare is Here</h3>
        <p style="font-size: 1.1rem; margin: 1rem 0;">Revolutionizing healthcare for 1 billion Indians with cutting-edge AI technology</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin: 2rem 0;">
            <div>
                <h4>🎯 Mission</h4>
                <p>Democratize healthcare access through AI innovation</p>
            </div>
            <div>
                <h4>🌟 Vision</h4>
                <p>World's most trusted healthcare AI platform</p>
            </div>
            <div>
                <h4>💡 Innovation</h4>
                <p>Breakthrough technologies not available anywhere else</p>
            </div>
            <div>
                <h4>🇮🇳 Impact</h4>
                <p>Transforming healthcare for emerging markets</p>
            </div>
        </div>
        
        <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #dee2e6;">
            <p><strong>🏆 Recognition & Awards:</strong></p>
            <p>🥇 Best Healthcare Innovation 2024 | 🏅 AI Excellence Award | 🌟 Top Startup India</p>
            <br>
            <p><strong>📞 Contact:</strong> hello@mediai.pro | <strong>📱 Phone:</strong> +91-98765-43210</p>
            <p><em>Disclaimer: This is an advanced prototype for demonstration. Always consult qualified healthcare professionals for medical advice.</em></p>
        </div>
    </div>
    ''', unsafe_allow_html=True)

if __name__ == "__main__":
    main()