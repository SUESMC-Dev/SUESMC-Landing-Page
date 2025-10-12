import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { ThemeContextProvider } from '@/contexts/theme';
import { MessageContextProvider } from "@/contexts/message";

import "@/styles/globals.scss";

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <MessageContextProvider>
      <ThemeContextProvider>
        <Component {...pageProps} /> 
      </ThemeContextProvider>
    </MessageContextProvider>
  )
}
