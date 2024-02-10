import { NextPage } from "next";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useContractRead, useWaitForTransaction } from "wagmi";
import { Views } from "../pages/_app";
import { useToast } from "@chakra-ui/react";
import { Factory } from "../abi";


//Global contexts may be persisted and managed here


export type AppContextType = {
  pendingTx?: `0x${string}`;
  setPendingTx: Dispatch<SetStateAction<`0x${string}` | undefined>>;
  isTxDisabled: boolean;
  setIsTxDisabled: Dispatch<SetStateAction<boolean>>;
  memberships: readonly `0x${string}`[];
};

export const AppContext = createContext<AppContextType | null>(null);

const AppProvider: NextPage<{ children: ReactNode }> = ({ children }) => {

  const toast = useToast();

  //Running transaction state, managed locally to ensure multiple transactions are not queued
  //Can be updated to manage a queue instead
  const [pendingTx, setPendingTx] = useState<`0x${string}` | undefined>();    
  
  //Global state for transaction buttons, buttons are disabled when a transaction is pending
  const [isTxDisabled, setIsTxDisabled] = useState<boolean>(false);

  //Hook that waits for a transaction to complete, watches whenever pendingTx is defined
  useWaitForTransaction({
    hash: pendingTx,
    onReplaced: async (data: any) => {},
    onSuccess: async (data: any) => {
      toast({
        position: "top-right",
        title: "Transaction Successful",
        description: "Your transaction has been mined",
        status: "success",
        isClosable: true,
        duration: 5000,
      });
      setPendingTx(undefined);
      localStorage.setItem("pendingTx", "");
    },
    onError: (error: any) => {
      console.log("ERR", error);
      const firstLine = error.message.split(".")[0];
      toast({
        position: "top-right",
        title: "Transaction Reverted",
        description: firstLine,
        status: "error",
        isClosable: true,
        duration: 5000,
      });
      setPendingTx(undefined);
      localStorage.setItem("pendingTx", "");
    },
  });

  //Watch factory contract for list of memberships
  //Can be updated to cache data and trigger refetches only on relevant transactions or after a set time
  const { data, error, isLoading } = useContractRead({
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
    abi: Factory,
    functionName: "getAllMemberships",
    watch: true,
  });

  //Global list of memberships on the factory contract
  const memberships = data?.length && data.length > 0 ? data : [];


  //Update button status
  useEffect(() => {
    if (pendingTx) {
      setIsTxDisabled(true);
    } else {
      //Using localStorage to persist pending transactions on refresh as well
      const abc = localStorage.getItem("pendingTx");
      if (abc && abc !== "") {
        setPendingTx(abc as `0x${string}`);
        setIsTxDisabled(true);
      } else setIsTxDisabled(false);
    }
  }, [pendingTx]);
  console.log("PendingTx");
  return (
    <AppContext.Provider
      value={{
        pendingTx,
        setPendingTx,
        isTxDisabled,
        setIsTxDisabled,
        memberships,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
