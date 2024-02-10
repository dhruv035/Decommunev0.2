import { Button, Checkbox, FormControl, FormLabel, Input, Textarea, useToast } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { useAccount, useContractWrite } from "wagmi";
import { AppContext, AppContextType } from "../contexts/appContext";
import { Factory } from "../abi";
import { useFormik } from "formik";
import { parseEther } from "viem";
import { NextPage } from "next";

const Create = () => {
    const toast = useToast();
    const [step, setStep] = useState<boolean>(false);
    const [collectionId, setCollectionId] = useState<string | undefined>();
    const { address } = useAccount();
    const { pendingTx, setPendingTx, isTxDisabled, setIsTxDisabled } = useContext(
      AppContext
    ) as AppContextType;
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
          setIsTxDisabled(false);
          return;
        }
  
        setPendingTx(hash);
        localStorage.setItem("pendingTx", hash as string);
      },
    });
  
    return (
      <div className=" pt-6 flex flex-col w-full max-w-[94vw] bg-cover items-center">
        <div className="text-transparent font-kenia bg-clip-text bg-kyoto text-[30px] sm:text-[40px] text-center md:text-[50px] font-bold">
          Create a New Membership
        </div>
  
        {!step ? (
          
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
  
  export default Create