import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../backend-services/db/database";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "OPTIONS") return res.status(200).send("ok");
  else if (req.method === "POST"){
    console.log("ABC",{
        method: "POST",
        headers: {
          Authorization: "Bearer "+ process.env.NEXT_PUBLIC_LIVEPEER_API,
          "Content-Type": "application/json",
        },
       body:req.body,
      })
    const data = await fetch(
        "https://livepeer.studio/api/asset/request-upload",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer "+ process.env.NEXT_PUBLIC_LIVEPEER_API,
            "Content-Type": "application/json",
          },
         body:req.body,
        },
      );
      
      if(data.status===200)
      {
        res.status(200).json(await data.json())
        return;
      }
      else
      res.status(403).json({message:"FAILED"})
  }
  return;
}


