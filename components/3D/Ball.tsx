import React from "react";

function Ball(props:any) {
  return (
    <mesh {...props} position={[0,4,1]} recieveShadow>
      <sphereGeometry args={[1,10,10]} />
      <meshPhysicalMaterial color='white' />
    </mesh>
  );
}

export default Ball