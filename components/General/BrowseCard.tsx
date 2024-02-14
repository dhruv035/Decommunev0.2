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
  transition,
  IconButton,
} from "@chakra-ui/react";
import { useAccount, useContractReads, useContractWrite } from "wagmi";
import { NFT } from "../../abi";
import { useContext, useEffect, useState } from "react";
import { formatEther } from "viem";
import { AppContext, AppContextType } from "../../contexts/appContext";
import { motion } from "framer-motion";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import DC2 from "../../public/DC2.jpg";
import { ConnectButton } from "@rainbow-me/rainbowkit";

type Membership = {
  contractData: any;
  metaData: any;
};
const BrowseCard = ({
  membership,
  owned = false,
}: {
  membership: Membership;
  owned?: boolean;
}) => {
  const toast = useToast();

  const [hasHover] = useMediaQuery(`(hover:hover)`);
  const [imageError, setImageError] = useState(false);
  const [hover, setHover] = useState(false);
  const { setPendingTx, isTxDisabled, setIsTxDisabled } = useContext(
    AppContext
  ) as AppContextType;

  const { address } = useAccount();
  const nftContract = {
    address: membership.contractData.contractAddress,
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
    <motion.div
      layout
      initial={{ scale: 1 }}
      animate={hover ? { scale: 1.2 } : { scale: 1 }}
      transition={{ type: "spring", duration: 0.7 }}
      onMouseEnter={(e) => {
        if (!hover) setHover(true);
      }}
      onMouseLeave={(e) => {
        if (hover) setHover(false);
      }}
      className={
        "min-w-[400px] bg-[rgba(0,0,0,0.7)] text-blue-400 rounded-xl relative h-fit hover:z-[400]"
      }
    >
      <Heading
        position={"absolute"}
        textAlign="center"
        color={"yellow.300"}
        fontWeight="bold"
        top={2}
        left={2}
        fontSize={["sm", "md", "xl"]}
      >
        ${membership.contractData.tokenSymbol}
      </Heading>

      {hasHover === true && (
        <div className="absolute right-12 top-2 aspect-square rounded-full">
          {hover === true ? (
            <IconButton
              icon={<IoIosArrowUp />}
              aria-label={""}
              backgroundColor="transparent"
              rounded="full"
              color="white"
              border="1px"
              position={"absolute"}
              fontSize={[26, 32, 38]}
              onClick={() => {
                if (hover) setHover(false);
              }}
            />
          ) : (
            <IconButton
              icon={<IoIosArrowDown />}
              aria-label={""}
              rounded="full"
              backgroundColor="transparent"
              color="white"
              border="1px"
              position={"absolute"}
              fontSize={[26, 32, 38]}
              onClick={() => {
                if (!hover) setHover(true);
              }}
            />
          )}
        </div>
      )}
      <div className="flex flex-col">
        <motion.div
          layout
          transition={{ type: "spring", duration: 0.7 }}
          className="flex flex-wrap aspect-video overflow-clip rounded-xl self-center justify-center"
        >
          <Image
            _before={{
              src: DC2.src,
            }}
            src={
              !imageError
                ? membership.metaData?.image
                : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            }
            alt=""
          />
        </motion.div>

        {hover && !owned && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={
              hover
                ? { opacity: 1, transition: { delay: 0.3, duration: 0.2 } }
                : { opacity: 0, transition: { delay: 0.3, duration: 0.2 } }
            }
            className="flex flex-row-reverse mt-[-60px] pr-6 w-[100%] h-[60px]"
          >
            <ConnectButton.Custom>
              {({ openConnectModal }) => {
                return (
                  <Button
                    w={1 / 12}
                    rounded="full"
                    variant="outline"
                    _hover={
                      !hasHover
                        ? {}
                        : {
                            cursor: "pointer",
                            backgroundColor: "teal.400",
                            color: "white",
                          }
                    }
                    _active={{
                      cursor: "pointer",
                      backgroundColor: "teal.400",
                      color: "white",
                    }}
                    color="white"
                    backgroundColor="rgb(120,100,120,0.08)"
                    onClick={() => {
                      if (!address) openConnectModal();
                      else handleBuy();
                    }}
                    isDisabled={isTxDisabled}
                  >
                    Buy
                  </Button>
                );
              }}
            </ConnectButton.Custom>
          </motion.div>
        )}

        {hover && (
          <motion.div
            className="flex flex-col px-2"
            initial={{ opacity: 0 }}
            animate={
              hover
                ? { opacity: 1, transition: { delay: 0.3, duration: 0.1 } }
                : { opacity: 0, transition: { delay: 0.3, duration: 0.1 } }
            }
          >
            <div className="flex flex-row mt-4 z-[200]">
              <Heading
                fontWeight="bold"
                textAlign="center"
                noOfLines={[0, 2]}
                height={"fit-content"}
                fontSize={["9vw", "4xl"]}
                lineHeight={1.2}
              >
                {membership.contractData.tokenName}
              </Heading>
            </div>
            <div className="flex flex-col">
              <Text
                textAlign={"justify"}
                noOfLines={3}
                minH={14}
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
                {formatEther(membership.contractData.currentPrice)} MATIC
              </Text>
            </div>
          </motion.div>
        )}
      </div>
      <Divider />
    </motion.div>
  );
};
export default BrowseCard;
