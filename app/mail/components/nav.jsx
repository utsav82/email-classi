"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Input } from "./ui/input";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { set } from "date-fns";
export function Nav({ session, setLoading, setMail, setEmails,emails }) {

  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const storedApiKey = localStorage.getItem("openaiApiKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const saveApiKey = () => {
    localStorage.setItem("openaiApiKey", apiKey);
    toast.success("API Key saved!");
  };

  const classifyEmails = async () => {
    if (!apiKey) {
      toast.error("Please set your OpenAI API Key first.");
      return;
    }

    try {
      setLoading(true);
      setMail(null);
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey, emails }),
      });

      if (!response.ok) {
        throw new Error('Failed to classify emails');
      }

      const classifiedEmails = await response.json();
      setEmails(classifiedEmails);

    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to classify emails, api may fail some times please retry');
    }
    finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {session.data ? (
        <>
          <div className="flex flex-col items-center">
            <img
              src={session.data.user.image}
              alt={session.data.user.name}
              className="rounded-full"
              width={50}
              height={50}
            />
            <h2 className="mt-2 text-lg font-semibold">
              {session.data.user.name}
            </h2>
            <p className="text-sm text-gray-500">{session.data.user.email}</p>
          </div>

          <Button
            onClick={() => signOut()}
          >
            Logout
          </Button>


          <Input
            type="text"
            placeholder="Enter Google Gemini API Key"
            value={apiKey}
            onChange={handleApiKeyChange}
          />
          <Button onClick={saveApiKey} variant="secondary">Save API Key</Button>
          <Button onClick={classifyEmails} variant="outline">
            Classify Emails
          </Button>
        </>
      ) : (
        <p className="text-center text-gray-500">Loading...</p>
      )}
    </div>
  );
}
