"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Send,
  Bot,
  User,
  Stethoscope,
  AlertTriangle,
  Phone,
  Calendar,
  Shield,
  Heart,
  Baby,
  Thermometer,
  Activity,
  ArrowRight,
  Loader2,
  Star,
  UserCheck,
} from "lucide-react"
import MyMedLogo from "./mymed-logo"

interface Message {
  id: string
  type: "user" | "ai" | "system"
  content: string
  timestamp: Date
  typing?: boolean
}

interface MedicalScenario {
  id: string
  title: string
  description: string
  icon: any
  color: string
  userMessage: string
  aiResponse: string
  followUpQuestions: string[]
  urgency: "low" | "medium" | "high" | "critical"
  specialistRecommendation?: string
}

const medicalScenarios: MedicalScenario[] = [
  {
    id: "fever-headache",
    title: "Fever & Headache",
    description: "I have fever and headache for 2 days",
    icon: Thermometer,
    color: "from-red-500 to-orange-500",
    userMessage:
      "I have been experiencing fever (101°F) and severe headache for the past 2 days. The headache is throbbing and gets worse with light. I also feel nauseous.",
    aiResponse: `I understand you're experiencing fever and headache for 2 days. Based on your symptoms, this could indicate several conditions:

**Immediate Assessment:**
• Fever (101°F) with severe headache and photophobia (light sensitivity)
• Nausea accompanying the headache
• Duration: 2 days

**Possible Conditions:**
1. **Viral infection** (most common) - flu, common cold
2. **Tension headache** with concurrent illness
3. **Migraine** triggered by fever/illness
4. **Sinusitis** with secondary headache

**Immediate Recommendations:**
• Take paracetamol 500mg every 6 hours for fever
• Rest in a dark, quiet room
• Stay hydrated - drink 8-10 glasses of water
• Apply cold compress to forehead

**Red Flags - Seek immediate care if:**
• Fever above 103°F (39.4°C)
• Severe neck stiffness
• Persistent vomiting
• Confusion or altered consciousness
• Rash anywhere on body

**Follow-up:** If symptoms persist beyond 3 days or worsen, consult a physician for proper evaluation.`,
    followUpQuestions: [
      "Do you have any neck stiffness?",
      "Have you taken any medications?",
      "Any recent travel history?",
      "Are you experiencing any rash?",
    ],
    urgency: "medium",
    specialistRecommendation: "General Physician",
  },
  {
    id: "skin-rash",
    title: "Skin Rash Analysis",
    description: "Skin rash analysis and treatment",
    icon: Activity,
    color: "from-pink-500 to-purple-500",
    userMessage:
      "I have developed a red, itchy rash on my arms and legs over the past 3 days. It started small but is spreading. No fever but it's very uncomfortable.",
    aiResponse: `Thank you for describing your skin rash. Let me analyze your symptoms:

**Current Symptoms:**
• Red, itchy rash on arms and legs
• Progressive spreading over 3 days
• No systemic symptoms (fever)
• Significant discomfort

**Possible Causes:**
1. **Contact Dermatitis** - reaction to allergen/irritant
2. **Eczema flare-up** - atopic dermatitis
3. **Urticaria (Hives)** - allergic reaction
4. **Viral exanthem** - skin manifestation of viral infection

**Immediate Care:**
• Apply cool, damp cloths to affected areas
• Take antihistamine (Cetirizine 10mg once daily)
• Use fragrance-free moisturizer
• Avoid scratching to prevent secondary infection

**Topical Treatment:**
• Calamine lotion for itch relief
• Hydrocortisone cream 1% (over-the-counter)
• Oatmeal baths for soothing effect

**Avoid:**
• Hot showers/baths
• Harsh soaps or detergents
• Known allergens
• Tight clothing over affected areas

**Seek immediate care if:**
• Difficulty breathing or swallowing
• Facial swelling
• Widespread body involvement
• Signs of infection (pus, warmth, red streaking)

**Recommendation:** Consider dermatologist consultation if no improvement in 5-7 days.`,
    followUpQuestions: [
      "Have you used any new products recently?",
      "Any known allergies?",
      "Is the rash raised or flat?",
      "Any recent medication changes?",
    ],
    urgency: "low",
    specialistRecommendation: "Dermatologist",
  },
  {
    id: "diabetes-management",
    title: "Diabetes Management",
    description: "Diabetes management question",
    icon: Heart,
    color: "from-blue-500 to-cyan-500",
    userMessage:
      "I'm a 45-year-old diabetic on Metformin. My morning blood sugar has been consistently high (180-200 mg/dL) despite medication compliance. What should I do?",
    aiResponse: `I understand your concern about elevated morning blood sugars. This is a common challenge in diabetes management.

**Current Situation Analysis:**
• Age: 45 years, Type 2 diabetes
• Current medication: Metformin
• Morning glucose: 180-200 mg/dL (Target: <130 mg/dL)
• Good medication compliance

**Possible Causes of High Morning Glucose:**
1. **Dawn Phenomenon** - natural hormone surge causing glucose rise
2. **Somogyi Effect** - rebound hyperglycemia after nighttime low
3. **Inadequate medication dosing**
4. **Dietary factors** - late evening meals, carbohydrate intake
5. **Stress or poor sleep quality**

**Immediate Actions:**
• Check bedtime glucose levels for 1 week
• Monitor what you eat after 6 PM
• Ensure 10-12 hour gap between dinner and breakfast
• Check if you're experiencing night sweats (sign of low glucose)

**Lifestyle Modifications:**
• **Diet:** Reduce carbohydrates in dinner, increase fiber
• **Exercise:** 30-minute walk after dinner
• **Sleep:** Maintain 7-8 hours quality sleep
• **Stress:** Practice relaxation techniques

**Medical Considerations:**
Your current Metformin dose may need adjustment, or additional medication might be required. Common additions include:
• Long-acting insulin (bedtime dose)
• DPP-4 inhibitors
• SGLT-2 inhibitors

**Urgent Consultation Needed:** Schedule appointment with your endocrinologist within 1-2 weeks for medication review.

**Red Flags:** Seek immediate care if glucose >300 mg/dL, persistent vomiting, or signs of diabetic ketoacidosis.`,
    followUpQuestions: [
      "What time do you usually eat dinner?",
      "Are you checking bedtime glucose?",
      "Any symptoms of low blood sugar at night?",
      "How is your HbA1c level?",
    ],
    urgency: "medium",
    specialistRecommendation: "Endocrinologist",
  },
  {
    id: "pregnancy-guidance",
    title: "Pregnancy Guidance",
    description: "Pregnancy week-by-week guidance",
    icon: Baby,
    color: "from-purple-500 to-pink-500",
    userMessage:
      "I'm 12 weeks pregnant with my first baby. I'm experiencing morning sickness and fatigue. What should I expect and what precautions should I take?",
    aiResponse: `Congratulations on your pregnancy! At 12 weeks, you're entering the second trimester. Let me guide you through this important phase.

**12 Weeks Pregnancy - What's Happening:**
• Baby is about 2.5 inches long (size of a plum)
• Major organs are formed and functioning
• Risk of miscarriage significantly decreases
• Morning sickness often starts improving

**Your Current Symptoms:**
• **Morning sickness** - Normal, usually peaks at 8-10 weeks
• **Fatigue** - Very common due to hormonal changes
• Both typically improve in coming weeks

**Immediate Care:**
• **For nausea:** Small, frequent meals; ginger tea; avoid empty stomach
• **For fatigue:** Rest when possible; maintain regular sleep schedule
• **Hydration:** 8-10 glasses of water daily

**Essential Prenatal Care:**
• **Folic acid:** 400-600 mcg daily (prevents neural tube defects)
• **Prenatal vitamins:** As prescribed by your doctor
• **Iron:** Important for preventing anemia
• **Calcium:** 1000mg daily for bone development

**Diet Recommendations:**
• **Include:** Leafy greens, fruits, whole grains, lean proteins
• **Avoid:** Raw fish, unpasteurized dairy, high-mercury fish, alcohol
• **Limit:** Caffeine to 200mg/day (1 cup coffee)

**Exercise:** Gentle activities like walking, swimming, prenatal yoga (with doctor approval)

**Warning Signs - Contact doctor immediately:**
• Heavy bleeding or cramping
• Severe persistent vomiting
• High fever (>100.4°F)
• Severe abdominal pain
• Sudden severe headaches

**Next Steps:**
• Schedule regular prenatal visits
• Consider genetic screening tests (discuss with OB/GYN)
• Start planning for second trimester care

**Emotional Support:** First pregnancy anxiety is normal. Consider joining pregnancy support groups.`,
    followUpQuestions: [
      "Are you taking prenatal vitamins?",
      "When is your next prenatal appointment?",
      "Any bleeding or cramping?",
      "How severe is your morning sickness?",
    ],
    urgency: "low",
    specialistRecommendation: "OB/GYN",
  },
]

export default function AIDoctorConsultationDemo() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [selectedScenario, setSelectedScenario] = useState<MedicalScenario | null>(null)
  const [consultationStarted, setConsultationStarted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!consultationStarted) {
      const welcomeMessage: Message = {
        id: "welcome",
        type: "ai",
        content: `Hello! I'm Dr. AI, your virtual medical assistant. I'm here to help you with your health concerns and provide preliminary medical guidance.

**How I can help:**
• Analyze your symptoms
• Provide health recommendations
• Suggest when to seek medical care
• Answer general health questions

**Please note:** I provide educational information only and cannot replace professional medical diagnosis or treatment.

Choose a scenario below or describe your symptoms to get started.`,
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
      setConsultationStarted(true)
    }
  }, [consultationStarted])

  const simulateTyping = async (message: string): Promise<void> => {
    setIsTyping(true)

    // Add typing indicator
    const typingMessage: Message = {
      id: `typing-${Date.now()}`,
      type: "ai",
      content: "",
      timestamp: new Date(),
      typing: true,
    }
    setMessages((prev) => [...prev, typingMessage])

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Remove typing indicator and add actual message
    setMessages((prev) => {
      const filtered = prev.filter((msg) => !msg.typing)
      return [
        ...filtered,
        {
          id: `ai-${Date.now()}`,
          type: "ai",
          content: message,
          timestamp: new Date(),
        },
      ]
    })

    setIsTyping(false)
  }

  const handleScenarioSelect = async (scenario: MedicalScenario) => {
    setSelectedScenario(scenario)

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: scenario.userMessage,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    await simulateTyping(scenario.aiResponse)

    // Add follow-up questions after a delay
    setTimeout(async () => {
      const followUpMessage = `**Follow-up Questions:**
${scenario.followUpQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

**Recommended Specialist:** ${scenario.specialistRecommendation}
**Urgency Level:** ${scenario.urgency.toUpperCase()}

Would you like to book a consultation with a ${scenario.specialistRecommendation}?`

      await simulateTyping(followUpMessage)
    }, 1000)
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Generate AI response based on input
    const aiResponse = generateAIResponse(inputMessage)
    await simulateTyping(aiResponse)
  }

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("pain") || lowerInput.includes("hurt")) {
      return `I understand you're experiencing pain. Pain is your body's way of signaling that something needs attention.

**Pain Assessment Questions:**
• Where exactly is the pain located?
• On a scale of 1-10, how would you rate the pain?
• When did it start?
• What makes it better or worse?
• Is it constant or comes and goes?

**General Pain Management:**
• Rest the affected area
• Apply ice for acute injuries (first 24-48 hours)
• Over-the-counter pain relievers as directed
• Gentle movement if tolerated

**Seek immediate care if:**
• Severe pain (8-10/10)
• Pain after injury/trauma
• Signs of infection (fever, redness, swelling)
• Numbness or tingling

Would you like to provide more details about your pain so I can give more specific guidance?`
    }

    if (lowerInput.includes("fever") || lowerInput.includes("temperature")) {
      return `Fever is a common symptom that indicates your body is fighting an infection or illness.

**Fever Management:**
• **Low-grade fever (99-101°F):** Monitor, stay hydrated, rest
• **Moderate fever (101-103°F):** Paracetamol/Ibuprofen, cool compress
• **High fever (>103°F):** Seek medical attention

**Home Care:**
• Drink plenty of fluids
• Rest in a cool environment
• Light clothing
• Lukewarm sponge bath

**Seek immediate care if:**
• Fever >103°F (39.4°C)
• Difficulty breathing
• Severe headache with neck stiffness
• Persistent vomiting
• Signs of dehydration

How high is your temperature, and do you have any other symptoms?`
    }

    if (lowerInput.includes("cough") || lowerInput.includes("cold")) {
      return `Cough and cold symptoms are very common and usually resolve on their own.

**Types of Cough:**
• **Dry cough:** Often viral, treat with honey, warm liquids
• **Productive cough:** With phlegm, stay hydrated, use humidifier
• **Persistent cough:** Lasting >3 weeks needs medical evaluation

**Home Remedies:**
• Honey and warm water
• Steam inhalation
• Throat lozenges
• Humidifier in bedroom
• Adequate rest and fluids

**Seek medical care if:**
• Cough with blood
• High fever with cough
• Difficulty breathing
• Chest pain
• Cough lasting >3 weeks

**Prevention:**
• Hand hygiene
• Avoid close contact with sick individuals
• Maintain good nutrition and sleep

Are you experiencing any other symptoms along with the cough?`
    }

    // Default response for general queries
    return `Thank you for sharing your concern. To provide you with the most accurate guidance, I'd like to understand your symptoms better.

**Please provide more details:**
• What specific symptoms are you experiencing?
• When did they start?
• How severe are they (1-10 scale)?
• Any triggers or patterns you've noticed?
• Current medications or treatments tried?

**General Health Tips:**
• Stay hydrated (8-10 glasses water daily)
• Maintain regular sleep schedule
• Eat balanced, nutritious meals
• Exercise regularly as tolerated
• Manage stress through relaxation techniques

**When to seek immediate care:**
• Severe or worsening symptoms
• Difficulty breathing
• Chest pain
• High fever
• Signs of serious illness

I'm here to help guide you through your health concerns. Please feel free to share more specific details about what you're experiencing.`
  }

  const handleEscalateToHuman = () => {
    const escalationMessage: Message = {
      id: `system-${Date.now()}`,
      type: "system",
      content: `🏥 **Escalating to Human Doctor**

Your case has been flagged for human doctor review. A qualified physician will contact you within:
• **Urgent cases:** 15-30 minutes
• **Standard cases:** 2-4 hours
• **Non-urgent:** 24 hours

**Next Steps:**
1. You'll receive a call from our medical team
2. Prepare your symptoms summary
3. Have your medical history ready
4. List current medications

**Emergency:** If this is a medical emergency, please call 911 or visit your nearest emergency room immediately.

Thank you for using MyMedi.AI. Your health is our priority.`,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, escalationMessage])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Medical Disclaimer Modal */}
      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <Shield className="w-6 h-6 mr-3 text-red-600" />
              Medical Disclaimer & Terms
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Important:</strong> This AI consultation is for educational purposes only and does not replace
                professional medical advice, diagnosis, or treatment.
              </AlertDescription>
            </Alert>

            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900">What this AI can do:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Provide general health information and guidance</li>
                  <li>Help you understand common symptoms</li>
                  <li>Suggest when to seek medical care</li>
                  <li>Offer basic first aid and wellness tips</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">What this AI cannot do:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Provide medical diagnosis or treatment</li>
                  <li>Prescribe medications</li>
                  <li>Replace emergency medical services</li>
                  <li>Guarantee accuracy of medical advice</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800">Emergency Situations:</h4>
                <p className="text-yellow-700">
                  If you're experiencing a medical emergency, please call 911 or visit your nearest emergency room
                  immediately. Do not rely on this AI for emergency medical care.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <input type="checkbox" id="agree" className="rounded" />
              <label htmlFor="agree" className="text-sm text-gray-700">
                I understand and agree to these terms and conditions
              </label>
            </div>

            <Button onClick={() => setShowDisclaimer(false)} className="w-full bg-blue-600 hover:bg-blue-700">
              Start AI Consultation
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MyMedLogo size="lg" />
            <div className="hidden md:block">
              <Badge className="bg-green-100 text-green-800 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                AI Doctor Online
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleEscalateToHuman}>
              <UserCheck className="w-4 h-4 mr-2" />
              Human Doctor
            </Button>
            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4 mr-2" />
              Emergency: 911
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Quick Start Scenarios */}
          {!selectedScenario && messages.length <= 1 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Stethoscope className="w-6 h-6 mr-3 text-blue-600" />
                  Quick Start - Common Medical Scenarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {medicalScenarios.map((scenario) => {
                    const IconComponent = scenario.icon
                    return (
                      <Card
                        key={scenario.id}
                        className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300"
                        onClick={() => handleScenarioSelect(scenario)}
                      >
                        <CardContent className="p-4">
                          <div
                            className={`w-12 h-12 rounded-lg bg-gradient-to-r ${scenario.color} flex items-center justify-center mb-3`}
                          >
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">{scenario.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge
                              className={`text-xs ${
                                scenario.urgency === "critical"
                                  ? "bg-red-100 text-red-800"
                                  : scenario.urgency === "high"
                                    ? "bg-orange-100 text-orange-800"
                                    : scenario.urgency === "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                              }`}
                            >
                              {scenario.urgency} priority
                            </Badge>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chat Interface */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bot className="w-6 h-6 mr-3" />
                  <div>
                    <div className="text-lg">Dr. AI - Medical Assistant</div>
                    <div className="text-sm text-blue-100">Powered by Advanced Medical AI</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Online
                  </div>
                  <Badge className="bg-white/20 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    4.9/5
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex items-start space-x-3 max-w-[80%] ${
                      message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === "user"
                          ? "bg-blue-500"
                          : message.type === "system"
                            ? "bg-orange-500"
                            : "bg-gradient-to-r from-purple-500 to-blue-500"
                      }`}
                    >
                      {message.type === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : message.type === "system" ? (
                        <AlertTriangle className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.type === "user"
                          ? "bg-blue-500 text-white"
                          : message.type === "system"
                            ? "bg-orange-50 border border-orange-200"
                            : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      {message.typing ? (
                        <div className="flex items-center space-x-1">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 ml-2">Dr. AI is typing...</span>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      )}
                      <div className={`text-xs mt-2 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Describe your symptoms or ask a health question..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isTyping}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isTyping || !inputMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>AI responses are for educational purposes only</span>
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" onClick={handleEscalateToHuman}>
                    <UserCheck className="w-3 h-3 mr-1" />
                    Human Doctor
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Calendar className="w-3 h-3 mr-1" />
                    Book Appointment
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Call-to-Action */}
          <Card className="mt-6 bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Need Professional Medical Care?</h3>
              <p className="text-green-100 mb-4">
                Connect with qualified doctors for personalized treatment and diagnosis
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Real Consultation
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Doctor Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
