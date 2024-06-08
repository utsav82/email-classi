"use client";
import { useState, useEffect } from "react";
import GoogleButton from "react-google-button";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/mail");
      toast.success("Logged in successfully");
    }
  }, [status, router]);

  const socialAction = (action) => {
    setIsLoading(true);
    signIn(action)
      .catch((e) => console.log(e))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="w-full h-screen mx-auto flex flex-col gap-5 items-center justify-center">
      {loading ? (
        "Loading..."
      ) : (
        <>
          <h1 className="text-4xl font-bold">Login With Google</h1>
          <GoogleButton onClick={() => socialAction("google")} />
        </>
      )}
    </div>
  );
};

export default LoginPage;
