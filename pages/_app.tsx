import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { GetSiweMessageOptions, RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import {SessionProvider} from 'next-auth/react';
import type { AppProps } from 'next/app';
import { Sidebar } from '../components/HUD';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  polygonMumbai,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import {
  ChakraBaseProvider,
  extendBaseTheme,
  theme as chakraTheme,
} from '@chakra-ui/react'
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

export enum Views {
  HOME="home",
  CREATE="create",
  NETWORK="network"
}

type FlowContextType={
  flow?:Views,
  handleChange?:any
}

export const FlowContext = createContext({} as FlowContextType)
const { Button } = chakraTheme.components

const theme = extendBaseTheme({
  components: {
    Button,
  },
})

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    polygonMumbai
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Test',
  projectId: 'f887839b2eba0461bf45c8c92509a608',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to my RainbowKit app',
});

function MyApp({ Component, pageProps }: AppProps) {
  const [flow,setFlow] = useState<Views>(Views.HOME)
  const handleChange = (newFlow:Views)=>{
    setFlow(newFlow)
  }
  return (
    <FlowContext.Provider value={{flow:flow,handleChange}}>
    <WagmiConfig config={wagmiConfig}>
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
      <RainbowKitProvider chains={chains}>
        <ChakraBaseProvider theme={theme}>
          
        <div className="flex flex-row min-h-[100vh] w-full bg-[url('/background.jpg')] bg-cover">
        <Sidebar/>
        <Component {...pageProps} />
        </div>
        </ChakraBaseProvider>
      </RainbowKitProvider>
      </RainbowKitSiweNextAuthProvider>
        </SessionProvider>
    </WagmiConfig>
    </FlowContext.Provider>
  );
}

export default MyApp;
