import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { signAccessJwt } from "@livepeer/core/crypto";
// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options

type PlaybackQuery = {
  assetId: string;
};
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, {});
  const token = await getToken({ req });
  if (req.method === "OPTIONS") return res.status(200).send("ok");

  const { assetId } = req.query as PlaybackQuery;
  const accessControlPrivateKey = process.env.ACCESS_CONTROL_PRIVATE_KEY;
  const accessControlPublicKey = process.env.ACCESS_CONTROL_PUBLIC_KEY;
  if (!accessControlPrivateKey || !accessControlPublicKey) return;

  const response = await fetch("https://livepeer.studio/api/asset/request-upload", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.NEXT_PUBLIC_LIVEPEER_API,
      "Content-Type": "application/json",
    },
    body: req.body,
  });
  console.log("data",response)
  if (response.status === 200)
  {
    const data = await response.json()
    console.log("DATA",data)
     res.status(200).json(data);
    }
  else res.status(403).json({ message: "FAILED" });
  return;
};
