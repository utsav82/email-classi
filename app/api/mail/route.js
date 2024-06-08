import { google } from "googleapis";
import { NextResponse } from "next/server";
export async function POST(req) {
  const body = await req.json();
  const { accessToken, limit } = body;

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: "v1", auth });

    const result = await gmail.users.messages.list({
      userId: "me",
      maxResults: limit || 10,
    });

    const messages = await Promise.all(
      result.data.messages.map(async (msg) => {
        const msgRes = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
        });

        const emailData = msgRes.data;
        const headers = emailData.payload.headers;

        const getHeader = (name) => {
          const header = headers.find((header) => header.name === name);
          return header ? header.value : "";
        };

        return {
          id: emailData.id,
          name: getHeader("From").split(" ")[0].replace(/"/g, ""), 
          email: getHeader("From").split(" ").pop().replace(/<|>/g, ""), 
          subject: getHeader("Subject"),
          text: emailData.snippet,
          date: new Date(parseInt(emailData.internalDate)).toISOString(),
          labels: [],
        };
      })
    );

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json("Error fetching mails", { status: 500 });
  }
}
