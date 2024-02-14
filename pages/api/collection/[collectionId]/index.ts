import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import clientPromise from "../../../../backend-services/db/database";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt";
// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "OPTIONS") return res.status(200).send("ok");
  const { collectionId } = req.query;
  if (typeof collectionId !== "string")
    return res.status(403).json({ message: "Invalid CollectionId" });

  const session = await getServerSession(req, res, {});
  const client = await clientPromise;
  const db = client.db("Coinvise");
  let object;
  try {
    object = ObjectId.createFromHexString(collectionId);
  } catch (error) {
    return res.status(403).json({ message: "Invalid CollectionId" });
  }
  const data = await db.collection("Collections").findOne({ _id: object });
  if (req.method === "GET") {
    if (!data) {
      res.status(200).json({ message: "available" });
    } else {
      res.status(200).json(data);
    }
  } else if (req.method === "PUT") {
    const body = JSON.parse(req.body);
    const token = await getToken({ req });
    if (!token) return res.status(403).json({ message: "Auth Token Missing" });
    if (token.sub !== data?.owner)
      return res.status(403).json({ message: "Access Denied" });
    const updateOp = await db
      .collection("Collections")
      .updateOne({ _id: object }, { $set: { ...body } });
      console.log("UPDATEOP",updateOp)
    res.status(200).json({ message: "Updated" });
  }
  return;
};
