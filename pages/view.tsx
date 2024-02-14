import {PlayerWithControls} from "../components/Player/Player";
import { livepeer } from "../lib/utils";
import { getSrc } from "@livepeer/react/external";

import type { InferGetServerSidePropsType } from "next";

const playbackId = "3d1b1wj1glcvthq5"

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
        
        <PlayerWithControls src={src} />
      </div>
     
   
    </div>
   
  );
}