// src/components/Column.jsx
import { useState, useRef } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const Column = ({ 
  position, 
  width, 
  depth, 
  height, 
  type, 
  onClick, 
  isLegroom, 
  isLastColumn,
  columnIndex  // Add this prop
}) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef();
  const color = "white";
  const innerWidth = width - 2;

  return (
    <group ref={groupRef} position={position}>
      {/* 왼쪽 세로 패널 */}
      <mesh>
        <boxGeometry args={[2, height, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* 수평 패널들 */}
      {!isLegroom && !isLastColumn && (
        <>
          <mesh position={[innerWidth/2 + 1, height/2 - 18, 0]}>
            <boxGeometry args={[innerWidth, 2, depth]} />
            <meshStandardMaterial color={color} />
          </mesh>

          <mesh position={[innerWidth/2 + 1, height/2 - 36, 0]}>
            <boxGeometry args={[innerWidth, 2, depth]} />
            <meshStandardMaterial color={color} />
          </mesh>

          <mesh position={[innerWidth/2 + 1, -35, 0]}>
            <boxGeometry args={[innerWidth, 2, depth]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </>
      )}

      {/* collider */}
      {!isLastColumn && (
        <mesh
          position={[innerWidth/2 + 1, 0, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            console.log("[마우스오버]");
            setHovered(true);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick(e);
          }}
        >
          <boxGeometry args={[innerWidth, height, depth]} />
          <meshStandardMaterial 
            transparent={true}
            opacity={hovered ? 0.2 : 0}
            side={THREE.DoubleSide}
            depthTest={false}
          />
        </mesh>
      )}

      {/* 편집 버튼 */}
      {!isLastColumn && !isLegroom && (
        <Html position={[innerWidth/2 + 1, -40, 0]}>
          <Button
            id={`column-button-${columnIndex}`}  // Use the prop here
            sx={{
              minWidth: '30px',
              height: '30px',
              padding: '4px',
              backgroundColor: 'white',
              borderRadius: '50%'
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClick(e);
            }}
          >
            <EditIcon sx={{ fontSize: 16 }} />
          </Button>
        </Html>
      )}
    </group>
  );
};

export default Column;