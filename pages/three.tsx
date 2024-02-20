import { Canvas } from "@react-three/fiber";
import { useContext, useEffect, useState } from "react";
import { AppContext, AppContextType } from "../contexts/appContext";
import Floor from "../components/3D/Floor"
import Search from "../components/TagInput";

import CardsRow from "../components/General/CardsRow";
import { addContractAddress } from "../frontend-services/collections";
import Ball from "../components/3D/Ball";
const Network = () => {
  const { memberships } = useContext(AppContext) as AppContextType;
  const [tags, setTags] = useState<string[]>([]);

  return (
    <div className=" pt-6 flex flex-col w-full bg-cover">
      <Canvas camera={{  position: [-7, 7, 7] }}>
        <ambientLight intensity={0.3} />
        <directionalLight color="red" position={[0, 200, 125]} />
       
       <Ball/><Floor/>
       
      </Canvas>
    </div>
  );
};

export default Network;
