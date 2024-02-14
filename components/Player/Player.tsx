
import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";
import { Src } from "@livepeer/react/*";


const vod = {
  type: 'vod',
  meta: {
    playbackPolicy:{

    },
    source:{
      hrn: 'MP4',
      type: 'html5/video/mp4',
      url: 'https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/ea1evjuwj0wju143/360p0.mp4',
      size: 1372512,
      width: 640,
      height: 360,
      bitrate: 547143
    },
  },
}
const PlayerReact = (props:{src:Src[]|null}) => {
if(props?.src===null)
return(<></>)
  return (
    <Player.Root src={getSrc(vod)} clipLength={10}>
      <Player.Container
        style={{
          height: "100%",
          width: "100%",
          overflow: "hidden",
          backgroundColor: "black",
        }}
      >
        <Player.Video
          title="Agent 327"
          style={{
            height: "100%",
            width: "100%",
            objectFit: "contain",
          }}
        />

       
      </Player.Container>
    </Player.Root>
  );
};


export default PlayerReact