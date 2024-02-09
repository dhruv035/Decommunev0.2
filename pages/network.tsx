import { useCallback, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { AppContext, AppContextType } from "../contexts/appContext";
import { readContract } from "@wagmi/core";
import { NFT } from "../abi";
import Search from "../components/Search";
import { SimpleGrid } from "@chakra-ui/react";
import { MarketCard } from "../components/General";
import CardGrid from "../components/General/Grid/CardGrid";
const Network = () => {
  const { memberships } = useContext(AppContext) as AppContextType;
  return (
    <div className=" pt-6 flex flex-col w-full max-w-[94vw] bg-cover">
      <div className="flex flex-col items-center">
        <div className="text-transparent font-kenia bg-clip-text bg-velvetSun text-[44px] sm:text-[52px] text-center md:text-[60px] font-bold">
          Your Network
        </div>
        <Search />
      </div>
      <CardGrid memberships={memberships} isFilter={true} />
    </div>
  );
};

export default Network;
