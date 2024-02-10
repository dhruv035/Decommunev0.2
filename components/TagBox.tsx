import { Icon, SimpleGrid } from "@chakra-ui/react";
import { NextPage } from "next";
import { IoMdCloseCircleOutline } from "react-icons/io";

type TagBoxProps = {
  tags: any;
  removeTag: any;
};
const TagBox: NextPage<TagBoxProps> = ({ tags, removeTag }) => {
  return (
    <div>
      <SimpleGrid alignItems={"center"} columns = {8} spacing={1}>
        {tags.map((element: string, index: number) => {
          return (
            <div key={index} className="flex flex-row border-[1px] px-1 bg-gray-300 rounded-full border-white items-center">
             { element}
              <Icon boxSize={4} m={1} color={"white"} onClick={()=>{removeTag(index)}} aria-label={"Button"+index} as={IoMdCloseCircleOutline} />
            </div>
          );
        })}
      </SimpleGrid>
    </div>
  );
};
export default TagBox
