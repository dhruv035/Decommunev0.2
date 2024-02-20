import {
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  CardFooter,
  ButtonGroup,
  Button,
  useToast,
  FormLabel,
  Box,
  Flex,
  useMediaQuery,
} from "@chakra-ui/react";
import { useAccount, useContractReads, useContractWrite } from "wagmi";
import { NFT } from "../../abi";
import { useContext, useEffect, useState } from "react";
import { formatEther } from "viem";
import { AppContext, AppContextType } from "../../contexts/appContext";
type Membership = {
  contractData: any;
  metaData: any;
};
const MarketCard = ({
  membership,
  owned = false,
}: {
  membership: Membership;
  owned?: boolean;
}) => {
  const toast = useToast();

  const [isHover] = useMediaQuery(`(hover:hover)`);
  const [imageError, setImageError] = useState(false);
  const { setPendingTx, isTxDisabled, setIsTxDisabled } = useContext(
    AppContext
  ) as AppContextType;

  const { address } = useAccount();
  const nftContract = {
    address: membership.contractData[3],
    abi: NFT,
  };

  const { data, isLoading, error } = useContractReads({
    contracts: [
      {
        ...nftContract,
        functionName: "baseURI",
      },
      {
        ...nftContract,
        functionName: "currentPrice",
      },
    ],
  });

  useEffect(() => {
    // Function to check if the URL points to an image
    const checkImage = async () => {
      try {
        const response = await fetch(membership.metaData.image);
        if (!response.ok) {
          throw new Error("Image not found");
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.startsWith("image")) {
          setImageError(false);
        } else {
          throw new Error("Not an image");
        }
      } catch (error) {
        setImageError(true);
      }
    };

    // Call the function to check the image when the component mounts
    checkImage();
  }, []);
  const { writeAsync: buy } = useContractWrite({
    ...nftContract,
    functionName: "safeMint",
  });

  const handleBuy = async () => {
    //TODO: Add specific alerts for each of the missing data
    if (!address) return;
    if (!data || !data[1]) return;
    if (typeof data[1].result !== "bigint") return;
    setIsTxDisabled(true);
    let hash;
    try {
      const { hash: txHash } = await buy({
        args: [address],
        value: data[1].result,
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
    }
    setPendingTx(hash);
  };
  return (
    <Card
      maxWidth={"90%"}
      backgroundColor="rgb(0, 0, 0,0.7)"
      paddingX={[2, 3, 4]}
      paddingBottom={[6, 8]}
      textColor="teal.400"
      rounded={26}
    >
      <CardBody className="flex flex-col py-6 px-4">
        <Flex
          display="flex"
          minH={[null, null, "100px"]}
          marginBottom={[3, 3, null]}
          alignItems="center"
          justifyContent="center"
        >
          <Heading
            fontWeight="bold"
            textAlign="center"
            noOfLines={[0, 2]}
            height={"fit-content"}
            fontSize={["9vw", "4xl"]}
            lineHeight={1.2}
          >
            {membership.contractData[4]}
          </Heading>
        </Flex>
        <div className="flex flex-wrap w-[100%] aspect-square overflow-clip rounded-full self-center justify-center">
          <Image
            loading="lazy"
            src={
              !imageError
                ? membership.metaData?.image
                : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            }
            alt="Green double couch with wooden legs"
          />
        </div>
        <Stack mt="6" spacing="3">
          <Heading
            textAlign="center"
            color={"yellow.300"}
            fontWeight="bold"
            fontSize={["sm", "md", "xl"]}
          >
            ${membership.contractData[5]}
          </Heading>
          <Text
            textAlign={"justify"}
            noOfLines={3}
            minH={24}
            overflowY={"auto"}
          >
            {membership?.metaData?.desc ??
              "This is a Lorem Ipsum Membership Token, everyone will see a different Image This is a Lorem Ipsum Membership Token, everyone will see a different Image This is a Lorem Ipsum Membership Token, everyone will see a different Image This is a Lorem Ipsum Membership Token, everyone will see a different Image This is a Lorem Ipsum Membership Token, everyone will see a different Image This is a Lorem Ipsum Membership Token, everyone will see a different Image This is a Lorem Ipsum Membership Token, everyone will see a different Image "}
          </Text>
          <Text
            color="green.200"
            fontSize={["sm", "lg", "2xl"]}
            fontWeight={"bold"}
          >
            {formatEther(membership.contractData[1])} MATIC
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      {!owned && (
        <CardFooter display="flex" justifyContent={"center"}>
          <ButtonGroup width={"90%"}>
            <Button
              width="full"
              rounded="full"
              variant="outline"
              _hover={
                !isHover
                  ? {}
                  : {
                      cursor: "pointer",
                      backgroundColor: "teal.400",
                      color: "white",
                    }
              }
              _active={ {
                cursor: "pointer",
                backgroundColor: "teal.400",
                color: "white",
              }}
              color="white"
              backgroundColor="rgb(120,100,120,0.08)"
              onClick={() => {
                handleBuy();
              }}
              isDisabled={isTxDisabled}
            >
              Buy now
            </Button>
          </ButtonGroup>
        </CardFooter>
      )}
    </Card>
  );
};
export default MarketCard;
