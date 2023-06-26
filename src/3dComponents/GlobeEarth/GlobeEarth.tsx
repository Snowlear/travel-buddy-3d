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

  useEffect(() => {
    if (cities.length > 0) {
      const firstCity = cities[0];
      const targetRotation = {
        x: (95 - firstCity.latitude) * (Math.PI / 180),
        y: 300 - firstCity.longitude * (Math.PI / 180),
      };
      console.log((90 - firstCity.latitude) * (Math.PI / 180));
      setRotation(targetRotation);
    }
  }, [cities]);

  const cityArrows = useMemo(() => {
    const calculateCityPairs = (cities: City[]) => {
      console.log(cities);
      const cityPairs: [City, City][] = [];
      for (let i = 0; i < cities.length; i++) {
        if (i + 1 < cities.length) {
          cityPairs.push([cities[i], cities[i + 1]]);
        }
      }
      return cityPairs;
    };

    const getVectoralLocation = (radius: number, lat: number, lon: number) => {
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon + 180);

      const x = -radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      return new THREE.Vector3(x, y, z);
    };

    const getBetweenVector = ([city1, city2]: City[], R: number) => {
        console.log(city1.name + " " + city2.name);
      const city1Lat = city1.latitude * (Math.PI / 180); // Convert latitude to radians
      const city1Lon = city1.longitude * (Math.PI / 180); // Convert longitude to radians
      const city2Lat = city2.latitude * (Math.PI / 180); // Convert latitude to radians
      const city2Lon = city2.longitude * (Math.PI / 180); // Convert longitude to radians

      // Calculate city1's 3D location on Earth
      const x1 = R * Math.cos(city1Lat) * Math.cos(city1Lon);
      const y1 = R * Math.cos(city1Lat) * Math.sin(city1Lon);
      const z1 = R * Math.sin(city1Lat);

      // Calculate city2's 3D location on Earth
      const x2 = R * Math.cos(city2Lat) * Math.cos(city2Lon);
      const y2 = R * Math.cos(city2Lat) * Math.sin(city2Lon);
      const z2 = R * Math.sin(city2Lat);

      // Calculate the direction vector from city1 to city2
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dz = z2 - z1;

      // Normalize the direction vector
      const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const dirX = (dx + 0.004) / length;
      console.log(dx);
      const dirY = dy / length;
      const dirZ = dz / length;

      return new THREE.Vector3(dirZ, dirX, dirY);
    };

    const distanceBetweenCities = ([city1, city2]: City[], R: number) => {
        const lat1 = city1.latitude * Math.PI / 180;
        const lon1 = city1.longitude * Math.PI / 180;
        const lat2 = city2.latitude * Math.PI / 180;
        const lon2 = city2.longitude * Math.PI / 180;
    
        const dlat = lat2 - lat1;
        const dlon = lon2 - lon1;
    
        const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        return R * c;
    }

    console.log("work");

    return (
      <>
        {calculateCityPairs(cities).map(([city1, city2]) => {
          return (
            <Arrow
              key={`${city1.name}-${city2.name}`}
              origin={getVectoralLocation(3, city1.latitude, city1.longitude)}
              dir={getBetweenVector([city2, city1], 3)}
              length={distanceBetweenCities([city1, city2], 3)}
              color="yellow"
            />
          );
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
      console.log(rotation.x + delta.y * 0.001);
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
      <sphereGeometry args={[3, 64, 64]} />
      <meshStandardMaterial
        attach="material"
        color="white"
        map={earthTexture}
        bumpMap={bumpMapTexture}
        metalnessMap={waterMapTexture}
        transparent={true}
        opacity={1}
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
