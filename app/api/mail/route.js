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

        const getEmailBody = (message) => {
          let encodedBody = "";
          if (!message.payload.parts) {
            encodedBody = message.payload.body.data;
          } else {
            encodedBody = getHTMLPart(message.payload.parts);
          }
          return Buffer.from(encodedBody, "base64").toString("utf-8");
        };

        const getHTMLPart = (arr) => {
          for (let x = 0; x <= arr.length; x++) {
            if (typeof arr[x].parts === "undefined") {
              if (arr[x].mimeType === "text/html") {
                return arr[x].body.data;
              }
            } else {
              return getHTMLPart(arr[x].parts);
            }
          }
          return "";
        };

        const emailBody = getEmailBody(emailData);

        return {
          id: emailData.id,
          name: getHeader("From").split(" ")[0].replace(/"/g, ""),
          email: getHeader("From").split(" ").pop().replace(/<|>/g, ""),
          subject: getHeader("Subject"),
          text: emailBody,
          snippet: emailData.snippet,
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
