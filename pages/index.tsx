import dynamic from "next/dynamic";
import type { NextPage } from "next";
import { useContext, useState } from "react";
import TagInput from "../components/TagInput";
import { AppContext, AppContextType } from "../contexts/appContext";
import CardGrid from "../components/General/CardGrid";

const Home: NextPage = () => {
  const { memberships, pendingTx } = useContext(AppContext) as AppContextType;
  const [tags,setTags] = useState<string[]>([])
  return (
    <div className=" pt-6 flex flex-col w-full max-w-[94vw] bg-cover">
      <div className="flex flex-col items-center">
        <div className="text-transparent bg-clip-text bg-pinkFlavor text-[44px] sm:text-[52px] text-center md:text-[60px] font-bold">
          DeCommune
        </div>
        <div className=" w-[50vw] max-w-[700px]">
        <TagInput tags={tags} setTags={setTags} onSearch={()=>{console.log("TRIGGERED")}}/>
        </div>
      </div>
      <CardGrid memberships={memberships} isFilter={false} pendingTx={pendingTx} />
    </div>
  );
};
export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});
