import { useContext, useEffect, useState } from "react";
import { AppContext, AppContextType } from "../contexts/appContext";
import Search from "../components/TagInput";

import CardsRow from "../components/General/CardsRow";
const Network = () => {
  const { memberships } = useContext(AppContext) as AppContextType;
  const [tags,setTags]= useState<string[]>([])

  return (
    <div className=" pt-6 flex flex-col w-full bg-cover">
      <div className="flex flex-col items-center">
        <div className="text-transparent bg-clip-text bg-velvetSun text-[44px] sm:text-[52px] text-center md:text-[60px] font-bold">
          Decommune
        </div>
        <Search tags={tags} setTags={setTags} />
      </div>
    
     <div className="overflow-x-hidden pt-40">
      <div className="">
      <CardsRow memberships={memberships} isFilter={false}  />
      </div>
    <div className="mt-[-15rem]">
      <CardsRow memberships={memberships} isFilter={false} /></div>
    </div>
    </div>
  );
};

export default Network;
