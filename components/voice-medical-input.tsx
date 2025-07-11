"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  AudioWaveformIcon as Waveform,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Sparkles,
  MessageSquare,
  Globe,
} from "lucide-react"

interface VoiceInputProps {
  onVoiceResult?: (result: {
    text: string
    confidence: number
    language: string
    structuredData?: any
  }) => void
  supportedLanguages?: Array<{
    code: string
    name: string
    flag: string
  }>
  currentLanguage?: string
  onLanguageChange?: (language: string) => void
}

const DEFAULT_LANGUAGES = [
  { code: "en-IN", name: "English (India)", flag: "🇮🇳" },
  { code: "hi-IN", name: "हिंदी", flag: "🇮🇳" },
  { code: "ta-IN", name: "தமிழ்", flag: "🇮🇳" },
  { code: "te-IN", name: "తెలుగు", flag: "🇮🇳" },
  { code: "bn-IN", name: "বাংলা", flag: "🇮🇳" },
  { code: "mr-IN", name: "मराठी", flag: "🇮🇳" },
  { code: "gu-IN", name: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn-IN", name: "ಕನ್ನಡ", flag: "🇮🇳" },
]

// Common medical phrases in different languages for better recognition
const MEDICAL_PHRASES = {
  "en-IN": [
    "I have fever",
    "My head is paining",
    "I feel dizzy",
    "Stomach pain",
    "I can't sleep",
    "Chest pain",
    "Difficulty breathing",
    "Back pain",
  ],
  "hi-IN": [
    "मुझे बुखार है",
    "सिर में दर्द है",
    "चक्कर आ रहे हैं",
    "पेट में दर्द है",
    "नींद नहीं आ रही",
    "छाती में दर्द",
    "सांस लेने में तकलीफ",
    "कमर में दर्द",
  ],
}

export default function VoiceMedicalInput({
  onVoiceResult,
  supportedLanguages = DEFAULT_LANGUAGES,
  currentLanguage = "en-IN",
  onLanguageChange,
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [audioLevel, setAudioLevel] = useState(0)
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage)
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const [voiceCommands, setVoiceCommands] = useState<string[]>([])

  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<any>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null)

  // Initialize speech recognition and synthesis
  useEffect(() => {
    initializeSpeechServices()
    return () => {
      cleanup()
    }
  }, [selectedLanguage])

  const initializeSpeechServices = () => {
    // Initialize Speech Recognition
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = selectedLanguage
      recognitionRef.current.maxAlternatives = 3

      recognitionRef.current.onstart = () => {
        setIsListening(true)
        setError("")
        startAudioVisualization()
      }

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            finalTranscript += result[0].transcript
            setConfidence(Math.round(result[0].confidence * 100))
          } else {
            interimTranscript += result[0].transcript
          }
        }

        const fullTranscript = finalTranscript || interimTranscript
        setTranscript(fullTranscript)

        if (finalTranscript) {
          processVoiceInput(finalTranscript, confidence)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}`)
        setIsListening(false)
        stopAudioVisualization()
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        stopAudioVisualization()
      }
    }

    // Initialize Speech Synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis
    }
  }

  const startAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream)

      microphoneRef.current.connect(analyserRef.current)
      analyserRef.current.fftSize = 256

      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const updateAudioLevel = () => {
        if (analyserRef.current && isListening) {
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
          setAudioLevel(Math.round((average / 255) * 100))
          requestAnimationFrame(updateAudioLevel)
        }
      }

      updateAudioLevel()
    } catch (error) {
      console.error("Audio visualization error:", error)
    }
  }

  const stopAudioVisualization = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    if (microphoneRef.current) {
      microphoneRef.current.disconnect()
      microphoneRef.current = null
    }
    setAudioLevel(0)
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const processVoiceInput = async (text: string, confidenceScore: number) => {
    setIsProcessing(true)
    try {
      // Process the voice input through AI
      const response = await fetch("/api/ai-form-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "process_voice",
          data: { voiceInput: text },
        }),
      })

      const data = await response.json()

      // Call the callback with results
      if (onVoiceResult) {
        onVoiceResult({
          text,
          confidence: confidenceScore,
          language: selectedLanguage,
          structuredData: data.structuredData,
        })
      }

      // Add to voice commands history
      setVoiceCommands((prev) => [text, ...prev.slice(0, 4)])
    } catch (error) {
      console.error("Voice processing error:", error)
      setError("Failed to process voice input")
    } finally {
      setIsProcessing(false)
    }
  }

  const speakText = (text: string) => {
    if (synthRef.current && !isSpeaking) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = selectedLanguage
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 0.8

      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      synthRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const changeLanguage = (langCode: string) => {
    setSelectedLanguage(langCode)
    setShowLanguageSelector(false)
    if (onLanguageChange) {
      onLanguageChange(langCode)
    }
    // Reinitialize recognition with new language
    if (recognitionRef.current) {
      recognitionRef.current.lang = langCode
    }
  }

  const cleanup = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    if (synthRef.current) {
      synthRef.current.cancel()
    }
    stopAudioVisualization()
  }

  const getCurrentLanguageInfo = () => {
    return supportedLanguages.find((lang) => lang.code === selectedLanguage) || supportedLanguages[0]
  }

  return (
    <div className="space-y-4">
      {/* Voice Input Control */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
              Voice Medical Input
              <Badge variant="outline" className="ml-2 text-xs text-blue-600 border-blue-200">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="bg-transparent"
            >
              <Languages className="w-4 h-4 mr-2" />
              {getCurrentLanguageInfo().flag} {getCurrentLanguageInfo().name}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Language Selector */}
          {showLanguageSelector && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-white rounded-lg border">
              {supportedLanguages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={selectedLanguage === lang.code ? "default" : "outline"}
                  size="sm"
                  onClick={() => changeLanguage(lang.code)}
                  className="justify-start text-xs bg-transparent"
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </Button>
              ))}
            </div>
          )}

          {/* Voice Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              size="lg"
              onClick={isListening ? stopListening : startListening}
              className={`${
                isListening ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-blue-600 hover:bg-blue-700"
              } text-white px-8 py-4`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-6 h-6 mr-2" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6 mr-2" />
                  Start Speaking
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={isSpeaking ? stopSpeaking : () => speakText(transcript || "No text to read")}
              disabled={!transcript}
              className="bg-transparent"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-5 h-5 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 mr-2" />
                  Read Aloud
                </>
              )}
            </Button>
          </div>

          {/* Audio Level Visualization */}
          {isListening && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-600">Audio Level</span>
                <span className="text-blue-600">{audioLevel}%</span>
              </div>
              <Progress value={audioLevel} className="h-2" />
              <div className="flex items-center justify-center space-x-1">
                <Waveform className="w-4 h-4 text-blue-600 animate-pulse" />
                <span className="text-sm text-blue-600">Listening...</span>
              </div>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="flex items-center justify-center space-x-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <RefreshCw className="w-4 h-4 animate-spin text-yellow-600" />
              <span className="text-sm text-yellow-800">AI is processing your voice input...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transcript Display */}
      {transcript && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Voice Input Recognized
              </div>
              {confidence > 0 && (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  {confidence}% confident
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border border-green-200">
                <div className="text-sm text-gray-600 mb-1">You said:</div>
                <div className="font-medium text-green-900">"{transcript}"</div>
              </div>
              <div className="flex items-center space-x-2 text-xs text-green-700">
                <Globe className="w-3 h-3" />
                <span>Language: {getCurrentLanguageInfo().name}</span>
                {confidence > 80 && <span className="text-green-600">• High accuracy</span>}
                {confidence > 60 && confidence <= 80 && <span className="text-yellow-600">• Good accuracy</span>}
                {confidence <= 60 && <span className="text-red-600">• Low accuracy - try speaking clearly</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Voice Commands */}
      {voiceCommands.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recent Voice Inputs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {voiceCommands.map((command, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-50 rounded-lg text-sm cursor-pointer hover:bg-gray-100"
                  onClick={() => setTranscript(command)}
                >
                  "{command}"
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Common Medical Phrases */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Common Medical Phrases - Try Saying:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {(MEDICAL_PHRASES[selectedLanguage as keyof typeof MEDICAL_PHRASES] || MEDICAL_PHRASES["en-IN"]).map(
              (phrase, index) => (
                <div
                  key={index}
                  className="p-2 bg-blue-50 rounded-lg text-sm cursor-pointer hover:bg-blue-100 border border-blue-200"
                  onClick={() => speakText(phrase)}
                >
                  <Volume2 className="w-3 h-3 inline mr-2 text-blue-600" />
                  {phrase}
                </div>
              ),
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Voice Input Tips */}
      <Alert className="border-blue-200 bg-blue-50">
        <Mic className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="text-sm space-y-1">
            <div className="font-semibold">Voice Input Tips:</div>
            <div>• Speak clearly and at normal pace</div>
            <div>• Use simple medical terms</div>
            <div>• Mention duration: "for 3 days", "since morning"</div>
            <div>• Describe severity: "mild pain", "severe headache"</div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
