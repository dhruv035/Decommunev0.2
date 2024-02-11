import { Box, Icon, SimpleGrid } from "@chakra-ui/react";
import { NextPage } from "next";
import { IoMdCloseCircleOutline } from "react-icons/io";

//Simple box for maintaining a list of tags from an input.
//The selected tags are listed with an remove button
type TagBoxProps = {
  tags: any;
  removeTag: any;
};
const TagBox: NextPage<TagBoxProps> = ({ tags, removeTag }) => {
  return (
    <div className="w-[80%] justify-center flex flex-row text-black flex-wrap spacing-x-2">
      {tags.map((element: string, index: number) => {
        return (
          <Box
            className="flex flex-row border-[1px] mx-2 my-[2px] pl-2 bg-teal-500 rounded-full border-0 items-center"
            onClick={() => {
              removeTag(index);
            }}
            _hover={{
              cursor: "pointer",
              backgroundColor:"red.400",
              color:"white",
            }}
            key={index}
          >
            {element}
            <Icon
              boxSize={4}
              m={1}
              aria-label={"Button" + index}
              as={IoMdCloseCircleOutline}
            />
          </Box>
        );
      })}
    </div>
  );
};
export default TagBox;
