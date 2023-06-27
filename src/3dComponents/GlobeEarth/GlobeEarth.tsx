import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, ThreeEvent, useThree } from "react-three-fiber";
import { Text } from "@react-three/drei";
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
  const { camera } = useThree();
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
      setRotation(targetRotation);
    }
  }, [cities]);

  const cityArrows = useMemo(() => {
    const calculateCityPairs = (cities: City[]) => {
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

    const distanceBetweenCities = ([city1, city2]: City[], R: number) => {
      const lat1 = (city1.latitude * Math.PI) / 180;
      const lon1 = (city1.longitude * Math.PI) / 180;
      const lat2 = (city2.latitude * Math.PI) / 180;
      const lon2 = (city2.longitude * Math.PI) / 180;

      const dlat = lat2 - lat1;
      const dlon = lon2 - lon1;

      const a =
        Math.sin(dlat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c;
    };

    const getCurveBetweenCities = ([city1, city2]: City[], R: number) => {
      const start = getVectoralLocation(R, city1.latitude, city1.longitude);
      const end = getVectoralLocation(R, city2.latitude, city2.longitude);
      const distance = distanceBetweenCities([city1, city2], R);
      const midHeight = R + distance / 4;
      const mid = start.clone().lerp(end, 0.5).setLength(midHeight);
      return new THREE.QuadraticBezierCurve3(start, mid, end);
    };

    return (
      <>
        {calculateCityPairs(cities).map(([city1, city2]) => {
          const curve = getCurveBetweenCities([city1, city2], 3);
          const points = curve.getPoints(200);
          const tubeGeometry = new THREE.TubeGeometry(
            curve,
            points.length - 1,
            0.005
          );
          const tubeMaterial = new THREE.MeshBasicMaterial({ color: "yellow" });
          const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);

          return (
            <group key={`${city1.name}-${city2.name}`}>
              <primitive object={tubeMesh} />
            </group>
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

  const getCityPosition = (lat: number, lon: number, R = 3) => {
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon + 180);

    const x = -(R + 0.02) * Math.sin(phi) * Math.cos(theta);
    const y = (R + 0.02) * Math.cos(phi);
    const z = (R + 0.02) * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!hovered) {
      setIsDragging(false);
    }
  }, [hovered]);

  const CityLabel = ({ city }: { city: City }) => {
    const ref = useRef<THREE.Object3D>(null);
    const { camera } = useThree();
  
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.lookAt(camera.position);
          
        }
      });
  
    return (
      <Text
      onClick={() => {alert("x")}}
        key={"title_" + city.name}
        ref={ref}
        position={getCityPosition(city.latitude, city.longitude, 3.01)}
        fontSize={0.01 * camera.position.z}
        color="black"
      >
        {city.name}
      </Text>
    );
  };

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
          <>
            <Dot
              onClick={() => alert(city.name)}
              key={city.name}
              lat={city.latitude}
              lon={city.longitude}
            />
            {CityLabel({ city: city })}
          </>
        ))}
      {cityArrows}
    </mesh>
  );
};

export default GlobeEarth;
