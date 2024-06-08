import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { apiKey, emails } = body;

  if (!apiKey || !emails) {
    return NextResponse.json("Missing apiKey or emails", { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    async function run(input) {
      const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [
              {
                text: "Classify the upcoming email text into one of the categories and return a one word response Important: Emails that are personal or work-related and require immediate attention Promotions: Emails related to sales, discounts, and marketing campaigns Social: Emails from social networks, friends, and family Marketing: Emails related to marketing, newsletters, and notifications Spam: Unwanted or unsolicited emailsGeneral: If none of the above are matched, use General",
              },
            ],
          },
        ],
      });

      const result = await chatSession.sendMessage(input);
      return result.response.text();
    }

    const classifiedEmails = await Promise.all(
      emails.map(async (email) => {
        const label = await run(email.text);
        return { ...email, labels: [label] };
      })
    );

    return NextResponse.json(classifiedEmails, { status: 200 });
  } catch (error) {
    console.error("Error classifying emails:", error);
    return NextResponse.json("Error classifying emails", { status: 500 });
  }
}
