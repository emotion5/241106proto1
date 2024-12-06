import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box, Slider, Grid, Paper, Typography, Popover, Button } from '@mui/material';
import StyleSelector from './components/StyleSelector';
import Table from './components/Table';
import ColumnTypeSelector from './components/ColumnTypeSelector';


const calculateStage = (width) => {
  if (width <= 125) return 1;
  if (width <= 158) return 2;
  if (width <= 183) return 3;
  if (width <= 220) return 4;
  return 5;
};


// Main App Component
const App = () => {
  const [width, setWidth] = useState(100);
  const [depth, setDepth] = useState(50);
  const [legroomPosition, setLegroomPosition] = useState(1);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [columnTypes, setColumnTypes] = useState({});
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [stylePopoverAnchor, setStylePopoverAnchor] = useState(null);
  
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

  const handleStyleButtonClick = (columnIndex, event) => {
    setSelectedColumn(columnIndex);
    setStylePopoverAnchor(event.currentTarget); // 이벤트 타겟을 앵커로 설정
  };

  const handleStyleSelect = (styleId) => {
    setSelectedStyle(prev => ({
      ...prev,
      [selectedColumn]: styleId
    }));
    setStylePopoverAnchor(null);
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
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <Table 
            width={width} 
            depth={depth} 
            columns={columns} 
            stage={stage}
            legroomPosition={legroomPosition}
            selectedColumn={selectedColumn}
            onColumnClick={(index, event) => handleStyleButtonClick(index, event)}
            columnTypes={columnTypes}
          />
          <OrbitControls />
          <gridHelper args={[400, 40]} />
        </Canvas>
      </Box>
      
      {/* Control Panel */}
      <Paper sx={{ 
      flex: 1, 
      p: 3, 
      m: 2,
      backgroundColor: '#f5f5f5' // 원하는 색상 지정
      }}>
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
      <StyleSelector
        open={Boolean(stylePopoverAnchor)}
        anchorEl={stylePopoverAnchor}
        onClose={() => setStylePopoverAnchor(null)}
        onStyleSelect={handleStyleSelect}
      />
    </Box>
  );
};

export default App;  
 
