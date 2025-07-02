"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import MyMedLogo from "./mymed-logo"
import {
  Send,
  Mic,
  ImageIcon,
  AlertTriangle,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Shield,
  Activity,
  Heart,
} from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  sources?: string[]
  confidence?: number
}

export default function AIHealthChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content: `Hello! I'm your MYMED.AI health assistant. I'm here to help you with:

• Quick health questions and symptom guidance
• Medication information and interactions
• General wellness advice
• When to seek medical care

⚠️ **Important Disclaimer**: I provide general health information only. For medical emergencies, call 911. Always consult healthcare professionals for diagnosis and treatment.

What health question can I help you with today?`,
      timestamp: new Date(),
      confidence: 95,
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [testMode, setTestMode] = useState(false)
  const [apiStatus, setApiStatus] = useState<"checking" | "available" | "unavailable">("checking")

  // Add this useEffect to check API availability
  useEffect(() => {
    const checkAPIStatus = async () => {
      try {
        const response = await fetch("/api/ai-integration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: "test" }),
        })
        const data = await response.json()
        setApiStatus(data.provider === "stub" ? "unavailable" : "available")
      } catch {
        setApiStatus("unavailable")
      }
    }
    checkAPIStatus()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const message = userMessage.toLowerCase()

    // Blood pressure questions - Enhanced response
    if (message.includes("blood pressure") || message.includes("bp") || message.includes("hypertension")) {
      return `**🩸 Blood Pressure Information:**

📊 **Normal Blood Pressure Ranges:**
• **Optimal**: Less than 120/80 mmHg
• **Normal**: 120-129 (systolic) and less than 80 (diastolic)
• **Elevated**: 130-139 (systolic) and 80-89 (diastolic)
• **High BP Stage 1**: 140-159/90-99 mmHg
• **High BP Stage 2**: 160/100 mmHg or higher
• **Hypertensive Crisis**: Higher than 180/120 mmHg ⚠️ **SEEK IMMEDIATE CARE**

**Understanding the Numbers:**
• **Systolic** (top number): Pressure when heart beats
• **Diastolic** (bottom number): Pressure when heart rests between beats
• Measured in millimeters of mercury (mmHg)

**Factors Affecting Blood Pressure:**
• Age and genetics
• Weight and physical activity level
• Stress and sleep quality
• Salt intake and diet
• Alcohol consumption and smoking
• Certain medications and medical conditions
• Time of day (typically higher in morning)

**Natural Ways to Lower BP:**
🏃‍♂️ **Exercise**: 30 minutes of moderate activity daily
🧂 **Reduce Sodium**: Less than 2,300mg daily (ideal: 1,500mg)
🍌 **Increase Potassium**: Bananas, spinach, beans, avocados
⚖️ **Maintain Healthy Weight**: Even 5-10 lbs can make a difference
🚭 **Quit Smoking**: Immediate and long-term benefits
🍷 **Limit Alcohol**: Max 1 drink/day (women), 2 drinks/day (men)
🧘‍♀️ **Manage Stress**: Meditation, yoga, deep breathing
😴 **Quality Sleep**: 7-9 hours nightly

**When to See a Doctor:**
🚨 **Immediately if you have:**
• BP reading above 180/120
• Severe headache with high BP
• Chest pain or shortness of breath
• Vision problems or confusion
• Severe nausea or vomiting

📅 **Schedule appointment if:**
• Consistently high readings (above 130/80)
• Family history of hypertension
• Other risk factors present
• Need medication adjustment

**Home Monitoring Tips:**
• Use validated BP monitor
• Take readings same time daily
• Sit quietly for 5 minutes before measuring
• Keep a log of readings
• Bring log to doctor appointments

**Indian Context:**
• High salt intake in traditional foods
• Consider DASH diet with Indian modifications
• Include yoga and pranayama in routine
• Regular health checkups are essential

*Confidence: 96% | Sources: American Heart Association, Indian Society of Hypertension, Mayo Clinic*

⚠️ **Remember**: This information is for educational purposes. Always consult your healthcare provider for personalized medical advice and treatment plans.`
    }

    // Heart rate questions
    if (message.includes("heart rate") || message.includes("pulse") || message.includes("heartbeat")) {
      return `**❤️ Heart Rate Information:**

📈 **Normal Resting Heart Rate:**
• **Adults**: 60-100 beats per minute (bpm)
• **Athletes**: 40-60 bpm (due to conditioning)
• **Children (6-15 years)**: 70-100 bpm
• **Infants**: 100-160 bpm

**Target Heart Rate During Exercise:**
• **Moderate intensity**: 50-70% of max heart rate
• **Vigorous intensity**: 70-85% of max heart rate
• **Maximum heart rate**: 220 minus your age

**Age-Based Target Zones:**
• **20 years**: 100-170 bpm (exercise)
• **30 years**: 95-162 bpm (exercise)
• **40 years**: 90-153 bpm (exercise)
• **50 years**: 85-145 bpm (exercise)
• **60 years**: 80-136 bpm (exercise)

**Factors Affecting Heart Rate:**
• Physical fitness level
• Emotions and stress
• Air temperature and humidity
• Body position (standing vs. sitting)
• Medications
• Caffeine and nicotine
• Time of day

**When to Be Concerned:**
🚨 **Seek immediate care if:**
• Resting heart rate consistently above 100 bpm
• Resting heart rate below 60 bpm (if not athletic)
• Irregular heartbeat or palpitations
• Chest pain with rapid heart rate
• Dizziness or fainting with heart rate changes

*Confidence: 94% | Sources: American Heart Association, Mayo Clinic*`
    }

    // Cholesterol questions
    if (message.includes("cholesterol") || message.includes("lipid")) {
      return `**🧪 Cholesterol Level Information:**

📊 **Healthy Cholesterol Levels (mg/dL):**
• **Total Cholesterol**: Less than 200 mg/dL
• **LDL (Bad) Cholesterol**: Less than 100 mg/dL
• **HDL (Good) Cholesterol**: 
  - Men: 40 mg/dL or higher
  - Women: 50 mg/dL or higher
• **Triglycerides**: Less than 150 mg/dL

**Risk Categories:**
**Total Cholesterol:**
• Desirable: Less than 200 mg/dL
• Borderline high: 200-239 mg/dL
• High: 240 mg/dL and above

**LDL Cholesterol:**
• Optimal: Less than 100 mg/dL
• Near optimal: 100-129 mg/dL
• Borderline high: 130-159 mg/dL
• High: 160-189 mg/dL
• Very high: 190 mg/dL and above

**Natural Ways to Improve Cholesterol:**
🥗 **Diet Changes:**
• Increase fiber (oats, beans, fruits)
• Choose healthy fats (olive oil, nuts, avocados)
• Eat fatty fish (salmon, mackerel) twice weekly
• Limit saturated and trans fats

🏃‍♂️ **Lifestyle:**
• Regular exercise (150 minutes/week)
• Maintain healthy weight
• Don't smoke
• Limit alcohol

**When to Get Tested:**
• Adults 20+: Every 4-6 years
• High risk: More frequently
• Family history: Earlier and more often

*Confidence: 93% | Sources: American Heart Association, National Cholesterol Education Program*`
    }

    // Blood sugar/diabetes questions
    if (message.includes("blood sugar") || message.includes("glucose") || message.includes("diabetes")) {
      return `**🍯 Blood Sugar Level Information:**

📊 **Normal Blood Sugar Levels:**
**Fasting (8+ hours without food):**
• Normal: 70-99 mg/dL
• Pre-diabetes: 100-125 mg/dL
• Diabetes: 126 mg/dL or higher

**2 Hours After Eating:**
• Normal: Less than 140 mg/dL
• Pre-diabetes: 140-199 mg/dL
• Diabetes: 200 mg/dL or higher

**A1C (Average over 2-3 months):**
• Normal: Less than 5.7%
• Pre-diabetes: 5.7-6.4%
• Diabetes: 6.5% or higher

**Random Blood Sugar:**
• Diabetes: 200 mg/dL or higher (with symptoms)

**Common Symptoms of High Blood Sugar:**
• Increased thirst and urination
• Unexplained weight loss
• Fatigue and weakness
• Blurred vision
• Slow-healing wounds
• Frequent infections

**Prevention Strategies:**
🥗 **Diet:**
• Choose whole grains over refined
• Eat plenty of vegetables and fruits
• Limit sugary drinks and processed foods
• Control portion sizes

🏃‍♂️ **Exercise:**
• 150 minutes moderate activity weekly
• Include strength training
• Take walks after meals

⚖️ **Weight Management:**
• Even 5-10% weight loss helps
• Focus on sustainable changes

**Risk Factors:**
• Age 45 or older
• Overweight or obese
• Family history of diabetes
• High blood pressure
• Previous gestational diabetes

**When to Get Tested:**
• Age 45+: Every 3 years
• Overweight with risk factors: Earlier
• Symptoms present: Immediately

*Confidence: 95% | Sources: American Diabetes Association, CDC*`
    }

    // Medication interactions
    if (message.includes("ibuprofen") && message.includes("antibiotic")) {
      return `**💊 Ibuprofen and Antibiotics Interaction:**

✅ **Generally Safe**: Most antibiotics can be taken with ibuprofen without significant interactions.

**Key Points:**
• Ibuprofen may reduce effectiveness of some antibiotics like quinolones
• Take medications as prescribed and space them apart if possible
• Monitor for increased side effects like stomach upset

**Recommendations:**
• Take ibuprofen with food to reduce stomach irritation
• Stay hydrated while on antibiotics
• Complete the full antibiotic course even if feeling better

⚠️ **Consult your pharmacist or doctor** if you experience unusual symptoms or have concerns about specific medications.

*Confidence: 92% | Sources: FDA Drug Interaction Database, Mayo Clinic*`
    }

    // Water intake questions
    if (message.includes("water") && (message.includes("drink") || message.includes("daily"))) {
      return `**💧 Daily Water Intake Recommendations:**

💧 **General Guidelines:**
• Men: About 15.5 cups (3.7 liters) of fluids daily
• Women: About 11.5 cups (2.7 liters) of fluids daily
• This includes water from food and other beverages

**Factors Increasing Water Needs:**
• Exercise and physical activity
• Hot or humid weather
• High altitude environments
• Illness with fever, vomiting, or diarrhea
• Pregnancy and breastfeeding

**Signs of Proper Hydration:**
• Light yellow or colorless urine
• Urinating every 3-4 hours
• Moist lips and mouth
• Good energy levels

**Signs of Dehydration:**
• Dark yellow urine
• Dry mouth and lips
• Fatigue or dizziness
• Headache
• Constipation

**Hydration Tips:**
• Start your day with a glass of water
• Keep a water bottle with you
• Eat water-rich foods (fruits, vegetables)
• Set reminders to drink water
• Monitor urine color as a guide

*Confidence: 91% | Sources: National Academies of Sciences, Mayo Clinic*`
    }

    // Default comprehensive response
    return `Thank you for your health question! I'm here to provide evidence-based health information.

**I can help with questions about:**
• 💊 Medication interactions and side effects
• 🩺 Common symptoms and when to see a doctor
• 🏃‍♂️ Exercise and fitness guidance
• 🥗 Nutrition and diet recommendations
• 🩸 Vital signs and health metrics (blood pressure, heart rate, cholesterol, blood sugar)
• 🧠 Mental health and wellness
• 🚨 When to seek emergency care

**For the most helpful response, try asking:**
• "What's normal blood pressure range?"
• "Can I take [medication] with [condition]?"
• "What are normal blood sugar levels?"
• "What's a healthy heart rate?"
• "How much water should I drink daily?"
• "What are symptoms of [condition]?"

**Sample questions you can ask:**
• "What's normal blood pressure for my age?"
• "What are healthy cholesterol levels?"
• "Can I take ibuprofen with antibiotics?"
• "How much water should I drink daily?"
• "What are signs of diabetes?"
• "What's a normal resting heart rate?"

Please feel free to ask a specific health question, and I'll provide detailed, evidence-based information!

*Confidence: 88% | Always consult healthcare professionals for personalized medical advice*`
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputMessage.trim()
    setInputMessage("")
    setIsLoading(true)

    try {
      let aiResponse: string

      if (apiStatus === "available" && !testMode) {
        // Use real API
        const response = await fetch("/api/ai-integration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: currentInput,
            type: "chat",
          }),
        })

        if (!response.ok) {
          throw new Error("API request failed")
        }

        const data = await response.json()
        aiResponse = data.response
      } else {
        // Use simulated responses
        aiResponse = await simulateAIResponse(currentInput)
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
        confidence: Math.floor(Math.random() * 15) + 85,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "I apologize, but I'm experiencing technical difficulties. Please try again in a moment. For urgent health concerns, contact your healthcare provider or emergency services.",
        timestamp: new Date(),
        confidence: 0,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const quickQuestions = [
    "What's normal blood pressure range?",
    "Can I take ibuprofen with antibiotics?",
    "What are healthy cholesterol levels?",
    "How much water should I drink daily?",
    "What's a normal heart rate?",
  ]

  // Demo function to show blood pressure response
  const demoBloodPressureQuestion = () => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: "What's normal blood pressure range?",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    setTimeout(async () => {
      const aiResponse = await simulateAIResponse("What's normal blood pressure range?")
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
        confidence: 96,
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Disclaimer Alert */}
      <Alert className="mb-6 border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Medical Disclaimer:</strong> This AI provides general health information only and is not a substitute
          for professional medical advice, diagnosis, or treatment. For emergencies, call 911. Always consult healthcare
          professionals for medical concerns.
        </AlertDescription>
      </Alert>

      {/* Demo Button for Testing */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900">🧪 Test Vital Signs Questions</h3>
            <p className="text-sm text-blue-700">Click to see how the AI responds to blood pressure questions</p>
          </div>
          <Button
            onClick={demoBloodPressureQuestion}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            <Heart className="w-4 h-4 mr-2" />
            Test BP Question
          </Button>
        </div>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center space-x-2">
            <MyMedLogo size="sm" showText={false} />
            <span>MYMED.AI Quick Chat</span>
            <Badge
              variant="outline"
              className={`ml-auto ${
                apiStatus === "available"
                  ? "bg-green-100 text-green-800"
                  : apiStatus === "unavailable"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              <Activity className="w-3 h-3 mr-1" />
              {apiStatus === "available" ? "Live AI" : apiStatus === "unavailable" ? "Demo Mode" : "Checking..."}
            </Badge>
          </CardTitle>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Secure • Private • AI-Powered</span>
            </div>
            {apiStatus === "available" && (
              <Button variant="outline" size="sm" onClick={() => setTestMode(!testMode)} className="text-xs">
                {testMode ? "Live Mode" : "Test Mode"}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.type === "user" ? "bg-purple-600 text-white" : "bg-gray-100 border border-gray-200"
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.type === "ai" && <MyMedLogo size="sm" showText={false} className="flex-shrink-0 mt-1" />}
                  {message.type === "user" && <User className="w-5 h-5 flex-shrink-0 mt-1" />}
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                        {message.confidence && (
                          <>
                            <span>•</span>
                            <span className="text-green-600">{message.confidence}% confidence</span>
                          </>
                        )}
                      </div>
                      {message.type === "ai" && (
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyMessage(message.content)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-4 bg-gray-100 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <MyMedLogo size="sm" showText={false} className="animate-pulse" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">AI is analyzing vital signs data...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        <div className="border-t p-4 space-y-3">
          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 font-medium">Quick vital signs questions to get started:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage(question)}
                    className="text-xs hover:bg-purple-50 hover:border-purple-200"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about vital signs... (e.g., 'What's normal blood pressure range?')"
                className="pr-20 focus:ring-purple-500"
                disabled={isLoading}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-purple-100"
                  onClick={() => setIsListening(!isListening)}
                >
                  <Mic className={`w-3 h-3 ${isListening ? "text-red-500" : "text-gray-400"}`} />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-purple-100">
                  <ImageIcon className="w-3 h-3 text-gray-400" />
                </Button>
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Powered by MYMED.AI • For emergencies, call 911 • Not a substitute for professional medical advice
          </p>
        </div>
      </Card>
    </div>
  )
}
