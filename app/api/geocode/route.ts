import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { NextResponse } from "next/server"

// Configure OpenRouter with your API key
const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { locationString } = await req.json()

    if (!locationString) {
      return NextResponse.json({ error: "Location string is required" }, { status: 400 })
    }

    const prompt = `Given the location string "${locationString}", provide its latitude and longitude in a JSON format: {"latitude": <lat>, "longitude": <lon>}. If the location cannot be found, return {"error": "Location not found"}. Only return the JSON object.`

    const { text } = await generateText({
      model: openrouter("horizon-alpha"), // Changed model to openrouter/horizon-alpha
      prompt: prompt,
      temperature: 0, // Keep it deterministic for geocoding
    })

    try {
      const result = JSON.parse(text)
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 404 })
      }
      if (typeof result.latitude === "number" && typeof result.longitude === "number") {
        return NextResponse.json({ latitude: result.latitude, longitude: result.longitude })
      } else {
        return NextResponse.json({ error: "Invalid format from AI model" }, { status: 500 })
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", text, parseError)
      return NextResponse.json({ error: "Failed to parse AI response for coordinates" }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Geocoding API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
