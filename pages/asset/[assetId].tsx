import { getServerSession } from "next-auth";
import { PlayerWithControls } from "../../components/Player/Player";
import { getJWT } from "../../frontend-services/livepeer";
import { livepeer } from "../../lib/utils";
import { getSrc } from "@livepeer/react/external";
import { signAccessJwt } from "@livepeer/core/crypto";
import type { InferGetServerSidePropsType, NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";

type AssetQuery = {
  assetId: string;
};

export const getServerSideProps = async (context: NextPageContext) => {
  
  const session = await getSession(context);
  const {assetId:playbackId} = context.query as AssetQuery
  const accessControlPrivateKey = process.env.ACCESS_CONTROL_PRIVATE_KEY;
  const accessControlPublicKey = process.env.ACCESS_CONTROL_PUBLIC_KEY;

  if (!accessControlPrivateKey || !accessControlPublicKey) return;

  const jToken = await signAccessJwt({
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
  const playbackInfo = await livepeer.playback.get(playbackId);
  const src = getSrc(playbackInfo.playbackInfo);
  return { props: { src, token: jToken } };
};

export default function Page({
  src,
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className=" pt-6 flex flex-col w-full max-w-[92vw] bg-cover">
      <div className="flex flex-col items-center">
        <div className="text-transparent bg-clip-text bg-velvetSun text-[44px] sm:text-[52px] text-center md:text-[60px] font-bold">
          Your Network
        </div>

        <PlayerWithControls src={src} token={token} />
      </div>
    </div>
  );
}
