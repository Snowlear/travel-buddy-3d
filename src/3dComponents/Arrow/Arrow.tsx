import React, { useRef, useEffect } from "react";
import { ArrowHelper, Vector3 } from "three";
import { useThree } from "react-three-fiber";

interface ArrowProps {
  origin: Vector3;
  dir: Vector3;
  length: number;
  color: string | number;
}

const Arrow: React.FC<ArrowProps> = (props) => {
  const { origin, dir, length, color } = props;
  const arrow = useRef<ArrowHelper>();
  const { scene } = useThree();

  useEffect(() => {
    const currentArrow = arrow.current;
    if (!currentArrow) return;
    scene.add(currentArrow);
    return () => {
      scene.remove(currentArrow);
    };
  }, [arrow, scene]);

  useEffect(() => {
    if (!arrow.current) return;
    arrow.current.setDirection(dir);
    arrow.current.setLength(length);
    arrow.current.setColor(color);
  }, [dir, length, color]);

  return (
    <primitive
      object={new ArrowHelper(dir, origin, length, color)}
      ref={arrow}
    />
  );
};

export default Arrow;