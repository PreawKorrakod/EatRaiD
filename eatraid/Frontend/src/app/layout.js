import "./globals.css";
import * as React from "react";
import { NextUIProvider } from "@nextui-org/react";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextUIProvider>
          {children}
        </NextUIProvider>
      </body>
    </html>
  );
}
