import * as THREE from "three";

interface DotProps {
  lat: number;
  lon: number;
  onClick: () => void;
}

const Dot: React.FC<DotProps> = ({ lat, lon, onClick }) => {
  const radius = 3;
  const spherical = new THREE.Spherical(
    radius,
    THREE.MathUtils.degToRad(90 - lat),
    THREE.MathUtils.degToRad(lon + 90)
  );
  const position = new THREE.Vector3().setFromSpherical(spherical);

  return (
    <mesh onClick={onClick} position={position.toArray()}>
      <sphereGeometry args={[0.01, 32, 32]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );
};

export default Dot;
