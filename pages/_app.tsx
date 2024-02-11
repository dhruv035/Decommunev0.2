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
  useMediaQuery,
} from "@chakra-ui/react";

import AppProvider from "../contexts/appContext";
export enum Views {
  HOME = "home",
  CREATE = "create",
  NETWORK = "network",
}
import { motion, useAnimate, useDragControls, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
    Tooltip,
  },
});

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [publicProvider()]
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


const sidebarVariants = {
  open: { x: 0 },
  closed: { x: "-100%" },
};

const sideBarTransition = {
   duration: 0.5 
}
function MyApp({ Component, pageProps }: AppProps) {
  const [isLargerThan768]= useMediaQuery(`(min-width:768px)`)
  const [isOpen, setIsOpen] = useState(false);
  const [scope,animate]=useAnimate()
  
  const containerRef=useRef<HTMLDivElement|null>(null)
  const closeSideBar=()=>{
    setIsOpen(false);
    //animate(scope.current,{...sidebarVariants.closed},{...sideBarTransition})
    
  }
  const openSideBar=()=>{
    console.log("ABC")
    setIsOpen(true);
    animate(scope.current,{...sidebarVariants.open},{...sideBarTransition})
   
  }

  console.log("isOpen",isOpen)
  return (
    <WagmiConfig config={wagmiConfig}>
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <RainbowKitSiweNextAuthProvider
          getSiweMessageOptions={getSiweMessageOptions}
        >
          <RainbowKitProvider chains={chains}>
            <ChakraBaseProvider theme={theme}>
              <AppProvider>
                <motion.div
                style={{touchAction:"none"}}
                  className="fixed top-0 left-0 right-0 bottom-0 flex flex-row bg-[url('/background.jpg')] bg-cover overflow-hidden"
                  onPanStart={(e,pointInfo)=>{
                    if(pointInfo.offset.x>0)
                    openSideBar();
                    else
                    closeSideBar();
                  }}
                  
                  onTouchEnd={(e)=>{
                   
                    if(isOpen)
                    setTimeout(closeSideBar,2000)
                  }}
                >
                  
                  <div ref={containerRef} className="fixed flex flex-row-reverse inset-x-[-8vw]  h-full w-[16vw]">
                  <motion.div
                 
                  ref={scope}
                    className="relative h-full w-[8vw]"
                    dragConstraints={containerRef}
                    variants={isLargerThan768?undefined:sidebarVariants}
                  >
                    <Sidebar />
                  </motion.div>
                  </div>
                  <div className=" pl-[6vw] scrollbar-hidden flex overflow-y-auto w-full">
                    <Component {...pageProps} />
                  </div>
                </motion.div>
              </AppProvider>
            </ChakraBaseProvider>
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}

export default MyApp;
