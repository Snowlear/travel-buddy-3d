import { useRef, useState, useEffect } from "react";
import { useFrame, ThreeEvent } from "react-three-fiber";

import Earth from "../../assets/images/earth.jpg";
import BumpMap from "../../assets/images/bump_map.jpg";
import WaterMap from "../../assets/images/water.png";
import { TextureLoader, Mesh } from "three";
import { City } from "../../types/City";
import Dot from "../Dot/Dot";

const earthTexture = new TextureLoader().load(Earth);
const bumpMapTexture = new TextureLoader().load(BumpMap);
const waterMapTexture = new TextureLoader().load(WaterMap);

interface GlobeEarthProps {
  cities: City[];
}

const GlobeEarth: React.FC<GlobeEarthProps> = (props: GlobeEarthProps) => {
  const { cities } = props;
  const ref = useRef<Mesh>(null!);
  const [hovered, hover] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x = rotation.x;
      ref.current.rotation.y = rotation.y;
    }
  });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    setIsDragging(true);
    setDragStart({
      x: event.nativeEvent.clientX,
      y: event.nativeEvent.clientY,
    });
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (isDragging) {
      const delta = {
        x: event.nativeEvent.clientX - dragStart.x,
        y: event.nativeEvent.clientY - dragStart.y,
      };
      setRotation((prevRotation) => ({
        x: prevRotation.x + delta.y * 0.001,
        y: prevRotation.y + delta.x * 0.001,
      }));
      setDragStart({
        x: event.nativeEvent.clientX,
        y: event.nativeEvent.clientY,
      });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!hovered) {
      setIsDragging(false);
    }
  }, [hovered]);
  console.log(cities);

  return (
    <mesh
      {...props}
      ref={ref}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <sphereGeometry args={[3, 128, 128]} />
      <meshStandardMaterial
        attach="material"
        color="white"
        map={earthTexture}
        bumpMap={bumpMapTexture}
        metalnessMap={waterMapTexture}
      >
        <primitive
          attach="map"
          object={earthTexture}
          premultiplyAlpha={false}
        />
      </meshStandardMaterial>
      {cities &&
        cities.map((city) => (
          <Dot key={city.name} lat={city.latitude} lon={city.longitude} />
        ))}
    </mesh>
  );
};

export default GlobeEarth;
