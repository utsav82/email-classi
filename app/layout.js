import { Inter } from "next/font/google";
import "./globals.css";
import ToasterContext from "./context/ToasterContext";
import AuthContext from "./context/AuthContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Email classifier",
  description: "Assignment Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterContext />
        <AuthContext>{children}</AuthContext>
      </body>
    </html>
  );
}
