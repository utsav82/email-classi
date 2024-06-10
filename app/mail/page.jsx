"use client"
import { mails } from "./data"
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Rings } from "react-loader-spinner"
import { Input } from "./components/ui/input";
import { Separator } from "./components/ui/separator";
import { MailDisplay } from "./components/mail-display";
import { MailList } from "./components//mail-list";
import { Nav } from "./components/nav";
import { Search } from "lucide-react";
import { set } from "date-fns";


export default function MailPage() {
  const router = useRouter();
  const session = useSession();
  const [emails, setEmails] = useState([]);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [mail, setMail] = useState();
  const defaultLayout = [265, 440, 655]

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/");
      toast.error("You are not logged in");
    }
    fetchEmails();
  }, [session, limit]);


  const fetchEmails = () => {
    if (session.status === "authenticated" && session.data.accessToken) {
      setLoading(true);
      setMail(null);
      console.log("Fetching emails");
      fetch('/api/mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken: session.data.accessToken, limit: limit }),
      })
        .then(async (emails) => {
          if (emails.status === 500) {
            toast.error("Error fetching emails logging out");
            signOut();
            throw new Error("Error fetching emails");
          }
          setEmails(await emails.json())
          setLoading(false);
        })
        .catch((error) => console.error('Error fetching emails:', error));
    }
  }
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formLimit = event.target.limit.value;
    setLimit(formLimit);
  };


  return (
    <>
      <div className="flex-col md:flex">
        <div className="h-full max-h-[800px] flex gap-5">
          <div style={{ width: defaultLayout[0] }}>
            <div className="flex h-[52px] items-center justify-center px-2"></div>
            <Nav session={session} setLoading={setLoading} setMail={setMail} setEmails={setEmails} emails={emails} />
          </div>
          <div style={{ width: defaultLayout[1] }}>
            <div className="flex items-center px-4 py-2 mt-5">
              <h1 className="text-xl font-bold">Inbox</h1>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form onSubmit={handleFormSubmit}>
                <div className="flex justify-center items-center gap-2">
                  <Input name="limit"
                    type="number"
                    placeholder="Enter number of mails to fetch"
                    defaultValue={limit}
                    min="1"
                  />
                  <button type="submit">
                    <Search />
                  </button>
                </div>
              </form>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-screen">
                <Rings color="#6366F1" />
              </div>
            )
              : <MailList items={emails} setMail={setMail} />}
          </div>
          <div style={{ width: defaultLayout[2] }}>
            {<MailDisplay
              mail={mail}
            />}
          </div>
        </div>
      </div>
    </>
  )
}


