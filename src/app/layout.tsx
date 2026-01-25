import type { Metadata } from "next";
import StyledComponentsRegistry from "@/lib/registry";
import { ThemeProvider } from "@/styles/ThemeProvider";


export const metadata: Metadata = {
  metadataBase: new URL("https://jabdori-time.vercel.app/"), 
  title: "잡도리타임 | 오늘 미뤘던 할 일을 자백하고 따스한 위로를 얻어가세요.",
  description:
    "5명의 개성있는 친절한 친구들이, 잘못에 대한 자백에 따스한 위로를 전해줄거에요!",
  openGraph: {
    title: "잡도리타임",
    description: "오늘 미뤘던 할 일을 자백하고 따스한 위로를 얻어가세요.",
    images: [
      {
        url: "/jabdori.png", 
        width: 1200,
        height: 630,
      },
    ],
  },
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
