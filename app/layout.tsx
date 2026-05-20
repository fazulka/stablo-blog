import "@/styles/tailwind.css";
import { Plus_Jakarta_Sans, Caveat } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-jakarta"
});

const caveat = Caveat({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-caveat"
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="sk"
      className={`${jakarta.variable} ${caveat.variable}`}>
      <body className="bg-paper text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
