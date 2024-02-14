import { SimpleGrid } from "@chakra-ui/react";
import { readContract } from "@wagmi/core";
import { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { NFT } from "../../abi";
import MarketCard from "./MarketCard";
import BrowseCard from "./BrowseCard";
import { motion } from "framer-motion";
import { element } from "@rainbow-me/rainbowkit/dist/css/reset.css";

/*
  This component takes a list of memberships on the contract and extracts necessary 
  data to pass onto card component Renders a grid of cards.
  NOTE: Consider if some of this should be moved out to seperate context for contracts
*/
type CardGridProps = {
  memberships: readonly `0x${string}`[];
  isFilter: boolean;
  pendingTx?: string;
  filter?: string;
  filterData?: any[];
};

const CardsRow: NextPage<CardGridProps> = ({
  memberships,
  isFilter,
  pendingTx,
  filter,
  filterData,
}) => {
  const { address } = useAccount();
  const [membershipData, setMembershipData] = useState<any[]>([]);

  const getMembershipData = useCallback(async () => {
    //TODO:Fetch only balances first and perform filter before fetching the rest of the contract data.
    let data: readonly `0x${string}`[] = [];
    if (isFilter) {
      switch (filter) {
        default:
          break;
        case "owner":
          const ownerships = await Promise.all(
            memberships.map(async (membership) => {
              const owner = async () => {
                //This fetch may revert sometimes and therefore must be error handled
                try {
                  const data = await readContract({
                    address: membership,
                    abi: NFT,
                    functionName: "owner",
                  });
                  return data;
                } catch (error) {
                  return "" as `0x${string}`;
                }
              };

              return owner();
            })
          ).then((res) => {
            
           let inData = memberships.filter((element, index) => {
              return res[index] === address;
            });
            return inData;
          });
          data = [...ownerships]
          break;

        case "member":
          const subscriptions = await Promise.all(
            memberships.map(async (membership) => {
              const balance = async () => {
                let innerData;

                //This fetch may revert sometimes and therefore must be error handled
                try {
                  innerData = await readContract({
                    address: membership,
                    abi: NFT,
                    functionName: "balanceOf",
                    args: [address ?? ("" as `0x${string}`)],
                  });
                  return innerData;
                } catch (error) {
                  return BigInt(0);
                }
              };
              return balance();
            })
          ).then((res) => {
            let inData =memberships.filter((element, index) => res[index]>BigInt(0)
              
            );
            return inData;
          });
          data = [...subscriptions]
          break;
      }
    } else data = memberships;

    //Concurrently fetch membership data from all contracts.
    const contracts = await Promise.all(
      data.map(async (membership) => {
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
          currentPrice,
          baseURI,
          membership,
          tokenName,
          tokenSymbol,
          tokenURI(),
        ]).then((res) => {
          return {
            currentPrice: res[0],
            baseURI: res[1],
            contractAddress: res[2],
            tokenName: res[3],
            tokenSymbol: res[4],
            tokenURI: res[5],
          };
        });
      })
    );

    const metaDatas = await Promise.all(
      //Concurrently fetch metadata from database using baseURI from the contract
      contracts.map(async (contract) => {
        try {
          const data = await fetch(contract.baseURI);
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
    <motion.div
      initial={false}
      onPanStart={(e) => {}}
      layout
      className="flex items-top h-full overflow-x-scroll pl-14 pb-60"
    >
      <motion.div
        className="flex z-[10] hover:z-[400] h-[305px] space-x-8  mt-20"
        layout
        transition={{ type: "spring", bounce: 0.3, duration: 0.7 }}
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
      >
        {membershipData
          .slice(0)
          .reverse()
          .map((membership, index) => {
            return (
              <BrowseCard
                key={index}
                membership={membership}
                owned={isFilter}
              />
            );
          })}
      </motion.div>
    </motion.div>
  );
};

export default CardsRow;
