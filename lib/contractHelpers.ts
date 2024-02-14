import { readContract } from "@wagmi/core";
import { NFT } from "../abi";

export const getContractData = async (memberships:readonly `0x${string}`[],address:`0x${string}`,isFilter?:boolean) => {
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
      ).then((res)=>{
        if(isFilter)
        return res.filter((element)=>{
            return Number(element[0])>0
        })
        else
        return res
      });
      return contracts;
}