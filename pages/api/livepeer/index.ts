import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../backend-services/db/database";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "OPTIONS") return res.status(200).send("ok");
  if (req.method === "GET")
  
  return;
}
