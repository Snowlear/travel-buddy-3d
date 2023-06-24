import * as React from "react";
import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { City, CityDistanceData } from "../../../types/City";
import Dot from "../../../3dComponents/Dot/Dot";
import GlobeEarth from "../../../3dComponents/GlobeEarth/GlobeEarth";

interface EarthCanvasProps {
  cities?: City[];
  cityDistance?: CityDistanceData;
}

function Zoom() {
  const { camera } = useThree();

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const zoomSensivity = 0.001;
      console.log(camera.position.z);
      if (
        (event.deltaY > 0 && camera.position.z < 7) ||
        (event.deltaY < 0 && camera.position.z > 3.2)
      ) {
        camera.position.z += event.deltaY * zoomSensivity;
        console.log(camera.position.z);
      }
      console.log(event.deltaY);
    };
    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [camera.position]);
  return null;
}

const EarthCanvas: React.FC<EarthCanvasProps> = (props: EarthCanvasProps) => {
  const { cities, cityDistance } = props;
  return (
    <Canvas style={{ height: "100vh" }}>
      <Zoom />
      <ambientLight intensity={1} />
      <spotLight position={[100, 100, 100]} angle={0.15} penumbra={1} />
      <GlobeEarth cities={cities!} />
    </Canvas>
  );
}

export default EarthCanvas;