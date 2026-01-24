import type { Metadata } from "next";
import StyledComponentsRegistry from "@/lib/registry";
import { ThemeProvider } from "@/styles/ThemeProvider";

export const metadata: Metadata = {
  title: "Jabdori Time~ | Confess Your Procrastination",
  description: "A confession-style service where you admit tasks you procrastinated on, and five brutally honest friends roast you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
