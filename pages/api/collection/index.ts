import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../backend-services/db/database";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "OPTIONS") return res.status(200).send("ok");
  const client = await clientPromise;
  const db = client.db("Coinvise");
  if (req.method === "GET") {
    const data = await db.collection("Collections").find({}).toArray();
    res.status(200).json({ collections: data });
  } else if (req.method === "POST") {
    const token = await getToken({ req });
    const body = JSON.parse(req.body);
    if (!token) return res.status(401).json({ message: "Auth Token Missing" });

    const insertOp = await db
      .collection("Collections")
      .insertOne({ ...body, owner: token.sub });
    res.status(200).json({ id: insertOp.insertedId });
    return;
  }
  return;
}
