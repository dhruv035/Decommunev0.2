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
import { motion, useAnimate, useDragControls, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

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
  closed: { x: "-100%", transition: { delay: 0.5, duration: 0.8 } },
};
function MyApp({ Component, pageProps }: AppProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scope,animate]=useAnimate()
  const controls = useDragControls();
  const dragX = useMotionValue(0);

  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    controls.start(e);
  };
  useEffect(() => {
    if (!isDragging) {
      console.log("TRIGER");
      const timeout = setTimeout(() => {
        console.log("TIMEOUT");
        setIsOpen(false);
        animate(scope.current,{...sidebarVariants.closed},{...sidebarVariants.closed.transition})
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [isDragging, isOpen]);
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
                  className="fixed top-0 left-0 right-0 bottom-0 flex flex-row bg-[url('/background.jpg')] bg-cover overflow-hidden"
                  onPointerDown={(e) => handleDragStart(e)}
                  onTouchEnd={() => {
                    
                    setIsDragging(false);
                  }}
                >
                  <motion.div
                  ref={scope}
                    className="fixed h-full min-w-[3vw]"
                    dragControls={controls}
                    dragElastic={1}
                    drag="x"
                    dragConstraints={{ left: isOpen ? -200 : 0, right: 0 }}
                    animate={isOpen ? "open" : "closed"}
                    variants={sidebarVariants}
                  >
                    <Sidebar />
                  </motion.div>
                  <div className=" pl-[20vw] md:pl-[10vw] scrollbar-hidden flex overflow-y-auto w-full">
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
