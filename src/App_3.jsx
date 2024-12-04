import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box, Slider, Grid, Paper, Typography, Popover, Button } from '@mui/material';
import * as THREE from 'three';

// Constants
const COLUMN_TYPES = {
  SHELF: 'SHELF',
  DRAWER: 'DRAWER',
  COMBINED: 'COMBINED',
  EMPTY: 'EMPTY'
};

const calculateStage = (width) => {
  if (width <= 125) return 1;
  if (width <= 158) return 2;
  if (width <= 183) return 3;
  if (width <= 220) return 4;
  return 5;
};

// Column Type Selector Popover Component
const ColumnTypeSelector = ({ anchorEl, open, onClose, onTypeSelect }) => (
  <Popover
    open={open}
    anchorEl={anchorEl}
    onClose={onClose}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
  >
    <Box sx={{ p: 2 }}>
      {Object.values(COLUMN_TYPES).map((type) => (
        <Button
          key={type}
          onClick={() => {
            onTypeSelect(type);
            onClose();
          }}
          fullWidth
          sx={{ mb: 1 }}
        >
          {type}
        </Button>
      ))}
    </Box>
  </Popover>
);

// Column Component
const Column = ({ position, width, depth, height, type, isSelected, onClick, isLegroom }) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef();
  const color = "white";
  const innerWidth = width - 2; // 패널 두께 제외

  return (
    <group ref={groupRef} position={position}>
      {/* 왼쪽 세로 패널 */}
      <mesh>
        <boxGeometry args={[2, height, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* 내부 공간 collider */}
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

      {/* 컬럼 타입별 내부 구성요소 */}
      {!isLegroom && (
        <>
          {type === COLUMN_TYPES.SHELF && (
            <>
              {[1, 2].map((level) => (
                <mesh key={level} position={[innerWidth/2 + 1, height * (level / 3), 0]}>
                  <boxGeometry args={[innerWidth, 1, depth]} />
                  <meshStandardMaterial color={color} />
                </mesh>
              ))}
            </>
          )}
          {type === COLUMN_TYPES.DRAWER && (
            <>
              {[1, 2, 3].map((level) => (
                <mesh key={level} position={[innerWidth/2 + 1, height * (level / 4), depth/4]}>
                  <boxGeometry args={[innerWidth, height/5 - 1, depth/2]} />
                  <meshStandardMaterial color={color} />
                </mesh>
              ))}
            </>
          )}
        </>
      )}
    </group>
  );
};

// Table Component
const Table = ({ width, depth, columns, stage, legroomPosition, selectedColumn, onColumnClick, columnTypes }) => {
  const tableHeight = 73;
  const verticalPanels = Math.max(3, columns + 1);

  const calculatePanelPositions = () => {
    const standardColumnWidth = width / (columns + 1);
    const legroomWidth = standardColumnWidth * 2;
    
    if (legroomWidth > 120) {
      const adjustedColumnWidth = width / (columns + 2);
      return [...Array(verticalPanels)].map((_, i) => ({
        x: -width/2 + (adjustedColumnWidth * i),
        width: adjustedColumnWidth,
        isLegroom: false
      }));
    } else {
      const positions = [{ x: -width/2, width: standardColumnWidth, isLegroom: false }];
      let currentPos = -width/2;
      
      for (let i = 1; i <= columns; i++) {
        if (i === legroomPosition) {
          currentPos += standardColumnWidth;
          positions.push({ 
            x: currentPos, 
            width: legroomWidth,
            isLegroom: true 
          });
          currentPos += standardColumnWidth;
        } else {
          currentPos += standardColumnWidth;
          positions.push({ 
            x: currentPos, 
            width: standardColumnWidth,
            isLegroom: false 
          });
        }
      }
      return positions;
    }
  };

  const panelPositions = calculatePanelPositions();

  return (
    <group>
      {/* Table top */}
      <mesh position={[0, tableHeight + 1, 0]}>
        <boxGeometry args={[width + 2, 2, depth]} />
        <meshStandardMaterial color="red" />
      </mesh>
      
      {/* Columns with hover effect */}
      {panelPositions.map((pos, index) => (
        <Column
          key={`column-${index}`}
          position={[pos.x, tableHeight/2, 0]}
          width={pos.width}
          depth={depth}
          height={tableHeight}
          type={columnTypes[index] || COLUMN_TYPES.EMPTY}
          isSelected={selectedColumn === index}
          onClick={() => onColumnClick(index)}
          isLegroom={pos.isLegroom}
        />
      ))}
    </group>
  );
};

// Main App Component
const App = () => {
  const [width, setWidth] = useState(100);
  const [depth, setDepth] = useState(50);
  const [legroomPosition, setLegroomPosition] = useState(1);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [columnTypes, setColumnTypes] = useState({});
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  
  const stage = calculateStage(width);
  const columns = stage + 1;

  useEffect(() => {
    if (legroomPosition > columns) {
      setLegroomPosition(columns);
    }
  }, [columns]);

  const handleColumnClick = (columnIndex) => {
    setSelectedColumn(columnIndex);
    setPopoverAnchor(document.querySelector(`#column-${columnIndex}`));
  };

  const handleTypeSelect = (type) => {
    setColumnTypes(prev => ({
      ...prev,
      [selectedColumn]: type
    }));
    setPopoverAnchor(null);
    setSelectedColumn(null);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex' }}>
      {/* 3D Viewer */}
      <Box sx={{ flex: 2 }}>
        <Canvas 
          camera={{ position: [200, 200, 200], fov: 50 }}
          raycaster={{
            computeOffsets: (e) => ({
              offsetX: e.clientX,
              offsetY: e.clientY
            })
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <Table 
            width={width} 
            depth={depth} 
            columns={columns} 
            stage={stage}
            legroomPosition={legroomPosition}
            selectedColumn={selectedColumn}
            onColumnClick={handleColumnClick}
            columnTypes={columnTypes}
          />
          <OrbitControls />
          <gridHelper args={[400, 40]} />
        </Canvas>
      </Box>
      
      {/* Control Panel */}
      <Paper sx={{ flex: 1, p: 3, m: 2 }}>
        <Typography variant="h6" gutterBottom>
          Table Configurator
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography>Width: {width}cm (Stage {calculateStage(width)})</Typography>
            <Slider
              value={width}
              onChange={(_, newValue) => setWidth(newValue)}
              min={90}
              max={240}
              step={1}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography>Depth: {depth}cm</Typography>
            <Slider
              value={depth}
              onChange={(_, newValue) => setDepth(newValue)}
              min={40}
              max={50}
              step={10}
              marks
              valueLabelDisplay="auto"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography>
              Legroom Position: Column {legroomPosition} of {columns}
            </Typography>
            <Slider
              value={legroomPosition}
              onChange={(_, newValue) => setLegroomPosition(newValue)}
              min={1}
              max={columns}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              Height is fixed at 73cm for all desks
            </Typography>
          </Grid>
        </Grid>

        <ColumnTypeSelector
          anchorEl={popoverAnchor}
          open={Boolean(popoverAnchor)}
          onClose={() => {
            setPopoverAnchor(null);
            setSelectedColumn(null);
          }}
          onTypeSelect={handleTypeSelect}
        />
      </Paper>
    </Box>
  );
};

export default App;