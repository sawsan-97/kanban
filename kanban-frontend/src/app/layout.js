"use client";

import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import { store } from "@/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <ThemeProvider attribute="class">{children}</ThemeProvider>
          </Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
