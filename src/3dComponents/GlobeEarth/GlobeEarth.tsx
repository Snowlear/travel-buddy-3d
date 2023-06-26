import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, ThreeEvent } from "react-three-fiber";

import * as THREE from "three";
import Earth from "../../assets/images/earth.jpg";
import BumpMap from "../../assets/images/bump_map.jpg";
import WaterMap from "../../assets/images/water.png";
import { City } from "../../types/City";
import Dot from "../Dot/Dot";
import Arrow from "../Arrow/Arrow";

const earthTexture = new THREE.TextureLoader().load(Earth);
const bumpMapTexture = new THREE.TextureLoader().load(BumpMap);
const waterMapTexture = new THREE.TextureLoader().load(WaterMap);

interface GlobeEarthProps {
  cities: City[];
}

const GlobeEarth: React.FC<GlobeEarthProps> = (props: GlobeEarthProps) => {
  const { cities } = props;
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, hover] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const cityArrows = useMemo(() => {
    const calculateCityPairs = (cities: City[]) => {
        console.log(cities);
      const cityPairs: [City, City][] = [];
      for (let i = 0; i < cities.length; i++) {
        if(i+1 < cities.length) {
            cityPairs.push([cities[i], cities[i+1]]);   
        }
        
      }
      return cityPairs;
    };

    const getVectoralLocation = (radius: number, lat: number, lon: number) => {
      const spherical = new THREE.Spherical(
        radius,
        THREE.MathUtils.degToRad(90 - lat),
        THREE.MathUtils.degToRad(lon + 90)
      );
      return new THREE.Vector3().setFromSpherical(spherical);
    };

    console.log(calculateCityPairs(cities))

    return (
      <>
        {calculateCityPairs(cities).map(([city1, city2]) => {
          return <Arrow
            key={`${city1.name}-${city2.name}`}
            origin={getVectoralLocation(3, city1.latitude, city1.longitude)}
            dir={getVectoralLocation(3, city2.latitude, city2.longitude)}
            length={0.1}
            color="red"
          />;
        })}
      </>
    );
  }, [cities]);

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
        transparent={true}
        opacity={0.2} // Adjust the opacity to your preference
      >
        <primitive
          attach="map"
          object={earthTexture}
          premultiplyAlpha={false}
        />
      </meshStandardMaterial>
      {cities &&
        cities.map((city) => (
          <Dot
            onClick={() => alert(city.name)}
            key={city.name}
            lat={city.latitude}
            lon={city.longitude}
          />
        ))}
      {cityArrows}
    </mesh>
  );
};

export default GlobeEarth;
