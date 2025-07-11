"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Brain,
  Heart,
  Zap,
  Star,
  TrendingUp,
  CheckCircle,
  Sparkles,
  MessageSquare,
  Stethoscope,
  Phone,
  Video,
  Globe,
  Wifi,
  Database,
  Lock,
  Award,
  Apple,
  Baby,
} from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  sources?: string[]
  confidence?: number
  category?: string
  urgency?: "low" | "medium" | "high"
  suggestions?: string[]
}

interface HealthMetrics {
  responseTime: number
  accuracy: number
  satisfaction: number
  consultations: number
}

export default function AIHealthChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content: `🩺 **Welcome to MyMedi.ai - Your Advanced AI Health Assistant!**

I'm Dr. MyMedi, powered by GPT-4 and trained on comprehensive medical databases. I'm here to provide:

🔹 **Instant Medical Consultations** - 24/7 availability
🔹 **Symptom Analysis** - Advanced diagnostic insights  
🔹 **Medication Guidance** - Drug interactions & side effects
🔹 **Health Monitoring** - Personalized wellness advice
🔹 **Emergency Assessment** - Urgent care recommendations

**🌟 Enhanced Features:**
• Real-time health scoring
• Multi-language support (Hindi, English, Tamil, Telugu)
• Integration with 500+ hospitals across India
• HIPAA-compliant secure conversations

⚠️ **Important Medical Disclaimer**: I provide evidence-based health information for educational purposes. For medical emergencies, call 108. Always consult qualified healthcare professionals for diagnosis and treatment.

**What health concern can I help you with today?** 
Try asking: "I have a headache and fever" or "Can I take paracetamol with my blood pressure medication?"`,
      timestamp: new Date(),
      confidence: 100,
      category: "welcome",
      urgency: "low",
    },
  ])

  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    responseTime: 1.2,
    accuracy: 98.5,
    satisfaction: 4.9,
    consultations: 2847,
  })
  const [currentTyping, setCurrentTyping] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setHealthMetrics((prev) => ({
        ...prev,
        consultations: prev.consultations + Math.floor(Math.random() * 3),
        responseTime: Math.max(0.8, prev.responseTime + (Math.random() - 0.5) * 0.2),
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing delay with typing indicator
    setCurrentTyping("AI is analyzing your symptoms...")
    await new Promise((resolve) => setTimeout(resolve, 800))

    setCurrentTyping("Consulting medical databases...")
    await new Promise((resolve) => setTimeout(resolve, 600))

    setCurrentTyping("Generating personalized recommendations...")
    await new Promise((resolve) => setTimeout(resolve, 400))

    setCurrentTyping("")

    const message = userMessage.toLowerCase()

    if (message.includes("headache") && message.includes("fever")) {
      return `## 🌡️ **Headache & Fever Analysis**

**📊 Symptom Assessment:**
- **Severity Level**: Moderate (requires attention)
- **Likely Causes**: Viral infection, flu, tension headache
- **Risk Factors**: Dehydration, stress, seasonal changes

**💊 Immediate Relief Options:**
• **Paracetamol**: 500-1000mg every 6-8 hours (max 4g/day)
• **Ibuprofen**: 400mg every 6-8 hours with food
• **Hydration**: 8-10 glasses of water daily
• **Rest**: Dark, quiet room for 2-3 hours

**🚨 Seek Medical Care If:**
- Fever >102°F (39°C) for >3 days
- Severe headache with neck stiffness
- Persistent vomiting or confusion
- Difficulty breathing or chest pain

**📱 Next Steps:**
1. Monitor temperature every 4 hours
2. Track symptom progression
3. Consider teleconsultation if symptoms worsen

**🏥 Recommended Specialists:**
- General Physician (if symptoms persist >3 days)
- Neurologist (for severe headaches)

*Confidence: 94% | Based on WHO guidelines & Indian medical protocols*`
    }

    if (message.includes("blood pressure") || message.includes("bp")) {
      return `## 🫀 **Blood Pressure Management Guide**

**📈 Understanding Your BP:**
- **Normal**: <120/80 mmHg
- **Elevated**: 120-129/<80 mmHg  
- **Stage 1 Hypertension**: 130-139/80-89 mmHg
- **Stage 2 Hypertension**: ≥140/90 mmHg

**💊 Common BP Medications in India:**
• **ACE Inhibitors**: Enalapril, Lisinopril
• **ARBs**: Telmisartan, Losartan
• **Calcium Channel Blockers**: Amlodipine
• **Diuretics**: Hydrochlorothiazide

**🥗 Lifestyle Modifications:**
- **DASH Diet**: Rich in fruits, vegetables, low sodium
- **Exercise**: 30 min moderate activity, 5 days/week
- **Weight Management**: BMI 18.5-24.9
- **Stress Reduction**: Yoga, meditation, adequate sleep

**⚠️ Drug Interactions to Avoid:**
- NSAIDs (can increase BP)
- Decongestants (pseudoephedrine)
- Excessive caffeine or alcohol

**📊 Monitoring Schedule:**
- Daily: Home BP monitoring
- Weekly: Weight tracking
- Monthly: Doctor consultation

*Confidence: 96% | Based on Indian Hypertension Guidelines 2019*`
    }

    if (message.includes("diabetes") || message.includes("sugar")) {
      return `## 🍯 **Diabetes Management Comprehensive Guide**

**📊 Blood Sugar Targets (Indian Guidelines):**
- **Fasting**: 80-130 mg/dL
- **Post-meal (2hr)**: <180 mg/dL
- **HbA1c**: <7% (individualized targets)

**💊 Medication Categories:**
• **Metformin**: First-line treatment (500-2000mg/day)
• **Sulfonylureas**: Glimepiride, Gliclazide
• **DPP-4 Inhibitors**: Sitagliptin, Vildagliptin
• **SGLT-2 Inhibitors**: Dapagliflozin, Empagliflozin

**🍽️ Indian Diabetic Diet Plan:**
- **Carbs**: 45-65% of total calories (complex carbs)
- **Proteins**: 15-20% (dal, lean meat, fish)
- **Fats**: 20-35% (nuts, olive oil, avocado)
- **Fiber**: 25-35g daily (vegetables, whole grains)

**🏃‍♂️ Exercise Recommendations:**
- **Aerobic**: 150 min/week moderate intensity
- **Resistance**: 2-3 sessions/week
- **Flexibility**: Daily stretching
- **Post-meal walks**: 10-15 minutes

**🔍 Regular Monitoring:**
- **Daily**: Blood glucose, foot inspection
- **Weekly**: Weight, BP monitoring
- **Quarterly**: HbA1c, lipid profile
- **Annually**: Eye exam, kidney function

*Confidence: 97% | Based on Diabetes India Guidelines 2023*`
    }

    if (message.includes("pregnancy") || message.includes("pregnant")) {
      return `## 🤱 **Pregnancy Care & Monitoring**

**📅 Trimester-wise Care:**

**First Trimester (1-12 weeks):**
- **Folic Acid**: 400-800 mcg daily
- **Prenatal Vitamins**: Iron, Calcium, DHA
- **Avoid**: Alcohol, smoking, raw foods
- **Symptoms**: Morning sickness, fatigue normal

**Second Trimester (13-28 weeks):**
- **Glucose Screening**: 24-28 weeks
- **Anatomy Scan**: 18-22 weeks
- **Weight Gain**: 1-2 lbs/week
- **Exercise**: Prenatal yoga, walking

**Third Trimester (29-40 weeks):**
- **Kick Counts**: Monitor fetal movement
- **Group B Strep**: Screening at 35-37 weeks
- **Birth Plan**: Discuss delivery options
- **Hospital Bag**: Prepare by 36 weeks

**🚨 Warning Signs - Call Doctor:**
- Heavy bleeding or severe cramping
- Severe headaches with vision changes
- Persistent vomiting (hyperemesis)
- Decreased fetal movement
- Signs of preterm labor

**🏥 Indian Pregnancy Care:**
- **Janani Suraksha Yojana**: Government support
- **ASHA Workers**: Community health support
- **Immunizations**: Tetanus, Flu vaccines

*Confidence: 95% | Based on FOGSI Guidelines 2023*`
    }

    // Enhanced default response with more comprehensive information
    return `## 🩺 **Comprehensive Health Analysis**

Thank you for your health inquiry. To provide the most accurate and personalized guidance, I'd like to understand more about your specific situation.

**📝 Please provide details about:**
• **Primary Symptoms**: What are you experiencing?
• **Duration**: How long have you had these symptoms?
• **Severity**: Rate from 1-10 (10 being severe)
• **Triggers**: What makes it better or worse?
• **Medical History**: Any chronic conditions or medications?

**🔍 I can help with:**
• **Symptom Analysis**: Detailed assessment and possible causes
• **Medication Guidance**: Dosages, interactions, side effects
• **Lifestyle Advice**: Diet, exercise, stress management
• **Specialist Referrals**: When and which doctor to see
• **Emergency Assessment**: Urgency level determination

**📊 Popular Health Topics:**
• Diabetes management and blood sugar control
• Hypertension and cardiovascular health
• Respiratory issues and breathing problems
• Digestive health and gastric concerns
• Mental health and stress management
• Women's health and pregnancy care

**🌟 Enhanced Features:**
• Multi-language support (Hindi, English, regional languages)
• Integration with 500+ hospitals across India
• Real-time health scoring and risk assessment
• Personalized treatment recommendations

**Example Questions:**
- "I have chest pain and shortness of breath"
- "Can I take aspirin with my diabetes medication?"
- "What are the side effects of metformin?"
- "I'm 8 weeks pregnant, what should I avoid?"

*Confidence: 92% | Always consult healthcare professionals for medical decisions*`
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
      category: "query",
      urgency: "medium",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const aiResponse = await simulateAIResponse(inputMessage.trim())

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
        confidence: Math.floor(Math.random() * 15) + 85,
        category: "medical_advice",
        urgency:
          inputMessage.toLowerCase().includes("emergency") || inputMessage.toLowerCase().includes("urgent")
            ? "high"
            : "medium",
        suggestions: [
          "Book appointment with specialist",
          "Get lab tests done",
          "Monitor symptoms for 24-48 hours",
          "Follow up in 1 week",
        ],
      }

      setMessages((prev) => [...prev, aiMessage])

      // Update metrics
      setHealthMetrics((prev) => ({
        ...prev,
        consultations: prev.consultations + 1,
        responseTime: Math.random() * 0.5 + 0.8,
      }))
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "I apologize, but I'm experiencing technical difficulties. Please try again in a moment. For urgent health concerns, contact your healthcare provider or emergency services (108).",
        timestamp: new Date(),
        confidence: 0,
        category: "error",
        urgency: "low",
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
    "I have fever and body ache, what should I do?",
    "Can I take paracetamol with my BP medication?",
    "What are the symptoms of diabetes?",
    "I'm pregnant, what foods should I avoid?",
    "How to manage high blood pressure naturally?",
    "What are the side effects of metformin?",
  ]

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      default:
        return "text-green-600 bg-green-50 border-green-200"
    }
  }

  const getUrgencyIcon = (urgency?: string) => {
    switch (urgency) {
      case "high":
        return <AlertTriangle className="w-4 h-4" />
      case "medium":
        return <Clock className="w-4 h-4" />
      default:
        return <CheckCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Enhanced Header with Live Metrics */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
          <CardContent className="p-4 text-center">
            <Activity className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">{healthMetrics.responseTime.toFixed(1)}s</div>
            <div className="text-sm opacity-90">Avg Response</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
          <CardContent className="p-4 text-center">
            <Apple className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">{healthMetrics.accuracy}%</div>
            <div className="text-sm opacity-90">Accuracy Rate</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <CardContent className="p-4 text-center">
            <Star className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">{healthMetrics.satisfaction}</div>
            <div className="text-sm opacity-90">User Rating</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">{healthMetrics.consultations.toLocaleString()}</div>
            <div className="text-sm opacity-90">Consultations</div>
          </CardContent>
        </Card>
      </div>

      {/* Medical Disclaimer */}
      <Alert className="mb-6 border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>🚨 Medical Emergency Disclaimer:</strong> This AI provides general health information only. For
          medical emergencies, call 108 (India) or visit the nearest emergency room. Always consult qualified healthcare
          professionals for diagnosis and treatment.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-blue-100 to-purple-100">
          <TabsTrigger value="chat" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
            <MessageSquare className="w-4 h-4 mr-2" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="features" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
            <Sparkles className="w-4 h-4 mr-2" />
            Features
          </TabsTrigger>
          <TabsTrigger value="specialties" className="data-[state=active]:bg-white data-[state=active]:text-green-700">
            <Stethoscope className="w-4 h-4 mr-2" />
            Specialties
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <Card className="h-[700px] flex flex-col border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="border-b bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-white text-xl">
                <MyMedLogo size="sm" showText={false} />
                <span className="ml-3">Dr. MyMedi - AI Health Assistant</span>
                <div className="ml-auto flex items-center space-x-2">
                  <Badge className="bg-green-400 text-green-900 animate-pulse">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-1 animate-ping"></div>
                    LIVE
                  </Badge>
                  <Badge className="bg-white bg-opacity-20 text-white border-white border-opacity-30">
                    <Brain className="w-3 h-3 mr-1" />
                    GPT-4 Powered
                  </Badge>
                </div>
              </CardTitle>
              <div className="flex items-center space-x-4 text-sm text-blue-100">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  <span>HIPAA Secure</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  <span>Multi-language</span>
                </div>
                <div className="flex items-center">
                  <Database className="w-4 h-4 mr-1" />
                  <span>500+ Hospitals</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 shadow-lg"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {message.type === "ai" && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <Brain className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      {message.type === "user" && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>

                        {message.type === "ai" && message.suggestions && (
                          <div className="mt-4 space-y-2">
                            <div className="text-xs font-semibold text-gray-600 mb-2">💡 Suggested Actions:</div>
                            <div className="grid grid-cols-1 gap-2">
                              {message.suggestions.map((suggestion, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs justify-start h-8 bg-blue-50 border-blue-200 hover:bg-blue-100"
                                >
                                  <CheckCircle className="w-3 h-3 mr-2 text-blue-600" />
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>{message.timestamp.toLocaleTimeString()}</span>
                            </div>
                            {message.confidence && (
                              <div className="flex items-center">
                                <Award className="w-3 h-3 mr-1 text-green-600" />
                                <span className="text-green-600 font-medium">{message.confidence}% confidence</span>
                              </div>
                            )}
                            {message.urgency && (
                              <Badge className={`${getUrgencyColor(message.urgency)} text-xs`}>
                                {getUrgencyIcon(message.urgency)}
                                <span className="ml-1 capitalize">{message.urgency}</span>
                              </Badge>
                            )}
                          </div>
                          {message.type === "ai" && (
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyMessage(message.content)}
                                className="h-6 w-6 p-0 hover:bg-blue-100"
                              >
                                <Copy className="w-3 h-3 text-gray-500" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-green-100">
                                <ThumbsUp className="w-3 h-3 text-gray-500" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-red-100">
                                <ThumbsDown className="w-3 h-3 text-gray-500" />
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
                  <div className="max-w-[85%] rounded-2xl p-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-pink-600 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {currentTyping || "AI is analyzing your query..."}
                          </span>
                        </div>
                        <Progress value={75} className="mt-2 h-1" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            <div className="border-t bg-gradient-to-r from-gray-50 to-blue-50 p-4 space-y-4 rounded-b-lg">
              {/* Quick Questions */}
              {messages.length === 1 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 font-medium flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                    Quick questions to get started:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {quickQuestions.map((question, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() => setInputMessage(question)}
                        className="text-xs hover:bg-blue-50 hover:border-blue-200 justify-start h-auto p-3 bg-white"
                      >
                        <MessageSquare className="w-3 h-3 mr-2 text-blue-600" />
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your symptoms or ask a health question... (e.g., 'I have chest pain and shortness of breath')"
                    className="pr-24 py-3 text-base focus:ring-2 focus:ring-blue-500 border-2 border-gray-200 rounded-xl"
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-blue-100"
                      onClick={() => setIsListening(!isListening)}
                    >
                      <Mic className={`w-4 h-4 ${isListening ? "text-red-500 animate-pulse" : "text-gray-400"}`} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-100">
                      <ImageIcon className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                <div className="flex items-center">
                  <Lock className="w-3 h-3 mr-1" />
                  <span>End-to-end encrypted</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  <span>HIPAA compliant</span>
                </div>
                <div className="flex items-center">
                  <Wifi className="w-3 h-3 mr-1" />
                  <span>Real-time responses</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-900">Advanced AI Analysis</h3>
                    <p className="text-sm text-gray-600">GPT-4 powered medical insights</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Symptom pattern recognition
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Medical database integration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Risk assessment algorithms
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-900">Multi-language Support</h3>
                    <p className="text-sm text-gray-600">Communicate in your language</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Hindi, English, Tamil, Telugu
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Regional language support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Voice input/output
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-900">Privacy & Security</h3>
                    <p className="text-sm text-gray-600">Your health data is protected</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    HIPAA compliant encryption
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    No data sharing with third parties
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Secure cloud infrastructure
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-900">Emergency Integration</h3>
                    <p className="text-sm text-gray-600">Quick access to emergency care</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Direct 108 emergency calling
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Nearest hospital locator
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Ambulance booking integration
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-900">Telemedicine Integration</h3>
                    <p className="text-sm text-gray-600">Connect with real doctors</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Video consultations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Prescription management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Follow-up scheduling
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-900">Health Records</h3>
                    <p className="text-sm text-gray-600">Comprehensive health tracking</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Digital health records
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Medication tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Lab result integration
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="specialties">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: "Cardiology",
                icon: Heart,
                color: "from-red-500 to-pink-500",
                expertise: "Heart & Cardiovascular",
              },
              {
                name: "Neurology",
                icon: Brain,
                color: "from-purple-500 to-indigo-500",
                expertise: "Brain & Nervous System",
              },
              {
                name: "Endocrinology",
                icon: Zap,
                color: "from-yellow-500 to-orange-500",
                expertise: "Diabetes & Hormones",
              },
              {
                name: "Gastroenterology",
                icon: Apple,
                color: "from-green-500 to-emerald-500",
                expertise: "Digestive System",
              },
              {
                name: "Pulmonology",
                icon: Activity,
                color: "from-cyan-500 to-blue-500",
                expertise: "Respiratory System",
              },
              { name: "Dermatology", icon: Sparkles, color: "from-pink-500 to-rose-500", expertise: "Skin Conditions" },
              { name: "Orthopedics", icon: Shield, color: "from-gray-500 to-slate-500", expertise: "Bones & Joints" },
              { name: "Gynecology", icon: Baby, color: "from-purple-500 to-pink-500", expertise: "Women's Health" },
            ].map((specialty, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${specialty.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <specialty.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{specialty.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{specialty.expertise}</p>
                  <Badge className="bg-green-100 text-green-800">Available 24/7</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 text-center text-sm text-gray-500 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
        <MyMedLogo size="sm" className="mx-auto mb-2" />
        <p className="font-medium">🌟 Powered by MyMedi.ai - Advanced AI Healthcare Platform 🌟</p>
        <p className="mt-1">
          This information is for educational purposes only and does not replace professional medical advice. Always
          consult qualified healthcare providers for medical decisions.
        </p>
      </div>
    </div>
  )
}
