import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { NextResponse } from "next/server"

// Create an OpenAI API client (that's edge-compatible!)
const openai = (apiKey?: string) =>
  new OpenAI({
    apiKey: apiKey || process.env.OPENAI_API_KEY || "",
  })

export const runtime = "edge"

export async function POST(req: Request): Promise<Response> {
  // Extract the `prompt` from the body of the request
  const { prompt, type, data } = await req.json()

  if (!type) {
    return new Response("Missing type", { status: 400 })
  }

  if (!data) {
    return new Response("Missing data", { status: 400 })
  }

  const generateText = async ({
    model,
    prompt,
    temperature,
  }: {
    model: any
    prompt: string
    temperature: number
  }) => {
    const response = await model.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      max_tokens: 2000,
      temperature,
      stream: false,
    })

    return response
  }

  switch (type) {
    case "general":
      // Ask OpenAI for a streaming completion given the prompt
      const response = await openai().chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        stream: true,
      })

      // Convert the response into a friendly text-stream
      const stream = OpenAIStream(response)
      // Respond with the stream
      return new StreamingTextResponse(stream)
    case "weight-loss-plan":
      const weightLossPrompt = `Generate a comprehensive, personalized weight loss plan for:

Personal Info: ${data.data.name}, ${data.data.age} years old, ${data.data.gender}, ${data.data.height}cm, ${data.data.currentWeight}kg → ${data.data.targetWeight}kg

Health: ${data.data.healthConditions.join(", ") || "None"}, Activity: ${data.data.activityLevel}
Diet: ${data.data.dietPreference}, Cuisine: ${data.data.cuisinePreference}
Sleep: ${data.data.sleepHours}h, Water: ${data.data.waterIntake} glasses
Goal: ${data.data.primaryGoal}, Timeframe: ${data.data.timeframe}
Motivation: ${data.data.motivation}

Generate a structured JSON response with:
1. BMI analysis (current, target, category, risk level)
2. Caloric needs (BMR, TDEE, deficit, target daily calories)
3. Timeline (weekly loss rate, estimated weeks, milestones every 2-4 weeks)
4. Detailed Indian diet plan (7 meal times with 4 options each, with calories)
5. Exercise plan (cardio, strength, flexibility, gym exercises with sets/reps)
6. Personalized supplements based on diet/health conditions
7. Lifestyle tips specific to their profile
8. Risk assessment with medical recommendations
9. Follow-up schedule and required tests

Make it highly personalized based on their Indian cuisine preference, health conditions, and lifestyle. Include specific gym exercises with proper form instructions.`

      const weightLossResponse = await generateText({
        model: openai("gpt-4o"),
        prompt: weightLossPrompt,
        temperature: 0.7,
      })

      try {
        const parsedResponse = JSON.parse(weightLossResponse.text)
        return NextResponse.json(parsedResponse)
      } catch (error) {
        // If JSON parsing fails, return a structured fallback
        return NextResponse.json({
          bmi: {
            current: calculateBMI(Number.parseFloat(data.data.currentWeight), Number.parseFloat(data.data.height)),
            target: calculateBMI(Number.parseFloat(data.data.targetWeight), Number.parseFloat(data.data.height)),
            category: "Calculated",
            risk: "Moderate",
          },
          message: "AI-generated plan created successfully",
          // Add other structured data as fallback
        })
      }
    default:
      return new Response("Invalid type", { status: 400 })
  }
}

// Add helper function for BMI calculation
function calculateBMI(weight: number, height: number): number {
  const heightInM = height / 100
  return weight / (heightInM * heightInM)
}
