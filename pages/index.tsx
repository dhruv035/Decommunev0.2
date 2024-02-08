import { YourApp } from "../components/General/ConnectButton";
import dynamic from "next/dynamic";
import type { NextPage } from "next";
import { useMemo } from "react";
import { Box, SimpleGrid } from "@chakra-ui/react";
import { useContractRead,useContractReads, useContractWrite } from "wagmi";
import {Card, CardBody, Image, Stack, Heading, Text, Divider, CardFooter, ButtonGroup, Button} from '@chakra-ui/react'
import {Factory, NFT} from "../abi"
import { useContext } from "react";
import { FlowContext } from "./_app";
import Search from "../components/Search";

const Home: NextPage = () => {

  const flowContext = useContext(FlowContext)
  const {data, error, isLoading} = useContractRead({
        address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
        abi:Factory,
        functionName:"getAllMemberships"
  })

  
  const memberships = useMemo(()=>{
   if(data?.length&&data.length>0)
   return data
   else return [] 
  },[data])
  if(flowContext.flow==="home")
  return (
    <div className=" pt-6 flex flex-col w-full min-w-[94vw] bg-cover">
     <div className="flex justify-center">
      <Search/>
      </div>
      <SimpleGrid className="mt-10 ml-10 " columns={[1, 5]} spacing={12}>
        {
          (memberships.map((membership,index)=>{
            return <div key={index}>
              <MarketCard address={membership}/>
            </div>
          })  )
        }
      </SimpleGrid>
    </div>
  );
};
export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});

const MarketCard = ({
  address
}:{address:`0x${string}`}) => {

  const nftContract = {
    address:address,
    abi:NFT
  }
  const {data, isLoading, error} = useContractReads({
    contracts:[
      {
        ...nftContract,
        functionName:"baseURI"
      },
      {
        ...nftContract,
        functionName:"currentPrice"
      }
    ]
  })

  const metadata=useMemo(async()=>{
    if(data && typeof data[0].result==='string')
    {
     const res = await fetch(data[0].result)
     console.log("Res",res)
    }
  },[data])
  const image=0;
  return <Card maxW='sm'>
  <CardBody>
    <Image
      src={image?image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'}
      alt='Green double couch with wooden legs'
      borderRadius='lg'
    />
    <Stack mt='6' spacing='3'>
      <Heading size='md'>{address}</Heading>
      <Text>
        This sofa is perfect for modern tropical spaces, baroque inspired
        spaces, earthy toned spaces and for people who love a chic design with a
        sprinkle of vintage design.
      </Text>
      <Text color='blue.600' fontSize='2xl'>
        $450
      </Text>
    </Stack>
  </CardBody>
  <Divider />
  <CardFooter>
    <ButtonGroup spacing='2'>
      <Button variant='solid' colorScheme='blue'>
        Buy now
      </Button>
      <Button variant='ghost' colorScheme='blue'>
        Add to cart
      </Button>
    </ButtonGroup>
  </CardFooter>
</Card>;
};
