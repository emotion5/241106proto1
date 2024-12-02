import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box, Slider, TextField, Button, Grid, Paper, Typography } from '@mui/material';

const calculateStage = (width) => {
  if (width <= 125) return 1;
  if (width <= 158) return 2;
  if (width <= 183) return 3;
  if (width <= 220) return 4;
  return 5;
};

// Table component that renders the 3D table
const Table = ({ width, depth, columns, stage, legroomPosition }) => {
  const tableHeight = 73; // Fixed height for all tables
  // Ensure minimum 3 vertical panels, then add more based on columns
  const verticalPanels = Math.max(3, columns + 1);

  // Calculate spacing
  const calculatePanelPositions = () => {
    const standardColumnWidth = width / (columns + 1); // 기본 컬럼 폭
    const legroomWidth = standardColumnWidth * 2; // legroom은 기본 폭의 2배
    
    if (legroomWidth > 120) {
      // legroom이 120cm 초과시 분할
      const adjustedColumnWidth = width / (columns + 2);
      return [...Array(verticalPanels)].map((_, i) => {
        return -width/2 + (adjustedColumnWidth * i);
      });
    } else {
      // 일반적인 경우: legroom + 나머지 컬럼
      const positions = [-width/2]; // 첫 패널
      let currentPos = -width/2;
      
      // legroom position에 따라 패널 위치 계산
      for (let i = 1; i <= columns; i++) {
        if (i === legroomPosition) {
          currentPos += legroomWidth;
        } else {
          currentPos += standardColumnWidth;
        }
        positions.push(currentPos);
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
      
      {/* Vertical panels with uneven spacing */}
      {panelPositions.map((xPos, index) => (
        <group key={`divider-${index}`} position={[xPos, tableHeight/2, 0]}>
          <mesh>
            <boxGeometry args={[2, tableHeight, depth]} />
            <meshStandardMaterial color="red" />
          </mesh>
        </group>
      ))}

      {/* Horizontal shelves - two levels for stage 1 */}
      {[...Array(stage === 1 ? 2 : 3)].map((_, index) => {
        // Shelf code here
      })}
    </group>
  );
};

const App = () => {
  const [width, setWidth] = useState(100);
  const [depth, setDepth] = useState(50);
  const [legroomPosition, setLegroomPosition] = useState(1); // 기본값 1 (첫번째 칼럼)
  
  const handleWidthChange = (_, newValue) => {
    setWidth(newValue);
  };

  const stage = calculateStage(width);
  const columns = stage + 1; // 2,3,4,5,6 columns

  // Legroom position이 현재 columns 수를 초과하지 않도록 조정
  useEffect(() => {
    if (legroomPosition > columns) {
      setLegroomPosition(columns);
    }
  }, [columns]);

  return (
    <Box sx={{ height: '100vh', display: 'flex' }}>
      {/* 3D Viewer */}
      <Box sx={{ flex: 2 }}>
        <Canvas camera={{ position: [200, 200, 200], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <Table 
            width={width} 
            depth={depth} 
            columns={columns} 
            stage={stage}
            legroomPosition={legroomPosition} 
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
              onChange={handleWidthChange}
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
            <Typography>Storage Columns</Typography>
            <Slider
              value={columns}
              onChange={(_, newValue) => setColumns(newValue)}
              min={2} // Changed from 1 to 2 since we need minimum 3 panels
              max={5}
              step={1}
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
      </Paper>
    </Box>
  );
};

export default App;