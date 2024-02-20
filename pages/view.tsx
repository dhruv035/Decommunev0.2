import {PlayerWithControls} from "../components/Player/Player";
import { getJWT } from "../frontend-services/livepeer";
import { livepeer } from "../lib/utils";
import { getSrc } from "@livepeer/react/external";

import type { InferGetServerSidePropsType } from "next";

const playbackId = "0365lt0bf0ddjl0r"

export const getServerSideProps = async () => {
    
    
  const playbackInfo = await livepeer.playback.get(playbackId);

  const src = getSrc(playbackInfo.playbackInfo);
  return { props: { src,token: ""} };
};

export default function Page({
  src,token
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