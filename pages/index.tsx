import dynamic from "next/dynamic";
import type { NextPage } from "next";
import { useContext, useState } from "react";
import TagInput from "../components/TagInput";
import { AppContext, AppContextType } from "../contexts/appContext";
import CardGrid from "../components/General/CardGrid";

const Home: NextPage = () => {
  const { memberships} = useContext(AppContext) as AppContextType;
  const [tags,setTags] = useState<string[]>([])
  return (
    <div className=" pt-6 flex flex-col w-full max-w-[92vw] bg-cover">
      <div className="flex flex-col items-center">
        <div className="text-transparent bg-clip-text bg-pinkFlavor text-center text-4xl sm:text-5xl md:text-8xl font-bold">
          DeCommune
        </div>
        <div className=" w-[50vw] max-w-[700px]">
        <TagInput tags={tags} setTags={setTags} onSearch={()=>{console.log("TRIGGERED")}}/>
        </div>
      </div>
      <CardGrid memberships={memberships} isFilter={false} />
    </div>
  );
};
export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});
