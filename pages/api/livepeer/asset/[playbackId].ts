import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../backend-services/db/database";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt";
import { signAccessJwt } from "@livepeer/core/crypto";

type PlaybackQuery = {
  playbackId: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "OPTIONS") return res.status(200).send("ok");
  else if (req.method === "GET") {
    const { playbackId } = req.query as PlaybackQuery;
    const accessControlPrivateKey = process.env.ACCESS_CONTROL_PRIVATE_KEY;
    const accessControlPublicKey =
      process.env.NEXT_PUBLIC_ACCESS_CONTROL_PUBLIC_KEY;
    if (!accessControlPrivateKey || !accessControlPublicKey) return;

    const token = await signAccessJwt({
      privateKey: accessControlPrivateKey,
      publicKey: accessControlPublicKey,
      issuer: "https://docs.livepeer.org",
      // playback ID to include in the JWT
      playbackId,
      // expire the JWT in 1 hour
      expiration: 60 * 60,
      // custom metadata to include
      custom: {
        userId: "user-id-1",
      },
    });
    res.status(200).json({ token });
  }
  return;
}
