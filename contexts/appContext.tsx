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
import { PublicClient, useAccount, useContractRead, usePublicClient, useWaitForTransaction } from "wagmi";
import { Views } from "../pages/_app";
import { useToast } from "@chakra-ui/react";
import { Factory } from "../abi";
import { updateCollectionData } from "../frontend-services/collections";
import { getContractAddress } from "viem";
//Global contexts may be persisted and managed here

export type AppContextType = {
  pendingTx?: `0x${string}`;
  setPendingTx: Dispatch<SetStateAction<`0x${string}` | undefined>>;
  isTxDisabled: boolean;
  setIsTxDisabled: Dispatch<SetStateAction<boolean>>;
  memberships: readonly `0x${string}`[];
  collectionId?: string;
  setCollectionId: Dispatch<SetStateAction<string | undefined>>;
  publicClient:PublicClient
};

export const AppContext = createContext<AppContextType | null>(null);

const AppProvider: NextPage<{ children: ReactNode }> = ({ children }) => {
  const toast = useToast();
  const publicClient = usePublicClient({ chainId: 80001 });
  const {address} = useAccount();
  //Running transaction state, managed locally to ensure multiple transactions are not queued
  //Can be updated to manage a queue instead
  const [pendingTx, setPendingTx] = useState<`0x${string}` | undefined>();
  const [collectionId, setCollectionId] = useState<string | undefined>();

  //Global state for transaction buttons, buttons are disabled when a transaction is pending
  const [isTxDisabled, setIsTxDisabled] = useState<boolean>(false);

  //Hook that waits for a transaction to complete, watches whenever pendingTx is defined
  useWaitForTransaction({
    hash: pendingTx,
    onReplaced: async (data: any) => {},
    onSuccess: async (data: any) => {
      console.log("ABC",collectionId,address)
      if(collectionId&&address)
      {
        const nonce = await publicClient.getTransactionCount({
          address: address,
        });
        const b = BigInt(nonce - 1);
        const contractAddress = await getContractAddress({
          from: address,
          nonce: b,
        });
        updateCollectionData(collectionId,{contractAddress:contractAddress})
      }
      toast({
        position: "top-right",
        title: "Transaction Successful",
        description: "Your transaction has been mined",
        status: "success",
        isClosable: true,
        duration: 5000,
      });
      setPendingTx(undefined);
      setCollectionId(undefined);
      localStorage.setItem("pendingTx", "");
      localStorage.setItem("collectionId", "");
    },
    onError: (error: any) => {
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
      setCollectionId(undefined);
      localStorage.setItem("pendingTx", "");
      localStorage.setItem("collectionId", "");
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
      const localTx = localStorage.getItem("pendingTx");
      const  localCollection= localStorage.getItem("collectionId");
      if (localTx && localTx !== "") {
        setPendingTx(localTx as `0x${string}`);
        if(localCollection && localCollection!=="")
        setCollectionId(localCollection)
        setIsTxDisabled(true);
      } else setIsTxDisabled(false);
    }
  }, [pendingTx]);
  return (
    <AppContext.Provider
      value={{
        pendingTx,
        setPendingTx,
        isTxDisabled,
        setIsTxDisabled,
        memberships,
        collectionId,
        setCollectionId,
        publicClient,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
