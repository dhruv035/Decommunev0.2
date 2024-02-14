import { useRouter } from "next/router";
import { useContext, useState } from "react";

//Home page for a collection
const Collection = () => {
 const router = useRouter();
 console.log("QUERY",router.query)
  return (
    <div className=" pt-6 flex flex-col w-full max-w-[92vw] bg-cover">
      
    </div>
  );
};

export default Collection;
