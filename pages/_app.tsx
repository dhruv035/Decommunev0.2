import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Sidebar } from "../components/HUD";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import {
  ChakraBaseProvider,
  extendBaseTheme,
  theme as chakraTheme,
} from "@chakra-ui/react";

import AppProvider from "../contexts/appContext";
export enum Views {
  HOME = "home",
  CREATE = "create",
  NETWORK = "network",
}


const { Button, FormLabel, Input, Form, Textarea, Checkbox, Alert, Tooltip } =
  chakraTheme.components;

const theme = extendBaseTheme({
  components: {
    Button,
    FormLabel,
    Input,
    Form,
    Textarea,
    Checkbox,
    Alert,
    Tooltip
  },
});

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: "Test",
  projectId: "f887839b2eba0461bf45c8c92509a608",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to my RainbowKit app",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    
      <WagmiConfig config={wagmiConfig}>
        <SessionProvider refetchInterval={0} session={pageProps.session}>
          <RainbowKitSiweNextAuthProvider
            getSiweMessageOptions={getSiweMessageOptions}
          >
            <RainbowKitProvider chains={chains}>
              <ChakraBaseProvider theme={theme}>
                <AppProvider>
                <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-row bg-[url('/background.jpg')] bg-cover overflow-hidden">
                  <Sidebar />
                  <div className=" pl-[20vw] md:pl-[10vw] flex overflow-y-auto w-full">
                  <Component {...pageProps} />
                  </div>
                </div>
                </AppProvider>
              </ChakraBaseProvider>
            </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </SessionProvider>
      </WagmiConfig>
   
  );
}

export default MyApp;
