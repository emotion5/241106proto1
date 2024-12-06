import { Popover, Box, Button, Tabs, Tab } from '@mui/material';
import { useState } from 'react';

const COLUMN_TYPES = {
  DOOR: {
    name: 'DOOR'
  },
  DRAWER: {
    name: 'DRAWER'
  },
  COMBINED: {
    name: 'COMBINED'
  },
  EMPTY: {
    name: '선택없음'
  }
};

const ColumnTypeSelector = ({ anchorEl, open, onClose, onTypeSelect }) => {
  const [selectedType, setSelectedType] = useState('DOOR');

  const handleTypeSelect = (type) => {
    console.log('Selected:', type);
    onTypeSelect({ type }); // Just pass the type
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      sx={{
        '& .MuiPopover-paper': {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: 2,
          border: '1px solid red'
        }
      }}
    >
      <Box sx={{ p: 2, minWidth: 200 }}>
        {Object.keys(COLUMN_TYPES).map((type) => (
          <Button
            key={type}
            onClick={() => handleTypeSelect(type)}
            fullWidth
            sx={{ mb: 1 }}
          >
            {COLUMN_TYPES[type].name}
          </Button>
        ))}
      </Box>
    </Popover>
  );
};

export default ColumnTypeSelector;