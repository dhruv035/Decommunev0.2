import { useContext, useEffect, useState } from "react";
import { AppContext, AppContextType } from "../contexts/appContext";
import Search from "../components/TagInput";

import CardsRow from "../components/General/CardsRow";
const Network = () => {
  const { memberships } = useContext(AppContext) as AppContextType;
  const [tags,setTags]= useState<string[]>([])

  useEffect(()=>{
    const test = async()=>{
      console.log("TESTING")
      const res = await fetch( process.env.NEXT_PUBLIC_BASE_URL + "/collection/"+"65c902ddadf286d4723a271d",{
        method:'PUT',
        body: JSON.stringify({contractAddress:"abcd"})
      })
      if(res.status===200)
      console.log("RES",await res.json())
      else
      console.log("FAILED")
    }
    test();
  },[])
  return (
    <div className=" pt-6 flex flex-col w-full bg-cover">
      <div className="flex flex-col items-center">
        <div className="text-transparent bg-clip-text bg-velvetSun text-[44px] sm:text-[52px] text-center md:text-[60px] font-bold">
          Decommune
        </div>
        <Search tags={tags} setTags={setTags} />
      </div>
    
     <div className="overflow-x-hidden">
      <div className="">
      <CardsRow memberships={memberships} isFilter={true} filter="member" />
      </div>
    <div className="mt-[-15rem]">
      <CardsRow memberships={memberships} isFilter={true} filter="owner" /></div>
    </div>
    </div>
  );
};

export default Network;
