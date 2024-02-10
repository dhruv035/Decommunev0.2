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
interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchBar: NextPage<SearchBarProps> = ({ onSearch = () => {} }) => {
  const [query, setQuery] = useState<string>("");
  const [tags,setTags]=useState<string[]>([]);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
    setTags([...tags,query])
    setQuery("")
    
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  const removeTag = (tagIndex:number)=>{
    const copy = [...tags];
    copy.splice(tagIndex,1)
    setTags([...copy])

  }
  return (
    <div className="flex flex-col h-full items-center flex-wrap">
      <TagBox tags={tags} removeTag={removeTag}/>
    <div className="max-w-[240px] flex justify-center mt-2 items-center bg-gray-800 opacity-80 rounded-full min-h-[40px]">
      <InputGroup height='full' alignContent='center'>
        <Input
          type="text"
          placeholder="Search"
          value={query}
          color="white"
          rounded="full"
          h="full"
          backgroundColor="transparent"
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <InputRightElement display={'flex'} alignItems={'center'}>
          {query ? (
            <IconButton
              padding={0}
              fontSize='20px'
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
              icon={<IoMdSearch/>}
              onClick={handleSearch}
            />
          )}
        </InputRightElement>
      </InputGroup>
    </div>
    </div>
  );
};

export default SearchBar;
