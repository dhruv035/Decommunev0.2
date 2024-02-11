import React, { useState } from "react";
import {
  Input,
  InputRightElement,
  IconButton,
  Icon,
  InputGroup,
} from "@chakra-ui/react";
import { IoMdSearch, IoMdCloseCircleOutline } from "react-icons/io";
import { NextPage } from "next";
import TagBox from "./TagBox";

/*
  This is a component to generate a list of inputs from a single input box, can be used multipurposely

  TODO: Add suggestions feature

*/
interface TagInputProps {
  onSearch?: (query: string) => void;
  placeholder?:string;
  tags: string[];
  setTags: any;
}

const TagInput: NextPage<TagInputProps> = ({
  onSearch,
  tags,
  setTags,
  placeholder,
}) => {
  const [query, setQuery] = useState<string>("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    if(!query)
    return
    if(onSearch)
    onSearch(query);
    setTags([...tags, query]);
    setQuery("");
  };

  const handleClear = () => {
    setQuery("");
    if(onSearch)
    onSearch("");
  };

  const removeTag = (tagIndex: number) => {
    const copy = [...tags];
    copy.splice(tagIndex, 1);
    setTags([...copy]);
  };
  return (
    <div className="flex flex-col w-full items-center">
      <TagBox tags={tags} removeTag={removeTag} />
        <InputGroup height="full" maxWidth="400px" alignContent="center" marginTop={4}>
          <Input
            type="text"
            placeholder={placeholder??"Search"}
            value={query}
            color="white"
            rounded="full"
            
            minHeight={"20px"}
            bgColor={'rgba(43,0,35,0.3)'}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <InputRightElement display={"flex"} alignItems={"center"}>
            {query ? (
              <IconButton
                padding={0}
                fontSize="20px"
                aria-label=""
                color="white"
                icon={<IoMdCloseCircleOutline />}
                isRound={true}
                backgroundColor="transparent"
                onClick={handleClear}
              />
            ) : (
              <IconButton
                fontSize="20px"
                padding={0}
                aria-label=""
                isRound={true}
                color="white"
                backgroundColor="transparent"
                icon={<IoMdSearch />}
                onClick={handleSearch}
              />
            )}
          </InputRightElement>
        </InputGroup>
      </div>
    
  );
};

export default TagInput;
