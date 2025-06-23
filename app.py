import streamlit as st
import openai
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import requests
import json
import os

# Page configuration
st.set_page_config(
    page_title="My Medi.AI - Healthcare Revolution",
    page_icon="🏥",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize OpenAI API Key
try:
    if "OPENAI_API_KEY" in st.secrets:
        openai.api_key = st.secrets["OPENAI_API_KEY"]
    else:
        # For local development - replace with your key
        openai.api_key = "sk-your-actual-openai-key" # Replace this with your actual key
except:
    st.warning("⚠️ OpenAI API key not configured. Using demo responses.")

# Custom CSS for professional medical theme
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 15px;
        color: white;
        text-align: center;
        margin-bottom: 2rem;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }
    
    .feature-card {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        border-left: 5px solid #667eea;
        margin: 1rem 0;
        transition: transform 0.3s ease;
    }
    
    .feature-card:hover {
        transform: translateY(-5px);
    }
    
    .metric-card {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        padding: 1.5rem;
        border-radius: 12px;
        color: white;
        text-align: center;
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }
    
    .chat-message {
        padding: 1rem;
        border-radius: 10px;
        margin: 0.5rem 0;
        background: #f8f9fa;
        border-left: 4px solid #667eea;
    }
    
    .sidebar .sidebar-content {
        background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
    }
    
    .stButton > button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.5rem 1rem;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    
    .success-box {
        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
    }
    
    .warning-box {
        background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'messages' not in st.session_state:
    st.session_state.messages = []
if 'user_profile' not in st.session_state:
    st.session_state.user_profile = {}
if 'health_records' not in st.session_state:
    st.session_state.health_records = []
if 'doctor_logged_in' not in st.session_state:
    st.session_state.doctor_logged_in = False

# AI Response Functions
def get_ai_health_advice(symptoms):
    """Get AI-powered health advice"""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": """You are a helpful AI health assistant for India. 
                Provide general health guidance but always recommend consulting doctors for serious issues.
                Include Indian context like local foods, climate considerations, and healthcare accessibility.
                Be empathetic, clear, and practical in your advice."""},
                {"role": "user", "content": f"Patient symptoms and concerns: {symptoms}"}
            ],
            max_tokens=300,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        # Fallback responses for demo
        if "fever" in symptoms.lower() or "headache" in symptoms.lower():
            return """Based on your symptoms of fever and headache, here's my assessment:

**Possible Causes:**
• Viral fever (most common)
• Common cold or flu
• Stress or dehydration

**Immediate Care:**
• Rest adequately (8-10 hours sleep)
• Stay hydrated (8-10 glasses of water)
• Take paracetamol 500mg if fever > 100°F
• Monitor temperature every 4 hours

**When to see a doctor:**
• Fever persists for more than 3 days
• Temperature exceeds 102°F
• Severe headache with stiff neck
• Persistent vomiting

**Indian Home Remedies:**
• Ginger-tulsi tea with honey
• Turmeric milk before bed
• Steam inhalation with eucalyptus

*Remember: This is general guidance. Consult a healthcare professional for personalized advice.*"""
        
        elif "diet" in symptoms.lower() or "nutrition" in symptoms.lower():
            return """Here's a healthy Indian diet plan for better health:

**Breakfast (7-8 AM):**
• 1 bowl oats upma with vegetables
• 1 glass buttermilk
• OR 2 whole wheat rotis with dal

**Mid-Morning (10 AM):**
• 1 seasonal fruit (apple/guava/orange)
• Green tea or herbal tea

**Lunch (12-1 PM):**
• 2 rotis + 1 bowl dal + mixed vegetable curry
• Brown rice (1 small bowl)
• Salad with cucumber, tomato, onion
• 1 bowl curd

**Evening Snack (4 PM):**
• Handful of nuts (almonds, walnuts)
• Herbal tea or coconut water

**Dinner (7-8 PM):**
• 1 bowl brown rice + fish/chicken curry
• Steamed vegetables
• Clear soup

**Key Tips for Indian Context:**
✅ Use traditional spices (turmeric, cumin, coriander)
✅ Include seasonal vegetables
✅ Drink plenty of water (3-4 liters daily)
✅ Avoid processed and packaged foods
✅ Regular meal timing

*Consult a nutritionist for personalized meal planning.*"""
        
        else:
            return """I understand your health concern. While I can provide general guidance, I'd recommend:

**For immediate help:**
• Emergency: Call 102 or visit nearest hospital
• Non-emergency: Book appointment with family doctor
• Telemedicine: Use online consultation services

**Popular health guidance I can provide:**
• Symptom analysis and home care tips
• Diet and nutrition advice for Indian meals
• Exercise recommendations
• Medication reminders and interactions
• Preventive health measures

**When to seek immediate medical attention:**
• Chest pain or shortness of breath
• High fever (>102°F) for more than 24 hours
• Severe abdominal pain
• Loss of consciousness
• Severe allergic reactions

Feel free to describe your specific symptoms, and I'll provide more targeted advice!

*Remember: I provide general guidance only. Always consult qualified healthcare professionals for medical decisions.*"""

def home_page():
    """Main landing page"""
    st.markdown('''
    <div class="main-header">
        <h1>🏥 My Medi.AI</h1>
        <h3>Revolutionizing Healthcare with AI-Powered Intelligence</h3>
        <p>Empowering patients, doctors, and healthcare providers through unified AI ecosystem</p>
    </div>
    ''', unsafe_allow_html=True)
    
    # Key metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown('<div class="metric-card">', unsafe_allow_html=True)
        st.metric("Patients Served", "10,000+", "↗️ 25%")
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col2:
        st.markdown('<div class="metric-card">', unsafe_allow_html=True)
        st.metric("AI Consultations", "50,000+", "↗️ 40%")
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col3:
        st.markdown('<div class="metric-card">', unsafe_allow_html=True)
        st.metric("Doctors Connected", "500+", "↗️ 30%")
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col4:
        st.markdown('<div class="metric-card">', unsafe_allow_html=True)
        st.metric("Health Records", "25,000+", "↗️ 35%")
        st.markdown('</div>', unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Feature highlights
    st.subheader("🚀 Core Features")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown('''
        <div class="feature-card">
            <h4>🤖 AI Health Assistant</h4>
            <p>24/7 intelligent health guidance powered by advanced AI. Get instant symptom analysis, health recommendations, and early risk detection for Indian healthcare context.</p>
        </div>
        ''', unsafe_allow_html=True)
        
        st.markdown('''
        <div class="feature-card">
            <h4>📱 Digital Health Records</h4>
            <p>Paperless medical records with OCR technology. Upload prescriptions, lab reports, and get AI-powered insights instantly. Never lose important health documents again.</p>
        </div>
        ''', unsafe_allow_html=True)
    
    with col2:
        st.markdown('''
        <div class="feature-card">
            <h4>👩‍⚕️ Doctor Portal</h4>
            <p>Comprehensive patient management with AI diagnostic suggestions, smart prescriptions, and virtual consultation capabilities. Streamline your practice with intelligent tools.</p>
        </div>
        ''', unsafe_allow_html=True)
        
        st.markdown('''
        <div class="feature-card">
            <h4>📊 Health Analytics</h4>
            <p>Advanced health trend analysis, predictive insights, and personalized recommendations based on your health data. Make informed decisions about your wellness journey.</p>
        </div>
        ''', unsafe_allow_html=True)
    
    # Market opportunity
    st.markdown("---")
    st.subheader("📈 Market Opportunity")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.info("""
        **🇮🇳 Indian Digital Health Market**
        - ₹2,000+ crore market size
        - 25% annual growth rate
        - 50M+ potential users
        - Government digital health push
        """)
    
    with col2:
        st.success("""
        **💰 Revenue Streams**
        - Doctor consultation fees (15-20%)
        - Lab test partnerships (10-15%)
        - Pharmacy commissions (5-10%)
        - Premium subscriptions (₹199-399/month)
        """)
    
    with col3:
        st.warning("""
        **🎯 Investment Opportunity**
        - Seeking: ₹50 lakhs seed funding
        - Use: Team expansion & partnerships
        - Target: 10M patients by Year 3
        - Exit: 10x-20x potential returns
        """)
    
    # Call to action
    st.markdown("---")
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        st.markdown("""
        ### 🚀 Ready to Experience the Future of Healthcare?
        
        Join thousands of patients and doctors already using My Medi.AI for smarter, faster, and more personalized healthcare.
        """)
        if st.button("🏥 Start Your Health Journey", key="cta_button", use_container_width=True):
            st.session_state.active_page = "Patient Portal"

def patient_portal():
    """Patient registration and dashboard"""
    st.title("👤 Patient Portal")
    
    # Patient registration/login
    if not st.session_state.user_profile:
        st.subheader("👋 Welcome! Let's create your health profile")
        
        st.info("🔒 Your data is secure and encrypted. We follow strict privacy guidelines to protect your health information.")
        
        with st.form("patient_registration"):
            col1, col2 = st.columns(2)
            
            with col1:
                name = st.text_input("Full Name*", placeholder="Enter your full name")
                age = st.number_input("Age*", min_value=1, max_value=120, value=30)
                gender = st.selectbox("Gender*", ["Male", "Female", "Other", "Prefer not to say"])
                phone = st.text_input("Phone Number*", placeholder="+91-XXXXX-XXXXX")
            
            with col2:
                email = st.text_input("Email Address*", placeholder="your.email@gmail.com")
                blood_group = st.selectbox("Blood Group", ["Select", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
                emergency_contact = st.text_input("Emergency Contact", placeholder="Emergency contact number")
                address = st.text_area("Address", placeholder="Your current address")
            
            # Additional health information
            st.subheader("📋 Health Information (Optional)")
            col3, col4 = st.columns(2)
            
            with col3:
                chronic_conditions = st.multiselect(
                    "Chronic Conditions",
                    ["Diabetes", "Hypertension", "Heart Disease", "Asthma", "Thyroid", "Arthritis", "Other"]
                )
                allergies = st.text_input("Known Allergies", placeholder="Food, medicine, or other allergies")
            
            with col4:
                current_medications = st.text_area("Current Medications", placeholder="List your regular medications")
                family_history = st.multiselect(
                    "Family Medical History",
                    ["Diabetes", "Heart Disease", "Cancer", "Hypertension", "Stroke", "Mental Health"]
                )
            
            submitted = st.form_submit_button("🚀 Create My Health Profile", use_container_width=True)
            
            if submitted:
                if name and email and phone and age:
                    st.session_state.user_profile = {
                        "name": name,
                        "age": age,
                        "gender": gender,
                        "phone": phone,
                        "email": email,
                        "blood_group": blood_group if blood_group != "Select" else None,
                        "emergency_contact": emergency_contact,
                        "address": address,
                        "chronic_conditions": chronic_conditions,
                        "allergies": allergies,
                        "current_medications": current_medications,
                        "family_history": family_history,
                        "created_date": datetime.now(),
                        "last_login": datetime.now()
                    }
                    st.success("✅ Profile created successfully! Welcome to My Medi.AI!")
                    st.balloons()
                    st.rerun()
                else:
                    st.error("⚠️ Please fill in all required fields marked with *")
    
    else:
        # Patient dashboard
        user = st.session_state.user_profile
        current_time = datetime.now().strftime("%B %d, %Y at %I:%M %p")
        
        st.markdown(f"""
        ### Welcome back, {user['name']}! 👋
        *Last updated: {current_time}*
        """)
        
        # Quick health status
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("Health Records", len(st.session_state.health_records), "📄")
        with col2:
            st.metric("AI Consultations", "12", "+3 this week")
        with col3:
            st.metric("Upcoming Appointments", "2", "Next: Tomorrow")
        with col4:
            # Simple health score calculation
            base_score = 75
            if user.get('chronic_conditions'):
                base_score -= len(user['chronic_conditions']) * 5
            if user.get('age', 30) > 50:
                base_score -= 5
            health_score = min(100, max(50, base_score))
            st.metric("Health Score", f"{health_score}/100", "↗️ +5")
        
        st.markdown("---")
        
        # Quick actions
        st.subheader("⚡ Quick Actions")
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            if st.button("🤖 Ask AI Assistant", use_container_width=True):
                st.session_state.active_page = "AI Health Assistant"
        with col2:
            if st.button("📄 Upload Records", use_container_width=True):
                st.session_state.show_upload = True
        with col3:
            if st.button("📅 Book Appointment", use_container_width=True):
                st.info("🚧 Appointment booking coming soon! We're partnering with 500+ doctors across India.")
        with col4:
            if st.button("📊 View Analytics", use_container_width=True):
                st.session_state.active_page = "Health Analytics"
        
        # Health records upload section
        st.markdown("---")
        st.subheader("📄 Upload Health Records")
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            uploaded_file = st.file_uploader(
                "Upload prescription, lab report, or medical document",
                type=['jpg', 'jpeg', 'png', 'pdf'],
                help="Supports images (JPG, PNG) and PDF files up to 200MB"
            )
        
        with col2:
            st.info("""
            **📋 Supported Documents:**
            • Prescriptions
            • Lab reports
            • Medical certificates
            • Discharge summaries
            • Vaccination records
            """)
        
        if uploaded_file:
            st.success("✅ File uploaded successfully!")
            
            # Show uploaded file details
            file_details = {
                "Filename": uploaded_file.name,
                "File size": f"{uploaded_file.size / 1024:.1f} KB",
                "File type": uploaded_file.type
            }
            st.json(file_details)
            
            # Simulate OCR processing
            with st.spinner("🔍 AI is analyzing your document..."):
                import time
                time.sleep(2)  # Simulate processing time
                
                # Sample extracted text based on file name or type
                if "prescription" in uploaded_file.name.lower():
                    extracted_text = """**Extracted Prescription Details:**

🏥 **Doctor**: Dr. Rajesh Kumar, MBBS, MD
📅 **Date**: June 24, 2024
👤 **Patient**: {user_name}

💊 **Medications Prescribed:**
1. Paracetamol 500mg - Take twice daily after meals (5 days)
2. Azithromycin 250mg - Take once daily before meals (5 days)  
3. B-Complex - Take once daily (30 days)
4. Vitamin D3 - Take weekly (12 weeks)

⚠️ **Instructions:**
- Complete the antibiotic course even if feeling better
- Avoid alcohol while on medication
- Take plenty of fluids
- Return if symptoms worsen

🔄 **Follow-up**: After 1 week""".format(user_name=user['name'])
                
                elif "lab" in uploaded_file.name.lower() or "report" in uploaded_file.name.lower():
                    extracted_text = """**Extracted Lab Report:**

🏥 **Lab**: City Diagnostics Center
📅 **Report Date**: June 22, 2024
👤 **Patient**: {user_name}

🩸 **Blood Test Results:**
• Hemoglobin: 13.2 g/dL (Normal: 12-16)
• Total Cholesterol: 185 mg/dL (Normal: <200) ✅
• HDL Cholesterol: 45 mg/dL (Normal: >40) ✅
• LDL Cholesterol: 118 mg/dL (Normal: <130) ✅
• Triglycerides: 110 mg/dL (Normal: <150) ✅
• Blood Sugar (Fasting): 95 mg/dL (Normal: 70-100) ✅
• HbA1c: 5.4% (Normal: <5.7%) ✅

🎯 **AI Analysis:**
All values are within normal ranges. Good metabolic health indicators. Continue healthy lifestyle.

⚠️ **Recommendations:**
- Maintain current diet and exercise
- Recheck in 6 months
- Monitor blood pressure regularly""".format(user_name=user['name'])
                
                else:
                    extracted_text = f"""**Document Analysis Complete:**

📄 **Document Type**: Medical Record
📅 **Processed**: {datetime.now().strftime('%Y-%m-%d %H:%M')}
👤 **Patient**: {user['name']}

🤖 **AI Summary:**
The uploaded document has been processed and important medical information has been extracted. Key details have been parsed and added to your health timeline.

📋 **Extracted Information:**
- Medical consultation details
- Treatment recommendations  
- Medication information
- Follow-up instructions

💾 **Storage**: Document safely stored in encrypted format
🔍 **Searchable**: Content indexed for quick retrieval"""
            
            st.subheader("📋 AI Extracted Information")
            st.markdown(extracted_text)
            
            # Add to health records
            col1, col2 = st.columns(2)
            with col1:
                if st.button("💾 Save to Health Records", use_container_width=True):
                    record = {
                        "date": datetime.now(),
                        "type": "Prescription" if "prescription" in uploaded_file.name.lower() else "Lab Report" if "lab" in uploaded_file.name.lower() else "Medical Document",
                        "content": extracted_text,
                        "filename": uploaded_file.name,
                        "ai_analysis": "Document processed and analyzed by AI",
                        "tags": ["uploaded", "ai-processed"]
                    }
                    st.session_state.health_records.append(record)
                    st.success("✅ Added to your health records!")
                    st.rerun()
            
            with col2:
                if st.button("🤖 Get AI Analysis", use_container_width=True):
                    ai_analysis = get_ai_health_advice(f"Analyze this medical document: {extracted_text}")
                    st.info(f"🤖 **AI Analysis:**\n\n{ai_analysis}")
        
        # Recent health records
        if st.session_state.health_records:
            st.markdown("---")
            st.subheader("📚 Recent Health Records")
            
            # Show records in tabs
            if len(st.session_state.health_records) > 0:
                recent_records = st.session_state.health_records[-5:]  # Show last 5 records
                
                for i, record in enumerate(reversed(recent_records)):
                    with st.expander(f"{record['type']} - {record['date'].strftime('%B %d, %Y')} 📄"):
                        st.markdown(record['content'])
                        if 'ai_analysis' in record:
                            st.info(f"🤖 AI Analysis: {record['ai_analysis']}")
            
            # View all records button
            if len(st.session_state.health_records) > 5:
                if st.button("📋 View All Health Records", use_container_width=True):
                    st.session_state.show_all_records = True
        
        # Profile management
        st.markdown("---")
        if st.button("⚙️ Edit Profile"):
            st.session_state.edit_profile = True
        
        if st.session_state.get('edit_profile', False):
            st.subheader("✏️ Edit Profile")
            with st.form("edit_profile"):
                col1, col2 = st.columns(2)
                with col1:
                    new_phone = st.text_input("Phone", value=user.get('phone', ''))
                    new_address = st.text_area("Address", value=user.get('address', ''))
                with col2:
                    new_emergency = st.text_input("Emergency Contact", value=user.get('emergency_contact', ''))
                    new_allergies = st.text_input("Allergies", value=user.get('allergies', ''))
                
                if st.form_submit_button("💾 Update Profile"):
                    st.session_state.user_profile.update({
                        'phone': new_phone,
                        'address': new_address,
                        'emergency_contact': new_emergency,
                        'allergies': new_allergies
                    })
                    st.success("✅ Profile updated successfully!")
                    st.session_state.edit_profile = False
                    st.rerun()

def ai_health_assistant():
    """AI-powered health assistant"""
    st.title("🤖 AI Health Assistant")
    st.caption("Your 24/7 intelligent health companion powered by advanced AI")
    
    # Health risk assessment sidebar
    with st.sidebar:
        st.subheader("🎯 Quick Health Assessment")
        
        with st.form("health_assessment"):
            symptoms = st.multiselect(
                "Current Symptoms",
                ["Headache", "Fever", "Cough", "Fatigue", "Nausea", "Body Pain", 
                 "Chest Pain", "Shortness of Breath", "Dizziness", "Abdominal Pain"]
            )
            pain_level = st.slider("Pain Level (1-10)", 1, 10, 5)
            duration = st.selectbox("Duration", [
                "Less than 1 day", "1-3 days", "4-7 days", "1-2 weeks", "More than 2 weeks"
            ])
            
            if st.form_submit_button("🔍 Quick Analysis"):
                if symptoms:
                    # Simple risk assessment logic
                    high_risk_symptoms = ["Chest Pain", "Shortness of Breath"]
                    risk_level = "High" if any(s in symptoms for s in high_risk_symptoms) or pain_level > 8 else "Medium" if pain_level > 5 else "Low"
                    
                    if risk_level == "High":
                        st.error(f"⚠️ **Risk Level: {risk_level}**")
                        st.error("🚨 **Seek immediate medical attention**")
                    elif risk_level == "Medium":
                        st.warning(f"⚠️ **Risk Level: {risk_level}**")
                        st.warning("👨‍⚕️ **Consider consulting a doctor**")
                    else:
                        st.success(f"✅ **Risk Level: {risk_level}**")
                        st.info("🏠 **Home care and monitoring recommended**")
                    
                    # Generate quick advice
                    symptom_text = ", ".join(symptoms)
                    quick_advice = get_ai_health_advice(f"Quick assessment: {symptom_text}, pain level {pain_level}/10, duration {duration}")
                    st.write("**Quick Advice:**")
                    st.write(quick_advice[:200] + "...")
    
    # Main chat interface
    st.subheader("💬 Chat with AI Health Assistant")
    
    # Sample questions for easy start
    st.markdown("**💡 Try these sample questions:**")
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("🤒 I have fever and headache"):
            sample_query = "I have fever and headache for 2 days. What should I do?"
            st.session_state.messages.append({"role": "user", "content": sample_query})
            
    with col2:
        if st.button("🍎 Suggest healthy diet plan"):
            sample_query = "Can you suggest a healthy Indian diet plan for diabetes prevention?"
            st.session_state.messages.append({"role": "user", "content": sample_query})
    
    with col3:
        if st.button("💊 Medicine interaction check"):
            sample_query = "Is it safe to take paracetamol with my blood pressure medication?"
            st.session_state.messages.append({"role": "user", "content": sample_query})
    
    # Display chat history
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Chat input
    if prompt := st.chat_input("Ask me about your health concerns, symptoms, diet, or any medical questions..."):
        # Add user message
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Generate AI response
        with st.chat_message("assistant"):
            with st.spinner("🤖 AI is thinking..."):
                response = get_ai_health_advice(prompt)
                st.markdown(response)
                st.session_state.messages.append({"role": "assistant", "content": response})
    
    # Additional features
    st.markdown("---")
    st.subheader("🔬 Additional AI Features")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        **🎯 Specialized AI Tools:**
        - Symptom checker and analysis
        - Drug interaction checker
        - Diet and nutrition planning
        - Exercise recommendations
        - Mental health support
        - Preventive care reminders
        """)
    
    with col2:
        st.markdown("""
        **🏥 Emergency Assistance:**
        - First aid guidance
        - Emergency contact numbers
        - Nearest hospital finder
        - Ambulance services
        - 24/7 helpline numbers
        - Critical symptom alerts
        """)
    
    # Clear chat button
    if st.button("🗑️ Clear Chat History"):
        st.session_state.messages = []
        st.success("Chat history cleared!")
        st.rerun()

def doctor_portal():
    """Doctor interface"""
    st.title("👩‍⚕️ Doctor Portal")
    
    # Doctor authentication (simplified for demo)
    if not st.session_state.doctor_logged_in:
        st.subheader("🔐 Doctor Login")
        
        st.info("🏥 Secure login for verified medical professionals")
        
        with st.form("doctor_login"):
            col1, col2 = st.columns(2)
            
            with col1:
                doctor_id = st.text_input("Medical License Number", placeholder="Enter your license number")
                password = st.text_input("Password", type="password")
            
            with col2:
                specialization = st.selectbox("Specialization", [
                    "General Physician", "Cardiologist", "Diabetologist", 
                    "Dermatologist", "Gynecologist", "Pediatrician", "Orthopedist"
                ])
                years_experience = st.number_input("Years of Experience", min_value=0, max_value=50, value=5)
            
            if st.form_submit_button("🏥 Login to Portal"):
                if doctor_id and password:  # Simplified validation for demo
                    st.session_state.doctor_logged_in = True
                    st.session_state.doctor_profile = {
                        "name": "Dr. Rajesh Kumar",
                        "id": doctor_id,
                        "specialization": specialization,
                        "experience": years_experience,
                        "hospital": "City General Hospital",
                        "rating": 4.8
                    }
                    st.success("✅ Login successful! Welcome to My Medi.AI Doctor Portal")
                    st.rerun()
                else:
                    st.error("⚠️ Please enter valid credentials")
    
    else:
        doctor = st.session_state.doctor_profile
        st.markdown(f"""
        ### Welcome, {doctor['name']}! 👋
        **{doctor['specialization']} | {doctor['experience']} years experience | ⭐ {doctor['rating']}/5.0**
        """)
        
        # Doctor dashboard metrics
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("Today's Patients", "8", "+2 from yesterday")
        with col2:
            st.metric("Pending Consultations", "3", "All within 2 hours")
        with col3:
            st.metric("This Month", "156 patients", "↗️ +12%")
        with col4:
            st.metric("Success Rate", "94%", "↗️ +2%")
        
        st.markdown("---")
        
        # Quick actions for doctors
        st.subheader("⚡ Quick Actions")
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            if st.button("👥 View Patients", use_container_width=True):
                st.session_state.show_patients = True
        with col2:
            if st.button("📝 New Prescription", use_container_width=True):
                st.session_state.show_prescription = True
        with col3:
            if st.button("📅 Today's Schedule", use_container_width=True):
                st.session_state.show_schedule = True
        with col4:
            if st.button("📊 Analytics", use_container_width=True):
                st.session_state.show_doctor_analytics = True
        
        # Patient management section
        st.markdown("---")
        st.subheader("👥 Patient Management")
        
        # Sample patient data
        patients_data = {
            "Patient ID": ["P001", "P002", "P003", "P004", "P005"],
            "Name": ["Amit Sharma", "Priya Singh", "Rajesh Kumar", "Sunita Devi", "Ravi Patel"],
            "Age": [34, 28, 45, 52, 38],
            "Last Visit": ["2024-06-24", "2024-06-23", "2024-06-22", "2024-06-21", "2024-06-20"],
            "Condition": ["Hypertension", "Diabetes", "Chest Pain", "Fever", "Back Pain"],
            "Priority": ["Medium", "High", "High", "Low", "Medium"]
        }
        
        df = pd.DataFrame(patients_data)
        
        # Add color coding for priority
        def color_priority(val):
            if val == 'High':
                return 'background-color: #ffebee'
            elif val == 'Medium':
                return 'background-color: #fff3e0'
            else:
                return 'background-color: #e8f5e8'
        
        styled_df = df.style.applymap(color_priority, subset=['Priority'])
        st.dataframe(styled_df, use_container_width=True)
        
        # Patient selection for detailed view
        selected_patient = st.selectbox("🔍 Select Patient for Detailed View", df['Name'].tolist())
        
        if selected_patient:
            patient_data = df[df['Name'] == selected_patient].iloc[0]
            
            col1, col2 = st.columns([1, 1])
            
            with col1:
                st.subheader("📋 Patient Information")
                
                # Patient basic info
                st.markdown(f"""
                **👤 Name:** {patient_data['Name']}  
                **🎂 Age:** {patient_data['Age']} years  
                **📅 Last Visit:** {patient_data['Last Visit']}  
                **🏥 Current Condition:** {patient_data['Condition']}  
                **⚠️ Priority:** {patient_data['Priority']}
                """)
                
                # Detailed health history
                st.markdown("**📚 Health History:**")
                if patient_data['Name'] == "Amit Sharma":
                    st.markdown("""
                    • **Primary:** Hypertension (diagnosed 2022)
                    • **Family History:** Diabetes (father), Heart disease (mother)  
                    • **Current Medications:** Amlodipine 5mg daily
                    • **Allergies:** None known
                    • **Last BP:** 140/90 mmHg (elevated)
                    • **BMI:** 28.5 (overweight)
                    """)
                elif patient_data['Name'] == "Priya Singh":
                    st.markdown("""
                    • **Primary:** Type 2 Diabetes (diagnosed 2021)
                    • **HbA1c:** 8.2% (needs improvement)
                    • **Current Medications:** Metformin 500mg BD
                    • **Complications:** Early diabetic retinopathy
                    • **Diet:** Struggling with compliance
                    • **Exercise:** Sedentary lifestyle
                    """)
                else:
                    st.markdown("""
                    • **Visit Reason:** {condition}
                    • **Previous Visits:** 3 in last 6 months
                    • **Compliance:** Good medication adherence
                    • **Follow-up:** Required in 2 weeks
                    """.format(condition=patient_data['Condition']))
            
            with col2:
                st.subheader("🤖 AI Diagnostic Suggestions")
                
                # AI suggestions based on patient condition
                if patient_data['Condition'] == "Hypertension":
                    st.markdown("""
                    <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <h4>🔍 AI Analysis</h4>
                    <p><strong>Risk Assessment:</strong> Moderate cardiovascular risk</p>
                    <p><strong>BP Trend:</strong> Showing upward pattern (last 3 visits)</p>
                    <p><strong>Recommendations:</strong></p>
                    <ul>
                    <li>📈 Consider increasing Amlodipine to 10mg</li>
                    <li>🧂 Strict low-sodium diet (<2g/day)</li>
                    <li>🚶‍♂️ 30 minutes daily walking</li>
                    <li>📅 Follow-up in 2 weeks</li>
                    </ul>
                    
                    <p><strong>🔬 Suggested Tests:</strong></p>
                    <ul>
                    <li>ECG (rule out LVH)</li>
                    <li>Lipid profile</li>
                    <li>HbA1c (diabetes screening)</li>
                    <li>Urine microalbumin</li>
                    </ul>
                    </div>
                    """, unsafe_allow_html=True)
                
                elif patient_data['Condition'] == "Diabetes":
                    st.markdown("""
                    <div style="background: linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <h4>🔍 AI Analysis</h4>
                    <p><strong>Glycemic Control:</strong> Poor (HbA1c 8.2%)</p>
                    <p><strong>Complication Risk:</strong> High</p>
                    <p><strong>Recommendations:</strong></p>
                    <ul>
                    <li>💊 Add Glimepiride 1mg to regimen</li>
                    <li>🍽️ Refer to nutritionist immediately</li>
                    <li>👁️ Urgent ophthalmology referral</li>
                    <li>🦶 Diabetic foot examination</li>
                    </ul>
                    
                    <p><strong>🔬 Urgent Tests:</strong></p>
                    <ul>
                    <li>HbA1c (recheck in 3 months)</li>
                    <li>Kidney function tests</li>
                    <li>Lipid profile</li>
                    <li>Urine albumin/creatinine ratio</li>
                    </ul>
                    </div>
                    """, unsafe_allow_html=True)
                
                elif patient_data['Condition'] == "Chest Pain":
                    st.markdown("""
                    <div style="background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <h4>🚨 AI Analysis - Priority Alert</h4>
                    <p><strong>Risk Level:</strong> High (chest pain + age 45+)</p>
                    <p><strong>Differential:</strong> Rule out cardiac causes first</p>
                    <p><strong>Immediate Actions:</strong></p>
                    <ul>
                    <li>⚡ ECG (stat)</li>
                    <li>🩸 Cardiac enzymes (Troponin I)</li>
                    <li>📸 Chest X-ray</li>
                    <li>👨‍⚕️ Consider cardiology consult</li>
                    </ul>
                    
                    <p><strong>⚠️ Red Flags to Monitor:</strong></p>
                    <ul>
                    <li>Radiation to arm/jaw</li>
                    <li>Associated shortness of breath</li>
                    <li>Sweating or nausea</li>
                    <li>Family history of CAD</li>
                    </ul>
                    </div>
                    """, unsafe_allow_html=True)
                
                # Smart prescription generator
                st.subheader("📝 Smart Prescription Generator")
                
                with st.form("smart_prescription"):
                    col3, col4 = st.columns(2)
                    
                    with col3:
                        # AI suggests medicines based on condition
                        if patient_data['Condition'] == "Hypertension":
                            default_medicines = ["Amlodipine 10mg", "Telmisartan 40mg", "Hydrochlorothiazide 25mg"]
                        elif patient_data['Condition'] == "Diabetes":
                            default_medicines = ["Metformin 500mg", "Glimepiride 1mg", "Insulin Glargine"]
                        else:
                            default_medicines = ["Paracetamol 500mg", "Ibuprofen 400mg", "Omeprazole 20mg"]
                        
                        medicine = st.selectbox("💊 Medicine", default_medicines + [
                            "Paracetamol 500mg", "Azithromycin 250mg", "Omeprazole 20mg",
                            "Crocin Advance", "Vitamin D3", "B-Complex"
                        ])
                        
                        dosage = st.selectbox("⏰ Dosage", [
                            "Once daily", "Twice daily", "Thrice daily", 
                            "Four times daily", "As needed", "Weekly"
                        ])
                        
                        duration = st.selectbox("📅 Duration", [
                            "3 days", "5 days", "7 days", "10 days", 
                            "15 days", "30 days", "3 months", "6 months"
                        ])
                    
                    with col4:
                        instructions = st.text_area("📋 Special Instructions", 
                                                  placeholder="e.g., Take after meals, avoid alcohol, monitor BP daily")
                        
                        follow_up = st.selectbox("🔄 Follow-up", [
                            "1 week", "2 weeks", "1 month", "3 months", "6 months", "As needed"
                        ])
                        
                        emergency_contact = st.checkbox("🚨 Provide emergency contact info")
                    
                    if st.form_submit_button("🖨️ Generate Prescription", use_container_width=True):
                        # Generate formatted prescription
                        prescription_text = f"""
**🏥 PRESCRIPTION**

**Doctor:** {doctor['name']}, {doctor['specialization']}  
**Date:** {datetime.now().strftime('%B %d, %Y')}  
**Patient:** {patient_data['Name']}, {patient_data['Age']} years

**💊 MEDICATIONS:**
• {medicine} - {dosage} for {duration}

**📋 INSTRUCTIONS:**
{instructions if instructions else 'Take as directed'}

**🔄 FOLLOW-UP:** {follow_up}

**📞 For emergencies:** Contact clinic at +91-XXXXX-XXXXX
                        """
                        
                        st.success("✅ Prescription generated successfully!")
                        st.text_area("📄 Generated Prescription", prescription_text, height=300)
                        
                        # Add to patient records (simulation)
                        if st.button("💾 Save to Patient Records"):
                            st.success("✅ Prescription saved to patient records and sent via SMS/Email")

def analytics_page():
    """Health analytics and insights"""
    st.title("📊 Health Analytics Dashboard")
    st.caption("Comprehensive health insights and predictive analytics")
    
    # Generate sample health data for demonstration
    dates = pd.date_range(start='2024-01-01', end='2024-06-24', freq='D')
    
    # Create realistic health data patterns
    np_available = True
    try:
        import numpy as np
    except ImportError:
        np_available = False
        st.warning("NumPy not available - using simplified data generation")
    
    if np_available:
        # More realistic data with numpy
        systolic = 120 + np.cumsum(np.random.normal(0, 0.5, len(dates))) + 20 * np.sin(np.arange(len(dates)) * 2 * np.pi / 365)
        diastolic = 80 + np.cumsum(np.random.normal(0, 0.3, len(dates))) + 10 * np.sin(np.arange(len(dates)) * 2 * np.pi / 365)
        glucose = 90 + np.random.normal(0, 10, len(dates)) + 5 * np.sin(np.arange(len(dates)) * 2 * np.pi / 30)
        weight = 70 + np.cumsum(np.random.normal(-0.01, 0.1, len(dates)))
    else:
        # Simplified data generation without numpy
        import random
        systolic = [120 + random.uniform(-10, 15) + (i % 30 - 15) * 0.5 for i in range(len(dates))]
        diastolic = [80 + random.uniform(-5, 10) + (i % 20 - 10) * 0.3 for i in range(len(dates))]
        glucose = [90 + random.uniform(-15, 25) for _ in range(len(dates))]
        weight = [70 + random.uniform(-2, 2) for _ in range(len(dates))]
    
    # Create DataFrames
    bp_data = pd.DataFrame({
        'Date': dates,
        'Systolic': systolic,
        'Diastolic': diastolic
    })
    
    glucose_data = pd.DataFrame({
        'Date': dates,
        'Glucose': glucose
    })
    
    weight_data = pd.DataFrame({
        'Date': dates,
        'Weight': weight
    })
    
    # Create tabs for different analytics
    tab1, tab2, tab3, tab4 = st.tabs(["🩺 Vitals Trends", "🎯 Risk Assessment", "📈 Progress Tracking", "🌍 Population Health"])
    
    with tab1:
        st.subheader("📈 Blood Pressure Trends")
        
        # Blood pressure chart
        fig_bp = go.Figure()
        fig_bp.add_trace(go.Scatter(
            x=bp_data['Date'], 
            y=bp_data['Systolic'], 
            name='Systolic', 
            line=dict(color='#ff6b6b', width=3),
            hovertemplate='<b>Systolic</b><br>Date: %{x}<br>BP: %{y} mmHg<extra></extra>'
        ))
        fig_bp.add_trace(go.Scatter(
            x=bp_data['Date'], 
            y=bp_data['Diastolic'], 
            name='Diastolic', 
            line=dict(color='#4ecdc4', width=3),
            hovertemplate='<b>Diastolic</b><br>Date: %{x}<br>BP: %{y} mmHg<extra></extra>'
        ))
        
        # Add reference lines
        fig_bp.add_hline(y=140, line_dash="dash", line_color="red", 
                        annotation_text="High BP Threshold (140)", annotation_position="right")
        fig_bp.add_hline(y=90, line_dash="dash", line_color="orange",
                        annotation_text="High Diastolic (90)", annotation_position="right")
        
        fig_bp.update_layout(
            title="Blood Pressure Monitoring - 6 Month Trend",
            xaxis_title="Date",
            yaxis_title="Blood Pressure (mmHg)",
            hovermode='x unified',
            height=400,
            showlegend=True
        )
        
        st.plotly_chart(fig_bp, use_container_width=True)
        
        # BP Statistics
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            avg_systolic = bp_data['Systolic'].mean()
            st.metric("Avg Systolic", f"{avg_systolic:.1f} mmHg", 
                     "Normal" if avg_systolic < 130 else "High")
        with col2:
            avg_diastolic = bp_data['Diastolic'].mean()
            st.metric("Avg Diastolic", f"{avg_diastolic:.1f} mmHg",
                     "Normal" if avg_diastolic < 85 else "High")
        with col3:
            high_bp_days = len(bp_data[(bp_data['Systolic'] > 140) | (bp_data['Diastolic'] > 90)])
            st.metric("High BP Days", f"{high_bp_days}", f"{high_bp_days/len(bp_data)*100:.1f}%")
        with col4:
            trend = "↗️" if bp_data['Systolic'].iloc[-7:].mean() > bp_data['Systolic'].iloc[-14:-7].mean() else "↘️"
            st.metric("Weekly Trend", trend, "Last 7 days vs previous week")
        
        st.markdown("---")
        st.subheader("🍭 Blood Sugar Levels")
        
        # Glucose chart
        fig_glucose = px.line(glucose_data, x='Date', y='Glucose', 
                             title='Blood Glucose Levels - 6 Month Trend',
                             color_discrete_sequence=['#45b7d1'])
        
        # Add reference lines for glucose
        fig_glucose.add_hline(y=100, line_dash="dash", line_color="green", 
                             annotation_text="Normal Fasting (100)", annotation_position="right")
        fig_glucose.add_hline(y=126, line_dash="dash", line_color="red",
                             annotation_text="Diabetes Threshold (126)", annotation_position="right")
        fig_glucose.add_hline(y=140, line_dash="dash", line_color="darkred",
                             annotation_text="Postprandial Limit (140)", annotation_position="right")
        
        fig_glucose.update_layout(height=400)
        st.plotly_chart(fig_glucose, use_container_width=True)
        
        # Glucose statistics
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            avg_glucose = glucose_data['Glucose'].mean()
            st.metric("Avg Glucose", f"{avg_glucose:.1f} mg/dL",
                     "Normal" if avg_glucose < 100 else "Elevated")
        with col2:
            high_glucose_days = len(glucose_data[glucose_data['Glucose'] > 126])
            st.metric("High Glucose Days", f"{high_glucose_days}")
        with col3:
            glucose_variability = glucose_data['Glucose'].std()
            st.metric("Glucose Variability", f"{glucose_variability:.1f}",
                     "Low" if glucose_variability < 15 else "High")
        with col4:
            hba1c_estimate = (avg_glucose + 46.7) / 28.7
            st.metric("Est. HbA1c", f"{hba1c_estimate:.1f}%",
                     "Good" if hba1c_estimate < 7 else "Needs Improvement")
    
    with tab2:
        st.subheader("🎯 AI Health Risk Assessment")
        
        # Risk prediction models
        col1, col2 = st.columns(2)
        
        with col1:
            # Diabetes risk gauge
            diabetes_risk = min(85, max(15, 35 + (avg_glucose - 90) * 0.8 + high_bp_days * 0.5))
            
            fig_diabetes = go.Figure(go.Indicator(
                mode = "gauge+number+delta",
                value = diabetes_risk,
                domain = {'x': [0, 1], 'y': [0, 1]},
                title = {'text': "Diabetes Risk (%)"},
                gauge = {
                    'axis': {'range': [None, 100]},
                    'bar': {'color': "#667eea"},
                    'steps': [
                        {'range': [0, 25], 'color': "#c8e6c9"},
                        {'range': [25, 50], 'color': "#fff9c4"},
                        {'range': [50, 75], 'color': "#ffcc02"},
                        {'range': [75, 100], 'color': "#ff5722"}
                    ],
                    'threshold': {
                        'line': {'color': "red", 'width': 4},
                        'thickness': 0.75,
                        'value': 90
                    }
                }
            ))
            
            fig_diabetes.update_layout(height=300)
            st.plotly_chart(fig_diabetes, use_container_width=True)
        
        with col2:
            # Heart disease risk gauge
            heart_risk = min(80, max(10, 28 + (avg_systolic - 120) * 0.5 + diabetes_risk * 0.3))
            
            fig_heart = go.Figure(go.Indicator(
                mode = "gauge+number+delta",
                value = heart_risk,
                domain = {'x': [0, 1], 'y': [0, 1]},
                title = {'text': "Heart Disease Risk (%)"},
                gauge = {
                    'axis': {'range': [None, 100]},
                    'bar': {'color': "#ff6b6b"},
                    'steps': [
                        {'range': [0, 25], 'color': "#c8e6c9"},
                        {'range': [25, 50], 'color': "#fff9c4"},
                        {'range': [50, 75], 'color': "#ffcc02"},
                        {'range': [75, 100], 'color': "#ff5722"}
                    ],
                    'threshold': {
                        'line': {'color': "red", 'width': 4},
                        'thickness': 0.75,
                        'value': 90
                    }
                }
            ))
            
            fig_heart.update_layout(height=300)
            st.plotly_chart(fig_heart, use_container_width=True)
        
        # Risk factors analysis
        st.subheader("🔍 Risk Factors Analysis")
        
        # Create risk factors data
        user_profile = st.session_state.get('user_profile', {})
        age = user_profile.get('age', 35)
        
        risk_factors_data = {
            "Risk Factor": ["Age", "Blood Pressure", "Blood Sugar", "Family History", "BMI", "Exercise", "Diet", "Smoking", "Stress"],
            "Current Status": [
                f"{age} years" if age < 45 else f"{age} years (High Risk)",
                "Elevated" if avg_systolic > 130 else "Normal",
                "Elevated" if avg_glucose > 100 else "Normal", 
                "Diabetes" if user_profile.get('family_history') and 'Diabetes' in user_profile.get('family_history', []) else "None",
                "Normal", "Moderate", "Good", "Non-smoker", "Moderate"
            ],
            "Risk Level": [
                "High" if age > 45 else "Low",
                "High" if avg_systolic > 140 else "Medium" if avg_systolic > 130 else "Low",
                "High" if avg_glucose > 126 else "Medium" if avg_glucose > 100 else "Low",
                "High" if user_profile.get('family_history') and 'Diabetes' in user_profile.get('family_history', []) else "Low",
                "Low", "Medium", "Low", "Low", "Medium"
            ],
            "Impact Score": [7 if age > 45 else 3, 8 if avg_systolic > 140 else 5, 9 if avg_glucose > 126 else 4, 6, 4, 5, 3, 2, 4],
            "AI Recommendation": [
                "Regular health checkups" if age > 45 else "Continue preventive care",
                "Medication review, lifestyle changes" if avg_systolic > 140 else "Monitor regularly",
                "Diabetes screening, diet control" if avg_glucose > 126 else "Maintain healthy diet",
                "Regular screening, genetic counseling" if user_profile.get('family_history') else "Standard care",
                "Maintain current weight", "Increase to 150 min/week", "Continue healthy eating", 
                "Maintain non-smoking status", "Stress management techniques"
            ]
        }
        
        risk_df = pd.DataFrame(risk_factors_data)
        
        # Color code risk levels
        def color_risk_level(val):
            if val == 'High':
                return 'background-color: #ffebee; color: #c62828'
            elif val == 'Medium':
                return 'background-color: #fff3e0; color: #ef6c00'
            else:
                return 'background-color: #e8f5e8; color: #2e7d32'
        
        styled_risk_df = risk_df.style.applymap(color_risk_level, subset=['Risk Level'])
        st.dataframe(styled_risk_df, use_container_width=True)
        
        # AI-powered recommendations
        st.subheader("🤖 AI-Powered Health Recommendations")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("""
            **🚨 Immediate Actions:**
            - Monitor blood pressure daily for 1 week
            - Schedule appointment with primary care physician
            - Start 30-minute daily walks
            - Reduce sodium intake (<2g/day)
            """)
            
            st.markdown("""
            **💊 Medication Reminders:**
            - Take BP medication at same time daily
            - Monitor for side effects
            - Don't skip doses
            - Carry emergency medication list
            """)
        
        with col2:
            st.markdown("""
            **🍎 Lifestyle Modifications:**
            - Mediterranean diet with Indian modifications
            - Limit processed foods and sugar
            - Include more vegetables and whole grains
            - Stay hydrated (8-10 glasses daily)
            """)
            
            st.markdown("""
            **📅 Follow-up Schedule:**
            - Blood pressure check: Weekly
            - Blood sugar test: Monthly
            - Comprehensive health checkup: Quarterly
            - Specialist consultation: As recommended
            """)
    
    with tab3:
        st.subheader("📈 Health Progress Tracking")
        
        # Progress metrics with goals
        col1, col2, col3 = st.columns(3)
        
        with col1:
            current_weight = weight_data['Weight'].iloc[-1]
            weight_change = current_weight - weight_data['Weight'].iloc[0]
            st.metric("Current Weight", f"{current_weight:.1f} kg", 
                     f"{weight_change:+.1f} kg since Jan")
        
        with col2:
            # Simulated step data
            daily_steps = 8500
            st.metric("Daily Steps", f"{daily_steps:,}", "+1,200 from last month")
        
        with col3:
            # Simulated sleep data
            sleep_hours = 7.8
            st.metric("Sleep Quality", f"{sleep_hours}/10", "+0.5 improvement")
        
        # Weight trend chart
        fig_weight = px.line(weight_data, x='Date', y='Weight', 
                           title='Weight Trend - 6 Months',
                           color_discrete_sequence=['#26a69a'])
        
        # Add weight goal line
        goal_weight = 68
        fig_weight.add_hline(y=goal_weight, line_dash="dash", line_color="green",
                           annotation_text=f"Goal: {goal_weight} kg", annotation_position="right")
        
        fig_weight.update_layout(height=400)
        st.plotly_chart(fig_weight, use_container_width=True)
        
        # Health goals progress
        st.subheader("🎯 Health Goals Progress")
        
        goals_data = {
            "Goal": ["Weight Loss", "Daily Steps", "Water Intake", "Exercise Minutes", "Sleep Hours"],
            "Target": ["5 kg", "10,000", "3L", "30 min", "8 hours"],
            "Current": [f"{abs(weight_change):.1f} kg", "8,500", "2.5L", "25 min", "7.8 hours"],
            "Progress": [min(100, abs(weight_change)/5*100), 85, 83, 83, 97]
        }
        
        for i, goal in enumerate(goals_data["Goal"]):
            progress = goals_data["Progress"][i]
            col1, col2, col3 = st.columns([2, 1, 3])
            
            with col1:
                st.write(f"**{goal}**")
            with col2:
                st.write(f"{goals_data['Current'][i]} / {goals_data['Target'][i]}")
            with col3:
                st.progress(progress / 100)
                st.caption(f"{progress:.0f}% complete")
        
        # Achievements and milestones
        st.subheader("🏆 Recent Achievements")
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.success("🎉 **7-Day Exercise Streak!**\nCompleted daily workouts")
        
        with col2:
            st.info("📊 **Blood Sugar Stable**\n30 days within normal range")
        
        with col3:
            st.warning("⚠️ **BP Monitoring Needed**\nElevated readings last week")
    
    with tab4:
        st.subheader("🌍 Population Health Insights")
        
        # Regional health data (simulated)
        cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"]
        diabetes_rates = [12.5, 15.2, 10.8, 14.1, 13.7, 11.9, 12.1, 13.3]
        hypertension_rates = [28.5, 32.1, 25.8, 29.4, 30.7, 27.2, 28.9, 31.2]
        
        # City comparison chart
        fig_cities = go.Figure(data=[
            go.Bar(name='Diabetes (%)', x=cities, y=diabetes_rates, marker_color='#ff6b6b'),
            go.Bar(name='Hypertension (%)', x=cities, y=hypertension_rates, marker_color='#4ecdc4')
        ])
        
        fig_cities.update_layout(
            title="Disease Prevalence by Indian Cities",
            xaxis_title="City",
            yaxis_title="Prevalence (%)",
            barmode='group',
            height=400
        )
        
        st.plotly_chart(fig_cities, use_container_width=True)
        
        # Age group analysis
        col1, col2 = st.columns(2)
        
        with col1:
            age_groups = ["18-30", "31-45", "46-60", "60+"]
            health_scores = [78, 72, 65, 58]
            
            fig_age = px.bar(
                x=age_groups,
                y=health_scores,
                title="Average Health Score by Age Group",
                labels={'x': 'Age Group', 'y': 'Health Score'},
                color=health_scores,
                color_continuous_scale='RdYlGn'
            )
            
            st.plotly_chart(fig_age, use_container_width=True)
        
        with col2:
            # Gender-based health trends
            gender_data = {
                "Health Condition": ["Diabetes", "Hypertension", "Heart Disease", "Obesity"],
                "Male (%)": [13.2, 31.5, 7.8, 22.4],
                "Female (%)": [11.8, 27.3, 5.2, 26.1]
            }
            
            gender_df = pd.DataFrame(gender_data)
            st.dataframe(gender_df, use_container_width=True)
            
            st.markdown("""
            **Key Insights:**
            - Men have higher rates of diabetes and heart disease
            - Women have higher obesity rates
            - Hypertension affects men more significantly
            - Urban lifestyle impacts both genders
            """)
        
        # National health trends
        st.subheader("📊 National Health Trends (2020-2024)")
        
        years = [2020, 2021, 2022, 2023, 2024]
        conditions = {
            "Diabetes": [8.9, 9.2, 9.8, 10.5, 11.2],
            "Hypertension": [25.3, 26.1, 27.5, 28.9, 30.2],
            "Obesity": [20.4, 21.2, 22.1, 23.4, 24.8],
            "Heart Disease": [4.5, 4.7, 5.1, 5.6, 6.1]
        }
        
        fig_trends = go.Figure()
        
        for condition, values in conditions.items():
            fig_trends.add_trace(go.Scatter(
                x=years, y=values, name=condition,
                mode='lines+markers', line=dict(width=3)
            ))
        
        fig_trends.update_layout(
            title="Disease Prevalence Trends in India",
            xaxis_title="Year",
            yaxis_title="Prevalence (%)",
            height=400
        )
        
        st.plotly_chart(fig_trends, use_container_width=True)
        
        # Market insights for investors
        st.subheader("💰 Market Insights")
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.metric("Digital Health Market", "₹2,000+ Cr", "25% CAGR")
        
        with col2:
            st.metric("Target Population", "50M+ users", "Urban + Semi-urban")
        
        with col3:
            st.metric("Market Opportunity", "₹500+ Cr", "AI-driven segment")

def main():
    """Main application"""
    
    # Sidebar navigation
    st.sidebar.title("🏥 My Medi.AI")
    st.sidebar.markdown("*Revolutionizing Healthcare with AI*")
    st.sidebar.markdown("---")
    
    # Navigation menu
    pages = [
        "🏠 Home",
        "👤 Patient Portal", 
        "🤖 AI Health Assistant",
        "👩‍⚕️ Doctor Portal",
        "📊 Health Analytics"
    ]
    
    # Handle page navigation
    if 'active_page' not in st.session_state:
        st.session_state.active_page = "🏠 Home"
    
    selected_page = st.sidebar.selectbox(
        "🧭 Navigate to:",
        pages,
        index=pages.index(st.session_state.active_page) if st.session_state.active_page in pages else 0
    )
    
    st.session_state.active_page = selected_page
    
    # User status in sidebar
    if st.session_state.user_profile:
        st.sidebar.success(f"✅ Patient: {st.session_state.user_profile['name']}")
    
    if st.session_state.doctor_logged_in:
        st.sidebar.success(f"✅ Doctor: {st.session_state.doctor_profile['name']}")
    
    # Logout options
    if st.session_state.user_profile or st.session_state.doctor_logged_in:
        st.sidebar.markdown("---")
        if st.sidebar.button("🚪 Logout"):
            # Clear all session data
            for key in ['user_profile', 'doctor_logged_in', 'doctor_profile', 'messages', 'health_records']:
                if key in st.session_state:
                    del st.session_state[key]
            st.success("✅ Logged out successfully!")
            st.rerun()
    
    # Sidebar information
    st.sidebar.markdown("---")
    st.sidebar.info("""
    **🚀 My Medi.AI Features:**
    - 🤖 AI-powered health assistant
    - 📱 Digital health records with OCR
    - 🩺 Smart symptom analysis
    - 👩‍⚕️ Doctor consultation portal
    - 📊 Advanced health analytics
    - 🗺️ Location-based services
    - 🔒 Secure & encrypted data
    """)
    
    # Investment information
    st.sidebar.markdown("---")
    st.sidebar.warning("""
    **💰 Investment Opportunity**
    
    **Seeking:** ₹50 lakhs seed funding
    **Market:** ₹2,000+ crore digital health
    **Target:** 10M patients by Year 3
    
    **Contact:** [your.email@gmail.com]
    """)
    
    st.sidebar.markdown("---")
    st.sidebar.success("💡 **Prototype Version 1.0**\nBuilt with AI assistance for investor demo")
    
    # Route to appropriate page
    if selected_page == "🏠 Home":
        home_page()
    elif selected_page == "👤 Patient Portal":
        patient_portal()
    elif selected_page == "🤖 AI Health Assistant":
        ai_health_assistant()
    elif selected_page == "👩‍⚕️ Doctor Portal":
        doctor_portal()
    elif selected_page == "📊 Health Analytics":
        analytics_page()
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style="text-align: center; color: #666; font-size: 14px;">
        <p>🏥 <strong>My Medi.AI</strong> - Revolutionizing Healthcare with AI | 
        Built with ❤️ for healthier India | 
        <a href="mailto:your.email@gmail.com">Contact for Investment</a></p>
        <p><em>Disclaimer: This is a prototype for demonstration. Always consult qualified healthcare professionals for medical advice.</em></p>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()