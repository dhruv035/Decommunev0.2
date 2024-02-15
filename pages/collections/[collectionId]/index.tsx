import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

//Home page for a collection
const getServerSideProps = (context:NextPageContext)=>{

}

const Collection = () => {
 const router = useRouter();
  return (
    <div className=" pt-6 flex flex-col w-full max-w-[92vw] bg-cover">
      
    </div>
  );
};

export default Collection;
