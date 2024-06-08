import { Configuration, OpenAIApi } from "openai-edge";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { apiKey, emails } = body;

  if (!apiKey || !emails) {
    return NextResponse.json("Missing apiKey or emails" , { status: 400 });
  }

  const configuration = new Configuration({
    apiKey: apiKey,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const classifiedEmails = await Promise.all(
      emails.map(async (email) => {
        const response = await openai.createCompletion({
          model: "gpt-3.5-turbo",
          prompt: `Classify the following email text into one of the categories:
            Important, Promotions, Social, Marketing, Spam or if nothing then General \n\nEmail Text: ${email.text}
            \nCategory: return just one word response`,
        });
        console.log(response);

        const label = response.data.choices[0].text.trim().toLowerCase();
        return { ...email, labels: [label] };
      })
    );

    return NextResponse.json(classifiedEmails, { status: 200 });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json("Error fetching mails", { status: 500 });
  }
}
