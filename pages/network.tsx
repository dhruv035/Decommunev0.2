import { useCallback, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { AppContext, AppContextType } from "../contexts/appContext";
import { readContract } from "@wagmi/core";
import { NFT } from "../abi";
import Search from "../components/Search";
import { SimpleGrid } from "@chakra-ui/react";
import { MarketCard } from "../components/General";
const Network = () => {
  const { address } = useAccount();
  const { memberships } = useContext(AppContext) as AppContextType;
  const [membershipData, setMembershipData] = useState<any[]>([]);
  const getMembershipData = useCallback(async () => {
    if (!address) return;
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
    ).then((res) => {
      return res.filter((element) => {
        return Number(element[0]) > 0;
      });
    });

    const metaDatas = await Promise.all(
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
        return await Promise.all(
          res.map(async (element) => {
            if (!element) return;
            if (element.status === 200) {
              let data;
              try {
                return element.json();
              } catch (error) {}
            }
          })
        );
      })
      .then((res) => {
        return res.map((element, index) => {
          const data = contracts[index];

          return {
            contractData: data,
            metaData: element,
          };
        });
      });

    setMembershipData(metaDatas);
  }, [memberships]);

  useEffect(() => {
    getMembershipData();
  }, [memberships]);
  return (
    <div className=" pt-6 flex flex-col w-full max-w-[94vw] bg-cover">
      <div className="flex flex-col items-center">
        <div className="text-transparent font-kenia bg-clip-text bg-velvetSun text-[44px] sm:text-[52px] text-center md:text-[60px] font-bold">
          Your Network
        </div>
        <Search />
      </div>
      <SimpleGrid className="mt-10 ml-10 " columns={[1, 3]} spacing={12}>
        {membershipData.map((membership, index) => {
          return (
            <div key={index}>
              <MarketCard membership={membership} />
            </div>
          );
        })}
      </SimpleGrid>
    </div>
  );
};

export default Network