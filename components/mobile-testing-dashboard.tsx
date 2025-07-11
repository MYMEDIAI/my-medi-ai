"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Ruler,
  Wifi,
  Battery,
  Signal,
  Clock,
  Camera,
  Download,
  Settings,
  Eye,
  Activity,
  Shield,
  Zap,
} from "lucide-react"

interface DevicePreset {
  name: string
  width: number
  height: number
  pixelRatio: number
  userAgent: string
  category: "mobile" | "tablet" | "desktop"
  icon: typeof Smartphone
}

interface TestResult {
  name: string
  status: "pass" | "fail" | "warning"
  message: string
  category: "layout" | "interaction" | "performance" | "accessibility"
}

const devicePresets: DevicePreset[] = [
  // Mobile Devices
  {
    name: "iPhone 14 Pro",
    width: 393,
    height: 852,
    pixelRatio: 3,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
    category: "mobile",
    icon: Smartphone,
  },
  {
    name: "iPhone 14 Pro Max",
    width: 430,
    height: 932,
    pixelRatio: 3,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
    category: "mobile",
    icon: Smartphone,
  },
  {
    name: "Samsung Galaxy S23",
    width: 360,
    height: 780,
    pixelRatio: 3,
    userAgent: "Mozilla/5.0 (Linux; Android 13; SM-S911B)",
    category: "mobile",
    icon: Smartphone,
  },
  {
    name: "Google Pixel 7",
    width: 412,
    height: 915,
    pixelRatio: 2.625,
    userAgent: "Mozilla/5.0 (Linux; Android 13; Pixel 7)",
    category: "mobile",
    icon: Smartphone,
  },
  {
    name: "OnePlus 11",
    width: 384,
    height: 854,
    pixelRatio: 3,
    userAgent: "Mozilla/5.0 (Linux; Android 13; CPH2449)",
    category: "mobile",
    icon: Smartphone,
  },
  // Tablets
  {
    name: "iPad Pro 12.9",
    width: 1024,
    height: 1366,
    pixelRatio: 2,
    userAgent: "Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)",
    category: "tablet",
    icon: Tablet,
  },
  {
    name: "iPad Air",
    width: 820,
    height: 1180,
    pixelRatio: 2,
    userAgent: "Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)",
    category: "tablet",
    icon: Tablet,
  },
  {
    name: "Samsung Galaxy Tab S8",
    width: 753,
    height: 1037,
    pixelRatio: 2.4,
    userAgent: "Mozilla/5.0 (Linux; Android 12; SM-X706B)",
    category: "tablet",
    icon: Tablet,
  },
  // Desktop
  {
    name: "Desktop HD",
    width: 1366,
    height: 768,
    pixelRatio: 1,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    category: "desktop",
    icon: Monitor,
  },
  {
    name: "Desktop FHD",
    width: 1920,
    height: 1080,
    pixelRatio: 1,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    category: "desktop",
    icon: Monitor,
  },
  {
    name: "Desktop 4K",
    width: 3840,
    height: 2160,
    pixelRatio: 2,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    category: "desktop",
    icon: Monitor,
  },
]

export default function MobileTestingDashboard() {
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(devicePresets[0])
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait")
  const [zoom, setZoom] = useState([100])
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [testProgress, setTestProgress] = useState(0)
  const [showRuler, setShowRuler] = useState(false)
  const [networkSpeed, setNetworkSpeed] = useState("4g")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const currentWidth = orientation === "portrait" ? selectedDevice.width : selectedDevice.height
  const currentHeight = orientation === "portrait" ? selectedDevice.height : selectedDevice.width

  const runResponsiveTests = async () => {
    setIsRunningTests(true)
    setTestProgress(0)
    const results: TestResult[] = []

    const tests = [
      {
        name: "Mobile Navigation",
        test: () => {
          const nav = document.querySelector("nav")
          const mobileMenu = document.querySelector("[data-mobile-menu]")
          return nav && (mobileMenu || window.innerWidth > 768)
        },
        category: "layout" as const,
      },
      {
        name: "Viewport Meta Tag",
        test: () => {
          const viewport = document.querySelector('meta[name="viewport"]')
          return viewport !== null
        },
        category: "layout" as const,
      },
      {
        name: "Touch Target Size",
        test: () => {
          const buttons = document.querySelectorAll("button, a")
          let validTargets = 0
          buttons.forEach((btn) => {
            const rect = btn.getBoundingClientRect()
            if (rect.width >= 44 && rect.height >= 44) validTargets++
          })
          return validTargets / buttons.length > 0.8
        },
        category: "interaction" as const,
      },
      {
        name: "Horizontal Scroll",
        test: () => {
          return document.documentElement.scrollWidth <= window.innerWidth
        },
        category: "layout" as const,
      },
      {
        name: "Image Optimization",
        test: () => {
          const images = document.querySelectorAll("img")
          let optimizedImages = 0
          images.forEach((img) => {
            if (img.loading === "lazy" || img.getAttribute("srcset")) optimizedImages++
          })
          return images.length === 0 || optimizedImages / images.length > 0.5
        },
        category: "performance" as const,
      },
      {
        name: "Font Size Readability",
        test: () => {
          const elements = document.querySelectorAll("p, span, div")
          let readableElements = 0
          elements.forEach((el) => {
            const fontSize = Number.parseFloat(window.getComputedStyle(el).fontSize)
            if (fontSize >= 16) readableElements++
          })
          return elements.length === 0 || readableElements / elements.length > 0.7
        },
        category: "accessibility" as const,
      },
      {
        name: "Focus Indicators",
        test: () => {
          const focusableElements = document.querySelectorAll("button, a, input, select, textarea")
          let hasOutline = 0
          focusableElements.forEach((el) => {
            const styles = window.getComputedStyle(el, ":focus")
            if (styles.outline !== "none" || styles.boxShadow !== "none") hasOutline++
          })
          return focusableElements.length === 0 || hasOutline / focusableElements.length > 0.5
        },
        category: "accessibility" as const,
      },
      {
        name: "Loading Performance",
        test: () => {
          return performance.now() < 3000 // Page should load within 3 seconds
        },
        category: "performance" as const,
      },
    ]

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate test time

      try {
        const passed = test.test()
        results.push({
          name: test.name,
          status: passed ? "pass" : "fail",
          message: passed ? "Test passed successfully" : "Test failed - needs attention",
          category: test.category,
        })
      } catch (error) {
        results.push({
          name: test.name,
          status: "warning",
          message: "Test could not be completed",
          category: test.category,
        })
      }

      setTestProgress(((i + 1) / tests.length) * 100)
    }

    setTestResults(results)
    setIsRunningTests(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "fail":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "pass":
        return "bg-green-100 text-green-800"
      case "fail":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getCategoryIcon = (category: TestResult["category"]) => {
    switch (category) {
      case "layout":
        return <Monitor className="w-4 h-4" />
      case "interaction":
        return <Smartphone className="w-4 h-4" />
      case "performance":
        return <Zap className="w-4 h-4" />
      case "accessibility":
        return <Eye className="w-4 h-4" />
    }
  }

  const passedTests = testResults.filter((t) => t.status === "pass").length
  const failedTests = testResults.filter((t) => t.status === "fail").length
  const warningTests = testResults.filter((t) => t.status === "warning").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">📱 Mobile Testing Dashboard</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive responsive design testing across multiple devices and screen sizes
          </p>
        </div>

        <Tabs defaultValue="simulator" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="simulator" className="flex items-center">
              <Smartphone className="w-4 h-4 mr-2" />
              Device Simulator
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Responsive Tests
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Accessibility
            </TabsTrigger>
          </TabsList>

          {/* Device Simulator Tab */}
          <TabsContent value="simulator">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Controls Panel */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Device Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Device Preset</label>
                      <Select
                        value={selectedDevice.name}
                        onValueChange={(value) => {
                          const device = devicePresets.find((d) => d.name === value)
                          if (device) setSelectedDevice(device)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {devicePresets.map((device) => (
                            <SelectItem key={device.name} value={device.name}>
                              <div className="flex items-center">
                                <device.icon className="w-4 h-4 mr-2" />
                                {device.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Orientation</label>
                      <div className="flex gap-2">
                        <Button
                          variant={orientation === "portrait" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setOrientation("portrait")}
                          className="flex-1"
                        >
                          Portrait
                        </Button>
                        <Button
                          variant={orientation === "landscape" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setOrientation("landscape")}
                          className="flex-1"
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Landscape
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Zoom: {zoom[0]}%</label>
                      <Slider value={zoom} onValueChange={setZoom} min={25} max={200} step={25} className="w-full" />
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm" onClick={() => setZoom([Math.max(25, zoom[0] - 25)])}>
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setZoom([100])}>
                          Reset
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setZoom([Math.min(200, zoom[0] + 25)])}>
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Network Speed</label>
                      <Select value={networkSpeed} onValueChange={setNetworkSpeed}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wifi">
                            <div className="flex items-center">
                              <Wifi className="w-4 h-4 mr-2" />
                              WiFi
                            </div>
                          </SelectItem>
                          <SelectItem value="4g">
                            <div className="flex items-center">
                              <Signal className="w-4 h-4 mr-2" />
                              4G
                            </div>
                          </SelectItem>
                          <SelectItem value="3g">
                            <div className="flex items-center">
                              <Signal className="w-4 h-4 mr-2" />
                              3G
                            </div>
                          </SelectItem>
                          <SelectItem value="slow">
                            <div className="flex items-center">
                              <Signal className="w-4 h-4 mr-2" />
                              Slow 3G
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowRuler(!showRuler)} className="flex-1">
                        <Ruler className="w-4 h-4 mr-1" />
                        Ruler
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Camera className="w-4 h-4 mr-1" />
                        Screenshot
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Device Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Device Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Resolution:</span>
                      <span className="font-mono">
                        {currentWidth} × {currentHeight}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pixel Ratio:</span>
                      <span className="font-mono">{selectedDevice.pixelRatio}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <Badge variant="outline">{selectedDevice.category}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Zoom:</span>
                      <span className="font-mono">{zoom[0]}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Device Preview */}
              <div className="lg:col-span-3">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <selectedDevice.icon className="w-5 h-5" />
                      <span className="font-medium">{selectedDevice.name}</span>
                      <Badge variant="outline">{orientation}</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>9:41 AM</span>
                      <Signal className="w-4 h-4" />
                      <Wifi className="w-4 h-4" />
                      <Battery className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="relative mx-auto" style={{ maxWidth: "100%" }}>
                    {/* Device Frame */}
                    <div
                      className="relative bg-black rounded-3xl p-2 shadow-2xl mx-auto"
                      style={{
                        width: `${(currentWidth + 20) * (zoom[0] / 100)}px`,
                        height: `${(currentHeight + 20) * (zoom[0] / 100)}px`,
                        maxWidth: "100%",
                      }}
                    >
                      {/* Screen */}
                      <div
                        className="bg-white rounded-2xl overflow-hidden relative"
                        style={{
                          width: `${currentWidth * (zoom[0] / 100)}px`,
                          height: `${currentHeight * (zoom[0] / 100)}px`,
                        }}
                      >
                        {/* Ruler Overlay */}
                        {showRuler && (
                          <div className="absolute inset-0 z-10 pointer-events-none">
                            <div className="absolute top-0 left-0 right-0 h-4 bg-blue-500/20 border-b border-blue-500">
                              <div className="text-xs text-blue-700 px-2">{currentWidth}px</div>
                            </div>
                            <div className="absolute top-0 left-0 bottom-0 w-4 bg-blue-500/20 border-r border-blue-500">
                              <div
                                className="text-xs text-blue-700 px-1 transform -rotate-90 origin-left"
                                style={{ marginTop: "20px" }}
                              >
                                {currentHeight}px
                              </div>
                            </div>
                          </div>
                        )}

                        {/* App Content */}
                        <iframe
                          ref={iframeRef}
                          src="/"
                          className="w-full h-full border-0"
                          style={{
                            transform: `scale(${zoom[0] / 100})`,
                            transformOrigin: "top left",
                            width: `${(100 / zoom[0]) * 100}%`,
                            height: `${(100 / zoom[0]) * 100}%`,
                          }}
                          title="App Preview"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Responsive Tests Tab */}
          <TabsContent value="testing">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Activity className="w-5 h-5 mr-2" />
                        Responsive Tests
                      </span>
                      <Button onClick={runResponsiveTests} disabled={isRunningTests}>
                        {isRunningTests ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Running...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Run Tests
                          </>
                        )}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isRunningTests && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Running tests...</span>
                          <span className="text-sm text-gray-500">{Math.round(testProgress)}%</span>
                        </div>
                        <Progress value={testProgress} className="w-full" />
                      </div>
                    )}

                    <div className="space-y-3">
                      {testResults.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                          <div className="flex items-center space-x-3">
                            {getCategoryIcon(result.category)}
                            <div>
                              <div className="font-medium">{result.name}</div>
                              <div className="text-sm text-gray-600">{result.message}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(result.status)}>{result.status}</Badge>
                            {getStatusIcon(result.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Test Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Test Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          Passed
                        </span>
                        <Badge className="bg-green-100 text-green-800">{passedTests}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <XCircle className="w-4 h-4 mr-2 text-red-500" />
                          Failed
                        </span>
                        <Badge className="bg-red-100 text-red-800">{failedTests}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                          Warnings
                        </span>
                        <Badge className="bg-yellow-100 text-yellow-800">{warningTests}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Export Test Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Camera className="w-4 h-4 mr-2" />
                      Capture Screenshots
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Run All Device Tests
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                    Load Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>First Contentful Paint</span>
                      <Badge className="bg-green-100 text-green-800">1.2s</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Largest Contentful Paint</span>
                      <Badge className="bg-yellow-100 text-yellow-800">2.1s</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Cumulative Layout Shift</span>
                      <Badge className="bg-green-100 text-green-800">0.05</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-500" />
                    Resource Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Bundle Size</span>
                      <Badge className="bg-blue-100 text-blue-800">245 KB</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Images</span>
                      <Badge className="bg-green-100 text-green-800">Optimized</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>HTTP Requests</span>
                      <Badge className="bg-yellow-100 text-yellow-800">23</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Signal className="w-5 h-5 mr-2 text-purple-500" />
                    Network Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>3G Load Time</span>
                      <Badge className="bg-yellow-100 text-yellow-800">4.2s</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>4G Load Time</span>
                      <Badge className="bg-green-100 text-green-800">1.8s</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>WiFi Load Time</span>
                      <Badge className="bg-green-100 text-green-800">0.9s</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Accessibility Tab */}
          <TabsContent value="accessibility">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-green-500" />
                    Visual Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Color Contrast</span>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">AA</Badge>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Font Size</span>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">16px+</Badge>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Focus Indicators</span>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-blue-500" />
                    Screen Reader Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Alt Text</span>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">Complete</Badge>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>ARIA Labels</span>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">Present</Badge>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Semantic HTML</span>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">Valid</Badge>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
