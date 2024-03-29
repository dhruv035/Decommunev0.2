import { SimpleGrid } from "@chakra-ui/react";
import { readContract } from "@wagmi/core";
import { NextPage } from "next";
import { useCallback, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { NFT } from "../../abi";
import MarketCard from "./MarketCard";
import { AppContext, AppContextType } from "../../contexts/appContext";

/*
  This component takes a list of memberships on the contract and extracts necessary 
  data to pass onto card component Renders a grid of cards.
  NOTE: Consider if some of this should be moved out to seperate context for contracts
*/
type CardGridProps = {
  memberships: readonly `0x${string}`[];
  isFilter: boolean;
};

const CardGrid: NextPage<CardGridProps> = ({ memberships, isFilter }) => {
  const { address } = useAccount();
  const [membershipData, setMembershipData] = useState<any[]>([]);
  const { pendingTx } = useContext(AppContext) as AppContextType;
  const getMembershipData = useCallback(async () => {
    //TODO:Fetch only balances first and perform filter before fetching the rest of the contract data.

    //Concurrently fetch membership data from all contracts.
    const contracts = await Promise.all(
      memberships.map(async (membership) => {
        const balance = async () => {
          let data;

          //This fetch may revert sometimes and therefore must be error handled
          try {
            data = await readContract({
              address: membership,
              abi: NFT,
              functionName: "balanceOf",
              args: [address ?? ("" as `0x${string}`)],
            });
            return data;
          } catch (error) {
            return BigInt(0);
          }
        };
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
        const tokenName = readContract({
          address: membership,
          abi: NFT,
          functionName: "name",
        });
        const tokenSymbol = readContract({
          address: membership,
          abi: NFT,
          functionName: "symbol",
        });

        //This fetch may revert sometimes and therefore must be error handled
        const tokenURI = async () => {
          let data;
          try {
            data = await readContract({
              address: membership,
              abi: NFT,
              functionName: "tokenURI",
              args: [BigInt(0)],
            });
            return data;
          } catch (error) {
            return "ax";
          }
        };

        //Return a Promise.all with each data operation to run data fetch concurrently as a Promise for each membership

        return Promise.all([
          balance(),
          currentPrice,
          baseURI,
          membership,
          tokenName,
          tokenSymbol,
          tokenURI(),
        ]);
      })
    ).then((res) => {
      //The isFilter will trigger filter to leave only owned memberships
      if (isFilter)
        return res.filter((element) => {
          return Number(element[0]) > 0;
        });
      else return res;
    });

    const metaDatas = await Promise.all(
      //Concurrently fetch metadata from database using baseURI from the contract
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
        //Collect metadata where it exists
        return await Promise.all(
          res.map(async (element) => {
            if (!element) return;
            if (element.status === 200) {
              try {
                return element.json();
              } catch (error) {}
            }
          })
        );
      })
      .then((res) => {
        //Compose all the collected data from contracts and database and set in the membershipData state
        return res.map((element, index) => {
          const data = contracts[index];

          return {
            contractData: data,
            metaData: element,
          };
        });
      });
    setMembershipData(metaDatas);
  }, [memberships, isFilter, address]);

  useEffect(() => {
    getMembershipData();
  }, [memberships, isFilter, address, pendingTx]);

  return (
    <div className="p-5">
      <SimpleGrid
        placeItems="center"
        columns={[1, null, 2, null, 3]}
        spacing="4vw"
        alignItems="center"
      >
        {membershipData
          .slice(0)
          .reverse()
          .map((membership, index) => {
            return (
              <MarketCard
                key={index}
                membership={membership}
                owned={isFilter}
              />
            );
          })}
      </SimpleGrid>
    </div>
  );
};

export default CardGrid;
