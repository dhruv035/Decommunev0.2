import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../backend-services/db/database";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "OPTIONS") return res.status(200).send("ok");
  else if (req.method === "GET"){
    const data = await fetch("https://livepeer.studio/api/access-control/public-key",
    {
      headers: {
        Authorization: "Bearer "+process.env.NEXT_PUBLIC_LIVEPEER_API,
      },
    },
   
  );
  if(data.status===200){
        res.status(200).json(await data.json())
        return;
  }
  else res.status(403).json({message:"FAILED"})
  }
  return;
}
