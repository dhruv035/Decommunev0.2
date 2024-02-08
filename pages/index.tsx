import { YourApp } from "../components/General/ConnectButton";
import type { NextPage } from "next";
import { useMemo } from "react";
import { Sidebar } from "../components/HUD";
import { Box, SimpleGrid } from "@chakra-ui/react";
import { useContractRead, useContractWrite } from "wagmi";
import {Card, CardBody, Image, Stack, Heading, Text, Divider, CardFooter, ButtonGroup, Button} from '@chakra-ui/react'
import {abi as Factory} from "../abi/MembershipFactory"
import { useEffect } from "react";
const Home: NextPage = () => {


console.log("ADDRESS",process.env.NEXT_PUBLIC_FACTORY_ADDRESS)
  const {data, error, isLoading} = useContractRead({
        address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
        abi:[...Factory],
        functionName:"getAllMemberships"
  })

  const memberships = useMemo(()=>{
   if(data?.length&&data.length>0)
   return data
   else return [] 
  },[data])
  if(data?.length)
  console.log("data",data)
  return (
    <div className=" flex flex-row bg-[url('/background.jpg')] w-full min-w-[94vw] bg-cover text-yellow-300">
      <SimpleGrid className="mt-10 ml-10 " columns={[1, 5]} spacing={12}>
        {
          (memberships.map((membership)=>{
            return <>
              <MarketCard address={membership}/>
            </>
          })  )
        }
      </SimpleGrid>
    </div>
  );
};
export default Home;

type CardProps = {
  image?:string
  address:`0x${string}`
}
const MarketCard = ({
  image,
  address
}:CardProps) => {

  return <Card maxW='sm'>
  <CardBody>
    <Image
      src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
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
