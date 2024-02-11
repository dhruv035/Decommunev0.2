import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Textarea,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { useAccount, useContractWrite } from "wagmi";
import { AppContext, AppContextType } from "../contexts/appContext";
import { Factory } from "../abi";
import { useFormik } from "formik";
import { parseEther } from "viem";
import { NextPage } from "next";
import TagInput from "../components/TagInput";
import { IoIosArrowBack } from "react-icons/io";

const Create: NextPage = () => {
  const toast = useToast();

  const [step, setStep] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [isHover] = useMediaQuery(`(hover:hover)`);
  const { address } = useAccount();

  const { setPendingTx, isTxDisabled, setIsTxDisabled } = useContext(
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
    },
    onSubmit: async () => {
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
      if (!address) return;
      if (!process.env.NEXT_PUBLIC_BASE_URL) return;

      setIsTxDisabled(true);
      let hash;
      try {
        //Create database entry for metadata.
        //BUG:Sometimes the data will be uploaded and transaction will fail
        //TODO:Reuse previously uploaded collections for metadata in case of transaction reverts, handle uploaded metadata collections more elegantly

        const res = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL + "/collection",
          {
            method: "POST",
            body: JSON.stringify({ ...metaFormik.values, tags }),
          }
        );
        const data = await res.json();
        const { hash: txHash } = await deployNFT({
          args: [
            address,
            values.name,
            values.symbol,
            process.env.NEXT_PUBLIC_BASE_URL + "/collection/" + data.id + "/",
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
      } catch (error: any) {
        const firstLine = error.message.split(".")[0];
        toast({
          position: "top-right",
          title: "Transaction error",
          description: firstLine,
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
    <div className=" pt-6 flex flex-col w-full max-w-[92vw] bg-cover items-center">
      <div className="text-transparent bg-clip-text bg-kyoto text-[30px] sm:text-[40px] text-center md:text-[50px] font-bold">
        Create a New Membership
      </div>

      <div className="h-full w-[80%] max-w-[600px]">
        {!step ? (
          <form
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault(); //Make the enter key work for the filter box only
            }}
            className="my-10 flex flex-col px-6 py-10 bg-[rgba(0,0,0,0.6)] items-center text-white min-h-[600px] rounded-[40px] space-y-14"
            onSubmit={metaFormik.handleSubmit}
          >
            <FormLabel fontSize={[20, 26, 34]}>Welcome aboard!</FormLabel>
            <FormControl isRequired>
              <FormLabel>Collection Name</FormLabel>
              <Input
                mb={2}
                id="collectionName"
                name="collectionName"
                type="string"
                variant="flushed"
                placeholder="My Super Awesome Collection..."
                backgroundColor="transparent"
                opacity={0.8}
                onChange={metaFormik.handleChange}
                value={metaFormik.values.collectionName}
              ></Input>
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>ImageUrl</FormLabel>
              <Input
                mb={2}
                id="image"
                name="image"
                type="string"
                variant="flushed"
                placeholder="https://picsum.photos/400/200"
                backgroundColor="transparent"
                opacity={0.8}
                onChange={metaFormik.handleChange}
                value={metaFormik.values.image}
              ></Input>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                id="desc"
                name="desc"
                variant="ghost"
                placeholder={"Give us the incredible details!"}
                onChange={metaFormik.handleChange}
                backgroundColor="rgb(0,0,5,0.45)"
                opacity={0.8}
                value={metaFormik.values.desc}
              ></Textarea>
            </FormControl>
            <FormLabel alignSelf="start" fontSize={[18, 22, 26]}>
              Add some trending tags!
            </FormLabel>
            <div className="flex w-full">
              <TagInput
                tags={tags}
                setTags={setTags}
                placeholder={"Add a Tag"}
              />
            </div>
            <Button
              variant="outline"
              _hover={
                !isHover
                  ? {}
                  : {
                      borderColor: "white",
                      backgroundColor: "teal.800",
                      color: "white",
                    }
              }
              _active={{
                borderColor: "white",
                backgroundColor: "teal.800",
                color: "white",
              }}
              color="white"
              rounded="full"
              w="full"
              type="submit"
            >
              Proceed
            </Button>
          </form>
        ) : (
          <form
            className="relative my-10 flex flex-col px-6 pb-10 bg-[rgba(0,0,0,0.6)] items-center text-white min-h-[600px] rounded-[40px] space-y-14"
            onSubmit={formik.handleSubmit}
          >
            <IconButton
              icon={<IoIosArrowBack />}
              aria-label={""}
              backgroundColor="transparent"
              color="white"
              _hover={{
                backgroundColor: "transparent",
                color: "red.400",
              }}
              position={"absolute"}
              top={6}
              left={4}
              fontSize={[16, 24, 32]}
              onClick={() => setStep(false)}
            />

            <Heading mt={0} fontSize={[20, 26, 34]}>
              Token Details
            </Heading>

            <FormControl isRequired>
              <FormLabel fontSize={[12, 18]} fontWeight={"bold"}>
                Token Name
              </FormLabel>

              <Input
                id="name"
                name="name"
                type="string"
                variant="flushed"
                mb={4}
                backgroundColor="transparent"
                opacity={0.8}
                onChange={formik.handleChange}
                value={formik.values.name}
              ></Input>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize={[12, 18]} fontWeight={"bold"}>
                Token Symbol
              </FormLabel>
              <Input
                mb={4}
                id="symbol"
                name="symbol"
                variant="flushed"
                backgroundColor="transparent"
                opacity={0.8}
                onChange={formik.handleChange}
                value={formik.values.symbol}
              ></Input>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize={[12, 18]} fontWeight={"bold"}>
                Price {"(in MATIC)"}
              </FormLabel>
              <Input
                mb={4}
                id="price"
                name="price"
                type="number"
                variant="flushed"
                backgroundColor="transparent"
                opacity={0.8}
                onChange={formik.handleChange}
                value={formik.values.price}
              ></Input>
            </FormControl>

            <div className="flex flex-row mb-4 self-start">
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
            <Button
              variant="outline"
              _hover={
                !isHover
                  ? {}
                  : {
                      borderColor: "white",
                      backgroundColor: "teal.800",
                      color: "white",
                    }
              }
              _active={{
                borderColor: "white",
                backgroundColor: "teal.800",
                color: "white",
              }}
              color="white"
              rounded="full"
              w="full"
              type="submit"
            >
              Deploy
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Create;
