import dynamic from "next/dynamic";
import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { MarketCard } from "../components/General";
import { Factory, NFT } from "../abi";
import { useContext, createContext } from "react";
import { FlowContext } from "./_app";
import Search from "../components/Search";
import { useFormik } from "formik";
import { parseEther } from "viem";
import { readContract } from "@wagmi/core";

export type TxContextType = {
  pendingTx?: `0x${string}`;
  setPendingTx?: any;
};
export const TxContext = createContext({} as TxContextType);
const Home: NextPage = () => {
  const flowContext = useContext(FlowContext);
  const toast = useToast();
  const [pendingTx, setPendingTx] = useState<`0x${string}` | undefined>();
  const { data: txData, error: pendingError } = useWaitForTransaction({
    hash: pendingTx,
    onReplaced: async (data: any) => {
      console.log("REPLACED", data);
    },
    onSuccess: async (data: any) => {
      console.log("SUCCESS", data);
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
    onError: (data: any) => {
      console.log("Error", data);
      toast({
        position: "top-right",
        title: "Transaction Reverted",
        description: "Your transaction has failed. Please retry",
        status: "error",
        isClosable: true,
        duration: 5000,
      });
      setPendingTx(undefined);
      localStorage.setItem("pendingTx", "");
    },
  });
  const { data, error, isLoading } = useContractRead({
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
    abi: Factory,
    functionName: "getAllMemberships",
    watch: true,
  });

  const memberships = useMemo<readonly `0x${string}`[]>(() => {
    if (data?.length && data.length > 0) return data;
    else return [];
  }, [data]);

  return (
    <div className=" pt-6 flex flex-col w-full max-w-[94vw] bg-cover items-center">
      <TxContext.Provider value={{pendingTx,setPendingTx}}>
        {flowContext.flow === "home" ? (
          <Listing memberships={memberships} />
        ) : flowContext.flow === "network" ? (
          <Network memberships={memberships} />
        ) : (
          <Create />
        )}
      </TxContext.Provider>
    </div>
  );
  if (flowContext.flow === "home") return <Listing memberships={memberships} />;
  if (flowContext.flow === "network")
    return <Network memberships={memberships} />;
  if (flowContext.flow === "create") return <Create />;
};
export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});

const Listing = ({
  memberships,
}: {
  memberships: readonly `0x${string}`[];
}) => {
  return (
    <div className=" pt-6 flex flex-col w-full max-w-[94vw] bg-cover">
      <div className="flex justify-center">
        <Search />
      </div>
      <SimpleGrid className="mt-10 ml-10 " columns={[1, 3]} spacing={12}>
        {memberships.map((membership, index) => {
          return (
            <div key={index}>
              <MarketCard address={membership} />
            </div>
          );
        })}
      </SimpleGrid>
    </div>
  );
};
const Network = ({
  memberships,
}: {
  memberships: readonly `0x${string}`[];
}) => {
  const network = useMemo(async () => {
    if (!memberships) return;
    const data = await Promise.all(
      memberships.map(async (membership) => {
        return readContract({
          address: membership,
          abi: NFT,
          functionName: "balanceOf",
          args: [membership],
        });
      })
    );
    console.log("Data", data);
  }, [memberships]);
  return (
    <div className=" pt-6 flex flex-col w-full min-w-[94vw] bg-cover">
      <div className="flex justify-center">
        <Search />
      </div>
      <SimpleGrid className="mt-10 ml-10 " columns={[1, 3]} spacing={12}>
        {memberships.map((membership, index) => {
          return (
            <div key={index}>
              <MarketCard address={membership} />
            </div>
          );
        })}
      </SimpleGrid>
    </div>
  );
};
const Create = () => {
  const toast = useToast();

  const { address } = useAccount();
  const {pendingTx,setPendingTx} = useContext(TxContext)
  const { writeAsync: deployNFT } = useContractWrite({
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
    abi: Factory,
    functionName: "newMembership",
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      symbol: "",
      desc: "",
      price: 0,
      incremental: true,
    },
    onSubmit: async (values) => {
      if (!address) return;

      let hash;
      try {
        const { hash: txHash } = await deployNFT({
          args: [
            address,
            values.name,
            values.symbol,
            values.desc,
            parseEther(values.price.toString()),
            values.incremental,
          ],
        });
        hash = txHash;
        toast({
          position: "top-right",
          title: "Transaction Submitted",
          description: "Your transaction has been submitted",
          status: "loading",
          isClosable: true,
          duration: 5000,
        });
      } catch (error) {
        toast({
          position: "top-right",
          title: "Transaction error",
          description: "Error submitting your transaction",
          status: "error",
          isClosable: true,
          duration: 5000,
        });
        return;
      }

      setPendingTx(hash);
      localStorage.setItem("pendingTx", hash as string);
    },
  });

  useEffect(() => {
    console.log("PendingTx Changed", pendingTx);
    if (pendingTx) {
    } else {
      const abc = localStorage.getItem("pendingTx");
      if (abc && abc !== "") {
        setPendingTx(abc as `0x${string}`);
      }
    }
  }, [pendingTx]);

  return (
    <div className=" pt-6 flex flex-col w-full max-w-[94vw] bg-cover items-center">
      <div className="text-transparent font-poppins bg-clip-text bg-kyoto text-[30px] sm:text-[40px] text-center md:text-[50px] font-bold">
        Create a New Membership
      </div>

      <form
        className="mt-10 flex flex-col p-4 py-10 w-4/5 bg-candy min-h-[20vh] max-w-[500px] rounded-[40px] space-y-4"
        onSubmit={formik.handleSubmit}
      >
        <FormControl isRequired>
          <FormLabel fontSize={[12, 18]} fontWeight={"bold"}>
            Token Name
          </FormLabel>
          <Input
            id="name"
            name="name"
            type="string"
            backgroundColor="yellow.400"
            onChange={formik.handleChange}
            maxWidth={"400px"}
            value={formik.values.name}
          ></Input>
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize={[12, 18]} fontWeight={"bold"}>
            Token Symbol
          </FormLabel>
          <Input
            id="symbol"
            name="symbol"
            type="string"
            backgroundColor="yellow.400"
            onChange={formik.handleChange}
            maxWidth={"400px"}
            value={formik.values.symbol}
          ></Input>
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize={[12, 18]} fontWeight={"bold"}>
            Description
          </FormLabel>
          <Textarea
            id="desc"
            name="desc"
            backgroundColor="yellow.400"
            onChange={formik.handleChange}
            maxWidth={"400px"}
            value={formik.values.desc}
          ></Textarea>
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize={[12, 18]} fontWeight={"bold"}>
            Price {"(in MATIC)"}
          </FormLabel>
          <Input
            id="price"
            name="price"
            type="number"
            backgroundColor="yellow.400"
            onChange={formik.handleChange}
            maxWidth={"400px"}
            value={formik.values.price}
          ></Input>
        </FormControl>

        <div className="flex flex-row">
          <FormLabel fontSize={[12, 18]} fontWeight={"bold"} mb={0}>
            Incremental Pricing:
          </FormLabel>
          <Checkbox
            id="incremental"
            name="incremental"
            isChecked={formik.values.incremental}
            onChange={formik.handleChange}
          />
        </div>
        <Button type="submit">Deploy</Button>
      </form>
    </div>
  );
};
