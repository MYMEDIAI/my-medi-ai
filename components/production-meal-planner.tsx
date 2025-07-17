"use client"

import { useState } from "react"
import Link from "next/link"
import { Utensils, Plus, Home, RotateCcw, Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function ProductionMealPlanner() {
  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [mealPlan, setMealPlan] = useState("")
  const [patientName, setPatientName] = useState("")

  const generatePlan = () => {
    if (age && weight && height) {
      const bmi = (Number.parseFloat(weight) / (Number.parseFloat(height) / 100) ** 2).toFixed(1)
      setMealPlan(`
🍽️ Your Personalized Meal Plan:

📊 Your BMI: ${bmi} kg/m²
📏 Height: ${height} cm
⚖️ Weight: ${weight} kg
🎂 Age: ${age} years

🌅 Breakfast:
• Oatmeal or cereal (1 bowl)
• Milk (1 glass)
• Fruit (1 medium size)

🌞 Lunch:
• Bread/Roti (2-3 pieces)
• Lentils (1 bowl)
• Vegetables (1 bowl)
• Rice (half bowl)

🌙 Dinner:
• Bread/Roti (2 pieces)
• Vegetables (1 bowl)
• Lentils or yogurt (1 bowl)

💧 Water: 8-10 glasses daily
`)
    }
  }

  const handleReset = () => {
    setAge("")
    setWeight("")
    setHeight("")
    setMealPlan("")
    setPatientName("")
  }

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MyMedi.ai - Personalized Meal Plan</title>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            line-height: 1.6; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 800px;
            margin: 0 auto;
          }
          .header { 
            text-align: center; 
            border-bottom: 3px solid #667eea; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            margin: -30px -30px 30px -30px;
            padding: 30px;
            border-radius: 15px 15px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 700;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 1.1em;
          }
          .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
          }
          .meal-section { 
            margin-bottom: 25px; 
            background: #f8f9ff;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
          }
          .meal-section h3 { 
            color: #667eea; 
            border-bottom: 2px solid #e0e7ff; 
            padding-bottom: 8px; 
            margin-top: 0;
            font-size: 1.3em;
          }
          .patient-info {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 10px;
            font-size: 0.9em;
            color: #666;
          }
          @media print { 
            body { margin: 0; background: white !important; } 
            .container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🍽️</div>
            <h1>MyMedi.ai - Personalized Meal Plan</h1>
            <p>AI-Powered Nutrition & Diet Planning</p>
            <p>Generated on: ${new Date().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "Asia/Kolkata",
            })}</p>
          </div>
          
          ${
            patientName
              ? `
          <div class="patient-info">
            <h3>👤 Patient Information</h3>
            <p><strong>Name:</strong> ${patientName}</p>
            <p><strong>Plan Date:</strong> ${new Date().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "Asia/Kolkata",
            })}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
              hour12: true,
            })}</p>
          </div>
          `
              : ""
          }

          <div class="meal-section">
            <h3>🍽️ Personalized Meal Plan</h3>
            <div style="white-space: pre-line; font-size: 1.1em;">${mealPlan}</div>
          </div>

          <div class="footer">
            <p><strong>🌟 Powered by MyMedi.ai 🌟</strong></p>
            <p>This meal plan is for educational purposes only and does not replace professional nutritional advice.</p>
            <p><em>Always consult with qualified nutritionists and healthcare providers for personalized diet plans.</em></p>
            <p>📧 Contact: Harsha@mymedi.ai | 📱 Made in India with ❤️</p>
          </div>
        </div>
      </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleDownload = () => {
    const content = `
MyMedi.ai - Personalized Meal Plan
Generated on: ${new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    })}

${
  patientName
    ? `PATIENT INFORMATION:
Name: ${patientName}
Plan Date: ${new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      })}
Time: ${new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: true,
      })}

`
    : ""
}PERSONALIZED MEAL PLAN:

${mealPlan}

---
DISCLAIMER: This meal plan is for educational purposes only and should not replace professional nutritional advice. Always consult with qualified nutritionists and healthcare providers for personalized diet plans.

Generated by MyMedi.ai - Your AI Healthcare Companion
Contact: Harsha@mymedi.ai
Made in India with ❤️
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `MyMedi-Meal-Plan-${patientName ? patientName.replace(/\s+/g, "-") : "Report"}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="border-yellow-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-yellow-700">
          <div className="flex items-center">
            <Utensils className="w-5 h-5 mr-2" />
            Meal Planner
          </div>
          <div className="flex gap-1">
            <Button onClick={handlePrint} variant="ghost" size="sm" title="Print Plan" disabled={!mealPlan}>
              <Printer className="w-4 h-4" />
            </Button>
            <Button onClick={handleDownload} variant="ghost" size="sm" title="Download Plan" disabled={!mealPlan}>
              <Download className="w-4 h-4" />
            </Button>
            <Button onClick={handleReset} variant="ghost" size="sm" title="Reset">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!patientName && (
          <div className="mb-4">
            <Input
              placeholder="Enter your name (optional)"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="text-sm"
            />
          </div>
        )}

        <div className="bg-yellow-50 p-3 rounded-lg min-h-[100px]">
          {mealPlan ? (
            <div className="text-sm text-yellow-800 whitespace-pre-line">{mealPlan}</div>
          ) : (
            <p className="text-sm text-yellow-600">Enter your information to get a personalized meal plan...</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Input
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="text-sm"
            type="number"
          />
          <Input
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="text-sm"
            type="number"
          />
          <Input
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="text-sm"
            type="number"
          />
        </div>

        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            <Button onClick={generatePlan} size="sm" disabled={!age || !weight || !height}>
              <Plus className="w-4 h-4 mr-1" />
              Generate Plan
            </Button>
            {mealPlan && (
              <>
                <Button onClick={handlePrint} variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-1" />
                  Print
                </Button>
                <Button onClick={handleDownload} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </>
            )}
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
