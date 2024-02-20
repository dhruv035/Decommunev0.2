import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { signAccessJwt } from "@livepeer/core/crypto";
// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options

type PlaybackQuery={
    assetId:string
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session =await  getServerSession(req, res, {});
  const token = await getToken({ req });
    if (req.method === "OPTIONS") return res.status(200).send("ok");
  
  
  const { assetId } = req.query as PlaybackQuery;
  const accessControlPrivateKey = process.env.ACCESS_CONTROL_PRIVATE_KEY;
  const accessControlPublicKey =
    process.env.ACCESS_CONTROL_PUBLIC_KEY;
  if (!accessControlPrivateKey || !accessControlPublicKey) return;

  const jToken = await signAccessJwt({
    privateKey: accessControlPrivateKey,
    publicKey: accessControlPublicKey,
    issuer: "https://docs.livepeer.org",
    // playback ID to include in the JWT
    playbackId:assetId,
    // expire the JWT in 1 hour
    expiration: 60 * 60,
    // custom metadata to include
    custom: {
      userId: "user-id-1",
    },
  });
  res.status(200).json({ token:jToken });
  return;
};
