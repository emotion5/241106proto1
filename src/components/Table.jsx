import Column from './Column';

// Add COLUMN_TYPES constant or import it
const COLUMN_TYPES = {
  SHELF: 'SHELF',
  DRAWER: 'DRAWER',
  COMBINED: 'COMBINED',
  EMPTY: 'EMPTY'
};

const Table = ({ 
  width, 
  depth, 
  columns, 
  legroomPosition, 
  onColumnClick, 
  columnTypes,
  stage,
  selectedColumn
}) => {
  const tableHeight = 72;
  
  const calculatePanelPositions = () => {
    const standardColumnWidth = width / (columns + 1);
    const legroomWidth = standardColumnWidth * 2;
    
    if (legroomWidth > 120) {
      const adjustedColumnWidth = width / (columns + 2);
      return [...Array(columns + 1)].map((_, i) => ({
        x: -width/2 + (adjustedColumnWidth * i),
        width: adjustedColumnWidth,
        isLegroom: false,
        isLastColumn: i === columns
      }));
    } else {
      const positions = [];
      let currentPos = -width/2;
      
      for (let i = 0; i <= columns; i++) {
        if (i === (legroomPosition - 1)) {
          positions.push({ 
            x: currentPos, 
            width: legroomWidth,
            isLegroom: true,
            isLastColumn: i === columns
          });
          currentPos += legroomWidth;
        } else {
          positions.push({ 
            x: currentPos, 
            width: standardColumnWidth,
            isLegroom: false,
            isLastColumn: i === columns
          });
          currentPos += standardColumnWidth;
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
      
      {panelPositions.map((pos, index) => (
        <Column
          key={`column-${index}`}
          columnIndex={index}  // Add this
          position={[pos.x, tableHeight/2, 0]}
          width={pos.width}
          depth={depth}
          height={tableHeight}
          type={columnTypes[index] || COLUMN_TYPES.EMPTY}
          onClick={() => onColumnClick(index)}
          isLegroom={pos.isLegroom}
          isLastColumn={pos.isLastColumn}
        />
      ))}
    </group>
  );
};

export default Table;