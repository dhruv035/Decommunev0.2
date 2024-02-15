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
  useDimensions,
} from "@chakra-ui/react";
import { useSize } from "@chakra-ui/react-use-size";
import { ElementSize } from "@zag-js/element-size";
import GlobalProvider from "../contexts/appContext";
export enum Views {
  HOME = "home",
  CREATE = "create",
  NETWORK = "network",
}
import {
  motion,
  useAnimate,
  useDragControls,
  useMotionValue,
} from "framer-motion";
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
  duration: 0.5,
};
function MyApp({ Component, pageProps }: AppProps) {
  const [isLarger] = useMediaQuery(`(min-width:768)`);
  const [isOpen, setIsOpen] = useState(false);
  const [deltaX, setDeltaX] = useState<number>(0);
  const [scope, animate] = useAnimate();
  const outerRef = useRef<HTMLDivElement | null>(null);
  const data = useSize(outerRef);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeSideBar = () => {
    if(!isOpen)
    return;
    {
      setIsOpen(false);
      animate(
        scope.current,
        { ...sidebarVariants.closed },
        { ...sideBarTransition }
      );
    }
  };

  const openSideBar = (skip?: boolean) => {
    if(isOpen)
    return;
    setIsOpen(true);
    animate(
      scope.current,
      { ...sidebarVariants.open },
      { ...sideBarTransition }
    );
    if (!skip){
      
      setTimeout(() => {
      //  closeSideBar();
      }, 3000);}
  };
  useEffect(() => {
   
   if(isOpen)
    {
      setTimeout(() => {
      closeSideBar();
      }, 3000);
    }
  }, [isOpen]);
  useEffect(()=>{
    openSideBar();
  },[])

  function debounce(func: any, delay: any) {
    let timeoutId: any;
    return function (...args: any) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }

  return (
    <WagmiConfig config={wagmiConfig}>
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <RainbowKitSiweNextAuthProvider
          getSiweMessageOptions={getSiweMessageOptions}
        >
          <RainbowKitProvider chains={chains}>
            <ChakraBaseProvider theme={theme}>
              <GlobalProvider>
                <motion.div
                  ref={outerRef}
                  style={{ touchAction: "none" }}
                  className="fixed top-0 left-0 right-0 bottom-0 flex flex-row bg-[url('/backgroundNew.jpeg')] bg-cover overflow-hidden w-full"
                  onScroll={(e) => {
                  }}
                  onTouchStart={(e) => {
                    setDeltaX(e.changedTouches[0].pageX);
                  }}
                  onTouchMove={(e) => {
                    //  return;
                    if (deltaX === 0) return;

                    if (e.changedTouches[0].pageX - deltaX > 30) {
                      openSideBar();
                    } else if (e.changedTouches[0].pageX - deltaX < -30) {
                      closeSideBar();
                    }
                  }}
                  onTouchEnd={(e) => {
                    setDeltaX(0);
                  }}
                >
                  <div
                    ref={containerRef}
                    onPointerEnter={() => {
                      openSideBar(true);
                    }}
                    onPointerLeave={() => {
                      closeSideBar();
                    }}
                    className="fixed flex flex-row-reverse h-full inset-x-[-5rem] w-40 xs:inset-x-[-6rem] xs:w-48 sm:inset-x-[-7rem] sm:w-56 z-[100]" // md:inset-x-[-76.8px] md:w-[153.6px]
                  >
                    <motion.div
                      ref={scope}
                      className="relative h-full w-20 xs:w-24 sm:w-28 z-[100]" // md:w-[76.8px]
                      initial="closed"
                      variants={sidebarVariants}
                    >
                      <Sidebar windowData={data} />
                    </motion.div>
                  </div>
                  <div className=" scrollbar-hidden flex overflow-y-auto z-[0] justify-center w-full">
                    <Component {...pageProps} />
                  </div>
                </motion.div>
              </GlobalProvider>
            </ChakraBaseProvider>
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}

export default MyApp;
