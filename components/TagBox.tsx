import { Icon, SimpleGrid } from "@chakra-ui/react";
import { NextPage } from "next";
import { IoMdCloseCircleOutline } from "react-icons/io";

type TagBoxProps = {
  tags: any;
  removeTag: any;
};
const TagBox: NextPage<TagBoxProps> = ({ tags, removeTag }) => {
  return (
    <div className="w-[80%] justify-center flex flex-row flex-wrap spacing-x-2">
     
        {tags.map((element: string, index: number) => {
          return (
            <div key={index} className="flex flex-row border-[1px] mx-2 my-[2px] px-2 bg-gray-300 rounded-full w-border-white items-center">
             { element}
              <Icon boxSize={4} m={1} color={"white"} onClick={()=>{removeTag(index)}} aria-label={"Button"+index} as={IoMdCloseCircleOutline} />
            </div>
          );
        })}
   
    </div>
  );
};
export default TagBox
