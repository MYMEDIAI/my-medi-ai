"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import {
  Mic,
  Play,
  Pause,
  Square,
  Volume2,
  AudioWaveformIcon as Waveform,
  Brain,
  Languages,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"

interface VoiceInputProps {
  onTranscription?: (text: string, language: string) => void
  onAnalysis?: (analysis: any) => void
  supportedLanguages?: string[]
  autoAnalyze?: boolean
}

interface TranscriptionResult {
  text: string
  confidence: number
  language: string
  medicalTerms: string[]
  urgencyLevel: "low" | "medium" | "high" | "critical"
}

export default function VoiceMedicalInput({
  onTranscription,
  onAnalysis,
  supportedLanguages = ["en-US", "hi-IN", "ta-IN", "te-IN", "bn-IN", "mr-IN"],
  autoAnalyze = true,
}: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en-US")
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<any>(null)
  const audioContextRef = useRef<any>(null)
  const analyserRef = useRef<any>(null)
  const microphoneRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const animationFrameRef = useRef<number>()
  const durationIntervalRef = useRef<NodeJS.Timeout>()

  const languageNames: { [key: string]: string } = {
    "en-US": "English",
    "hi-IN": "हिंदी (Hindi)",
    "ta-IN": "தமிழ் (Tamil)",
    "te-IN": "తెలుగు (Telugu)",
    "bn-IN": "বাংলা (Bengali)",
    "mr-IN": "मराठी (Marathi)",
  }

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Set up audio context for visualization
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream)

      analyserRef.current.fftSize = 256
      microphoneRef.current.connect(analyserRef.current)

      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" })
        setAudioBlob(blob)
        transcribeAudio(blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingDuration(0)

      // Start duration counter
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1)
      }, 1000)

      // Start audio level monitoring
      monitorAudioLevel()
    } catch (err) {
      setError("Microphone access denied. Please allow microphone permissions.")
      console.error("Error starting recording:", err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      if (audioContextRef.current) {
        audioContextRef.current.close()
      }

      setAudioLevel(0)
    }
  }

  const monitorAudioLevel = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(dataArray)

      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
      setAudioLevel(Math.min(100, (average / 128) * 100))

      animationFrameRef.current = requestAnimationFrame(monitorAudioLevel)
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true)
    try {
      // Simulate transcription API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock transcription result
      const mockTranscription: TranscriptionResult = {
        text: "मुझे सिरदर्द हो रहा है और बुखार भी है। यह दो दिन से चल रहा है।",
        confidence: 0.92,
        language: selectedLanguage,
        medicalTerms: ["सिरदर्द", "बुखार", "headache", "fever"],
        urgencyLevel: "medium",
      }

      setTranscription(mockTranscription)

      if (onTranscription) {
        onTranscription(mockTranscription.text, mockTranscription.language)
      }

      if (autoAnalyze && onAnalysis) {
        analyzeTranscription(mockTranscription)
      }
    } catch (err) {
      setError("Transcription failed. Please try again.")
      console.error("Transcription error:", err)
    } finally {
      setIsTranscribing(false)
    }
  }

  const analyzeTranscription = async (transcription: TranscriptionResult) => {
    try {
      // Simulate medical analysis
      const analysis = {
        symptoms: transcription.medicalTerms,
        urgency: transcription.urgencyLevel,
        recommendations: [
          "Monitor temperature regularly",
          "Stay hydrated",
          "Consider over-the-counter pain relief",
          "Consult doctor if symptoms persist",
        ],
        confidence: transcription.confidence,
      }

      if (onAnalysis) {
        onAnalysis(analysis)
      }
    } catch (err) {
      console.error("Analysis error:", err)
    }
  }

  const playRecording = () => {
    if (audioBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob)
      audioRef.current.src = audioUrl
      audioRef.current.play()
      setIsPlaying(true)

      audioRef.current.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
      }
    }
  }

  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-sm">
            <Languages className="w-4 h-4 mr-2 text-blue-600" />
            Select Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {supportedLanguages.map((lang) => (
              <Button
                key={lang}
                variant={selectedLanguage === lang ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLanguage(lang)}
                className="text-xs"
              >
                {languageNames[lang] || lang}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recording Interface */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Mic className="w-5 h-5 mr-2 text-blue-600" />
              Voice Medical Input
            </div>
            {isRecording && (
              <Badge className="bg-red-500 text-white animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
                RECORDING
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Recording Controls */}
          <div className="flex items-center justify-center space-x-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16"
              >
                <Mic className="w-8 h-8" />
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16"
              >
                <Square className="w-8 h-8" />
              </Button>
            )}

            {audioBlob && (
              <Button
                onClick={isPlaying ? pausePlayback : playRecording}
                variant="outline"
                size="lg"
                className="rounded-full w-12 h-12 bg-transparent"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
            )}
          </div>

          {/* Audio Level Visualization */}
          {isRecording && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Audio Level
                </span>
                <span>{formatDuration(recordingDuration)}</span>
              </div>
              <Progress value={audioLevel} className="h-2" />
              <div className="flex items-center justify-center">
                <Waveform className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="text-center text-sm text-gray-600">
            {!isRecording && !audioBlob && "Click the microphone to start recording your symptoms"}
            {isRecording && "Speak clearly about your symptoms and medical concerns"}
            {audioBlob && !isRecording && "Recording complete. Processing transcription..."}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Transcription Processing */}
      {isTranscribing && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="w-5 h-5 animate-spin text-yellow-600" />
              <span className="text-yellow-800">Processing voice input...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transcription Results */}
      {transcription && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-green-600" />
                Voice Transcription
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={`border-2 ${getUrgencyColor(transcription.urgencyLevel)}`}>
                  {transcription.urgencyLevel.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  {Math.round(transcription.confidence * 100)}% Confidence
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Transcribed Text */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Transcribed Text:</div>
              <Textarea
                value={transcription.text}
                readOnly
                rows={3}
                className="bg-white border-green-200 focus:border-green-400"
              />
            </div>

            {/* Medical Terms Detected */}
            {transcription.medicalTerms.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Medical Terms Detected:</div>
                <div className="flex flex-wrap gap-2">
                  {transcription.medicalTerms.map((term, index) => (
                    <Badge key={index} variant="outline" className="text-blue-600 border-blue-200">
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Language Info */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Language: {languageNames[transcription.language]}</span>
              <span>Processed: {new Date().toLocaleTimeString()}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden Audio Element */}
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  )
}
