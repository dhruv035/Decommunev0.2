import React, { useState } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { IoMdSearch, IoMdCloseCircleOutline } from "react-icons/io";
interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch = () => {} }) => {
  const [query, setQuery] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="max-w-[240px] flex items-center px-4 bg-gray-800 border-2 opacity-80 rounded-full min-h-[40px]">
      <Input
        type="text"
        placeholder="Search"
        value={query}
        backgroundColor="transparent"
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <div className="text-green-400">
        {query ? (
          <Icon
          className="rounded-full bg-transparent text-white"
            as={IoMdCloseCircleOutline}
            boxSize={6}
            rounded="full"
            backgroundColor="transparent"
            onClick={handleClear}
          />
        ) : (
          <Icon
            boxSize={6}
            rounded="full"
            color="white"
            backgroundColor="transparent"
            as={IoMdSearch}
            onClick={handleSearch}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
