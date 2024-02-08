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
} from "@chakra-ui/react";
import { useContractReads, useContractWrite } from "wagmi";
import { NFT } from "../../abi";
import { useMemo } from "react";
const MarketCard = ({ address }: { address: `0x${string}` }) => {
  const nftContract = {
    address: address,
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
  
  const {writeAsync:buy} = useContractWrite({
    ...nftContract,
    functionName:"safeMint",
  })

  const metadata = useMemo(async () => {
    if (data && typeof data[0].result === "string") {
      const res = await fetch(data[0].result);
      console.log("Res", res);
    }
  }, [data]);
  const image = 0;
  const handleBuy = async()=>{

  }
  return (
    <Card maxW="sm" backgroundColor='black' padding={2} textColor='red.400' opacity={0.8}>
      <CardBody>
        <Image
          src={
            image
              ? image
              : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          }
          alt="Green double couch with wooden legs"
          borderRadius="lg"
        />
        <Stack mt="6" spacing="3" opacity={0.4}>
          <Heading size="md">{address}</Heading>
          <Text>
            This sofa is perfect for modern tropical spaces, baroque inspired
            spaces, earthy toned spaces and for people who love a chic design
            with a sprinkle of vintage design.
          </Text>
          <Text color="blue.600" fontSize="2xl">
            $450
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button variant="solid" onClick={()=>{handleBuy()}} colorScheme="blue">
            Buy now
          </Button>
          <Button variant="ghost" colorScheme="blue">
            Add to cart
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};
export default MarketCard;
