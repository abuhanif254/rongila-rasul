import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeContextProvider } from "@/theme/ThemeContextProvider";
import { LayoutWrapper } from "@/components/shared/LayoutWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "The Brain — Intelligence Without Fear or Favour",
  description: "The Brain is your trusted source for accurate, fast and unbiased journalism.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${playfair.variable} ${inter.className}`}>
        <ThemeContextProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
