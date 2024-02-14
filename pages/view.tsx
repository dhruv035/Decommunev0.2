import Player from "../components/Player/Player";
import { livepeer } from "../lib/utils";
import { getSrc } from "@livepeer/react/external";

import type { InferGetServerSidePropsType } from "next";

const playbackId = "ea1evjuwj0wju143"

export const getServerSideProps = async () => {
  const playbackInfo = await livepeer.playback.get(playbackId);
    console.log("playbackInfo", playbackInfo.playbackInfo)
  const src = getSrc(playbackInfo.playbackInfo);
    console.log("SRC",playbackInfo?.playbackInfo?.meta.source)
  return { props: { src } };
};

export default function Page({
  src,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className=" pt-6 flex flex-col w-full max-w-[92vw] bg-cover">
      <div className="flex flex-col items-center">
        <div className="text-transparent bg-clip-text bg-velvetSun text-[44px] sm:text-[52px] text-center md:text-[60px] font-bold">
          Your Network
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center bg-black gap-12 p-10 mt-40 max-w-[900px] max-h-[300px]">
      <Player src={src} />
    </div>
        
      </div>
     
   
    </div>
   
  );
}