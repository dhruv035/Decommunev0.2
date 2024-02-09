import dynamic from "next/dynamic";
import type { NextPage } from "next";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  setPendingTx: Dispatch<SetStateAction<`0x${string}` | undefined>>;
  isTxDisabled: boolean;
  setIsTxDisabled: Dispatch<SetStateAction<boolean>>;
};
export const TxContext = createContext({} as TxContextType);
const Home: NextPage = () => {
  const flowContext = useContext(FlowContext);
  const toast = useToast();
  const [pendingTx, setPendingTx] = useState<`0x${string}` | undefined>();
  const [isTxDisabled, setIsTxDisabled] = useState<boolean>(false);

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
    onError: (data: any) => {
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

  useEffect(() => {
    if (pendingTx) {
      setIsTxDisabled(true);
    } else {
      const abc = localStorage.getItem("pendingTx");
      if (abc && abc !== "") {
        setPendingTx(abc as `0x${string}`);
        setIsTxDisabled(true);
      } else setIsTxDisabled(false);
    }
  }, [pendingTx]);
  return (
    <div className=" pt-6 flex flex-col w-full flex-wrap max-w-[vw] bg-cover items-center">
      <TxContext.Provider
        value={{ pendingTx, setPendingTx, isTxDisabled, setIsTxDisabled }}
      >
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
};
export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});

//Listing Section: Display all memberships available for purchase on the platform
const Listing = ({
  memberships,
}: {
  memberships: readonly `0x${string}`[];
}) => {
  const { address } = useAccount();
  const [membershipData, setMembershipData] = useState<any[]>([]);
  const getMembershipData = useCallback(async () => {
    if (!address) return;
    const contracts = await Promise.all(
      memberships.map(async (membership) => {
        const balance = readContract({
          address: membership,
          abi: NFT,
          functionName: "balanceOf",
          args: [address],
        });
        const currentPrice = readContract({
          address: membership,
          abi: NFT,
          functionName: "currentPrice",
        });
        const baseURI = readContract({
          address: membership,
          abi: NFT,
          functionName: "baseURI",
        });
        return Promise.all([balance, currentPrice, baseURI, membership]);
      })
    );

    const metaDatas = await Promise.all(
      contracts.map(async (contract) => {
        try {
          const data = await fetch(contract[2]);
          return data;
        } catch (error) {
          return undefined;
        }
      })
    )
      .then(async (res) => {
        return await Promise.all(
          res.map(async (element) => {
            if (!element) return {};
            if (element.status === 200) {
              let data;
              try {
                return element.json();
              } catch (error) {}
            }
          })
        );
      })
      .then((res) => {
        return res.map((element, index) => {
          const data = contracts[index];

          return {
            contractData: data,
            metaData: element,
          };
        });
      });

    setMembershipData(metaDatas);
  }, [memberships]);

  useEffect(() => {
    getMembershipData();
  }, [memberships]);
  const nftContract = {
    address: address,
    abi: NFT,
  };
  return (
    <div className=" pt-6 flex flex-col w-full max-w-[94vw] bg-cover">
      <div className="flex justify-center">
        <Search />
      </div>
      <SimpleGrid className="mt-10 ml-10 " columns={[1, 3]} spacing={12}>
        {membershipData.map((membership, index) => {
          return (
            <div key={index}>
              <MarketCard membership={membership} />
            </div>
          );
        })}
      </SimpleGrid>
    </div>
  );
};

//Network: Your Memberships as Creator/Member
const Network = ({
  memberships,
}: {
  memberships: readonly `0x${string}`[];
}) => {
  const { address } = useAccount();
  const [membershipData, setMembershipData] = useState<any[]>([]);
  const getMembershipData = useCallback(async () => {
    if (!address) return;
    const contracts = await Promise.all(
      memberships.map(async (membership) => {
        const balance = readContract({
          address: membership,
          abi: NFT,
          functionName: "balanceOf",
          args: [address],
        });
        const currentPrice = readContract({
          address: membership,
          abi: NFT,
          functionName: "currentPrice",
        });
        const baseURI = readContract({
          address: membership,
          abi: NFT,
          functionName: "baseURI",
        });
        return Promise.all([balance, currentPrice, baseURI, membership]);
      })
    ).then((res) => {
      return res.filter((element) => {
        return Number(element[0]) > 0;
      });
    });

    const metaDatas = await Promise.all(
      contracts.map(async(contract) => {
        try {
          const data = await fetch(contract[2])
          return data
        }
        catch(error){
          return undefined
        }
      })
    )
      .then(async (res) => {
        return await Promise.all(
          res.map(async (element) => {
            if(!element)
            return
            if (element.status === 200) {
              let data;
              try {
                return element.json();
              } catch (error) {}
            }
          })
        );
      })
      .then((res) => {
        return res.map((element, index) => {
          const data = contracts[index];

          return {
            contractData: data,
            metaData: element,
          };
        });
      });

    setMembershipData(metaDatas);
  }, [memberships]);

  useEffect(() => {
    getMembershipData();
  }, [memberships]);
  return (
    <div className=" pt-6 flex flex-col w-full max-w-[94vw] bg-cover">
    <div className="flex justify-center">
      <Search />
    </div>
    <SimpleGrid className="mt-10 ml-10 " columns={[1, 3]} spacing={12}>
      {membershipData.map((membership, index) => {
        return (
          <div key={index}>
            <MarketCard membership={membership} />
          </div>
        );
      })}
    </SimpleGrid>
  </div>
  );
};

//Create Section: Create New Memberships
const Create = () => {
  const toast = useToast();
  const [step, setStep] = useState<boolean>(false);
  const [collectionId, setCollectionId] = useState<string | undefined>();
  const { address } = useAccount();
  const { pendingTx, setPendingTx, isTxDisabled, setIsTxDisabled } =
    useContext(TxContext);
  const { writeAsync: deployNFT } = useContractWrite({
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
    abi: Factory,
    functionName: "newMembership",
  });

  const metaFormik = useFormik({
    initialValues: {
      collectionName: "",
      desc: "",
      image: "",
      attributes: {},
    },
    onSubmit: async (values) => {
      if (!process.env.NEXT_PUBLIC_BASE_URL) return;
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/collection",
        {
          method: "POST",
          body: JSON.stringify(values),
        }
      );
      const data = await res.json();
      setCollectionId(data.id);
      setStep(true);
    },
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      symbol: "",
      price: 0,
      incremental: true,
    },
    onSubmit: async (values) => {
      if (!collectionId) return;
      if (!address) return;
      if (!process.env.NEXT_PUBLIC_BASE_URL) return;
      setIsTxDisabled(true);
      let hash;
      try {
        const { hash: txHash } = await deployNFT({
          args: [
            address,
            values.name,
            values.symbol,
            process.env.NEXT_PUBLIC_BASE_URL +
              "/collection/" +
              collectionId +
              "/",
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

  return (
    <div className=" pt-6 flex flex-col w-full max-w-[94vw] bg-cover items-center">
      <div className="text-transparent font-poppins bg-clip-text bg-kyoto text-[30px] sm:text-[40px] text-center md:text-[50px] font-bold">
        Create a New Membership
      </div>

      {!step ? (
        <div>
          <form
            className="mt-10 flex flex-col p-4 py-10 w-4/5 bg-candy min-h-[20vh] max-w-[500px] rounded-[40px] space-y-4"
            onSubmit={metaFormik.handleSubmit}
          >
            <FormControl isRequired>
              <FormLabel fontSize={[12, 18]} fontWeight={"bold"}>
                Collection Name
              </FormLabel>
              <Input
                id="collectionName"
                name="collectionName"
                type="string"
                backgroundColor="yellow.400"
                onChange={metaFormik.handleChange}
                maxWidth={"400px"}
                value={metaFormik.values.collectionName}
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
                onChange={metaFormik.handleChange}
                maxWidth={"400px"}
                value={metaFormik.values.desc}
              ></Textarea>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize={[12, 18]} fontWeight={"bold"}>
                Image URL
              </FormLabel>
              <Input
                id="image"
                name="image"
                type="string"
                backgroundColor="yellow.400"
                onChange={metaFormik.handleChange}
                maxWidth={"400px"}
                value={metaFormik.values.image}
              ></Input>
            </FormControl>
            <Button type="submit">Proceed</Button>
          </form>
        </div>
      ) : (
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
          <Button type="submit" isDisabled={isTxDisabled}>
            Deploy
          </Button>
        </form>
      )}
    </div>
  );
};
