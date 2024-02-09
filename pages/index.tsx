import dynamic from "next/dynamic";
import type { NextPage } from "next";
import { useContext } from "react";
import Search from "../components/Search";
import { AppContext, AppContextType } from "../contexts/appContext";
import CardGrid from "../components/General/Grid/CardGrid";

const Home: NextPage = () => {
  const { memberships } = useContext(AppContext) as AppContextType;
  console.log("HERE",memberships)
  return (
    <div className=" pt-6 flex flex-col w-full max-w-[94vw] bg-cover">
      <div className="flex flex-col items-center">
        <div className="text-transparent font-kenia bg-clip-text bg-pinkFlavor text-[44px] sm:text-[52px] text-center md:text-[60px] font-bold">
          DeCommune
        </div>
        <Search />
      </div>
      <CardGrid memberships={memberships} isFilter={false} />
    </div>
  );
};
export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});

//Listing Section: Display all memberships available for purchase on the platform
//Network: Your Memberships as Creator/Member

//Create Section: Create New Memberships
