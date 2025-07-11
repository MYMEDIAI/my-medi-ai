import { type NextRequest, NextResponse } from "next/server"
import { Buffer } from "buffer"

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 OCR API called")

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.error("❌ No file provided")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log(`📁 File received: ${file.name}, Size: ${file.size}, Type: ${file.type}`)

    // Validate file type
    if (!file.type.startsWith("image/")) {
      console.error("❌ Invalid file type:", file.type)
      return NextResponse.json({ error: "Only image files are supported" }, { status: 400 })
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      console.error("❌ File too large:", file.size)
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 })
    }

    // Convert file to base64 for processing
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")

    console.log("🔄 Processing image with OCR simulation...")

    // Simulate OCR processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo purposes, we'll simulate OCR extraction based on filename
    let extractedText = ""

    const fileName = file.name.toLowerCase()

    if (fileName.includes("paracetamol") || fileName.includes("acetaminophen")) {
      extractedText = `
PARACETAMOL TABLETS 500mg
Manufactured by: Cipla Ltd
Batch No: PAR2024001
Mfg Date: Jan 2024
Exp Date: Dec 2026
Each tablet contains:
Paracetamol IP 500mg
Dosage: Adults 1-2 tablets every 6-8 hours
Maximum 4g per day
Store in cool dry place
Keep out of reach of children
`
    } else if (fileName.includes("amoxicillin")) {
      extractedText = `
AMOXICILLIN CAPSULES 250mg
Manufactured by: Sun Pharma
Batch No: AMX2024003
Mfg Date: Feb 2024
Exp Date: Jan 2027
Each capsule contains:
Amoxicillin Trihydrate IP 250mg
Dosage: Adults 250-500mg every 8 hours
Take with or without food
Complete the full course
Store below 30°C
Keep out of reach of children
`
    } else if (fileName.includes("metformin")) {
      extractedText = `
METFORMIN TABLETS 500mg
Manufactured by: Dr. Reddy's Laboratories
Batch No: MET2024005
Mfg Date: Mar 2024
Exp Date: Feb 2027
Each tablet contains:
Metformin Hydrochloride IP 500mg
Dosage: Adults 500mg twice daily with meals
May increase to 1000mg twice daily
Store in cool dry place
Keep out of reach of children
`
    } else if (fileName.includes("vitamin") || fileName.includes("d3")) {
      extractedText = `
VITAMIN D3 TABLETS 1000 IU
Manufactured by: Abbott Healthcare
Batch No: VIT2024007
Mfg Date: Apr 2024
Exp Date: Mar 2027
Each tablet contains:
Cholecalciferol 1000 IU
Dosage: Adults 1 tablet daily with food
Store in cool dry place
Keep out of reach of children
`
    } else if (fileName.includes("blood") || fileName.includes("cbc") || fileName.includes("report")) {
      extractedText = `
COMPLETE BLOOD COUNT (CBC)
Patient: John Doe
Date: ${new Date().toLocaleDateString()}
Lab: PathLab Diagnostics

PARAMETER          RESULT    REFERENCE RANGE
Hemoglobin         13.5 g/dL  12.0-15.5 g/dL
RBC Count          4.2 M/μL   4.0-5.5 M/μL
WBC Count          7,500/μL   4,000-10,000/μL
Platelet Count     250,000/μL 150,000-450,000/μL
Hematocrit         40.5%      36-46%
MCV                85 fL      80-100 fL
MCH                29 pg      27-32 pg
MCHC               33 g/dL    32-36 g/dL

All values within normal limits
`
    } else {
      // Generic medicine text extraction
      extractedText = `
MEDICINE TABLET/CAPSULE
Manufactured by: Generic Pharma Ltd
Batch No: GEN2024001
Mfg Date: ${new Date().toLocaleDateString()}
Exp Date: ${new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
Active Ingredient: [Medicine Name]
Dosage: As directed by physician
Store in cool dry place
Keep out of reach of children
For external use only if applicable
`
    }

    console.log("✅ OCR extraction completed")
    console.log(`📝 Extracted text length: ${extractedText.length} characters`)

    return NextResponse.json({
      success: true,
      extractedText: extractedText.trim(),
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ OCR processing error:", error)

    return NextResponse.json(
      {
        error: "OCR processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
