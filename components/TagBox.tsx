import { Box, Icon, SimpleGrid, useMediaQuery } from "@chakra-ui/react";
import { NextPage } from "next";
import { IoClose } from "react-icons/io5";

//Simple box for maintaining a list of tags from an input.
//The selected tags are listed with an remove button
type TagBoxProps = {
  tags: any;
  removeTag: any;
};
const TagBox: NextPage<TagBoxProps> = ({ tags, removeTag }) => {
  const [isHover] = useMediaQuery(`(hover:hover)`);
  return (
    <div className="justify-center flex flex-row text-black flex-wrap spacing-x-2 w-auto">
      {tags.map((element: string, index: number) => {
        return (
          <Box
            className="flex flex-row border-[1px] mx-2 my-[0.8vh] pl-2 bg-gray-400 opacity-90 rounded-full border-0 items-center"
            onClick={() => {
              removeTag(index);
            }}
            _hover={
              !isHover
                ? {}
                : {
                    cursor: "pointer",
                    backgroundColor: "red.400",
                    color: "white",
                  }
            }
            _active={{
                    cursor: "pointer",
                    backgroundColor: "red.400",
                    color: "white",
                  }}
            key={index}
          >
            {element}
            <Icon
              boxSize={4}
              m={1}
              aria-label={"Button" + index}
              as={IoClose}
            />
          </Box>
        );
      })}
    </div>
  );
};
export default TagBox;
