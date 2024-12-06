import { Popover, Box, Button, Tabs, Tab } from '@mui/material';
import { useState } from 'react';

const COLUMN_TYPES = {
  SHELF: {
    name: 'SHELF',
    styles: ['선반', '목재선반', '유리선반']
  },
  DRAWER: {
    name: 'DRAWER',
    styles: ['서랍2단', '서랍3단', '파일서랍']
  },
  COMBINED: {
    name: 'COMBINED',
    styles: ['선반+서랍', '선반+문', '서랍+문']
  },
  EMPTY: {
    name: 'EMPTY',
    styles: []
  }
};

const ColumnTypeSelector = ({ anchorEl, open, onClose, onTypeSelect }) => {
  const [selectedType, setSelectedType] = useState('SHELF');

  const handleTypeSelect = (type, style) => {
    // onTypeSelect 함수가 호출되는지 확인
    console.log('Selected:', type, style);
    onTypeSelect({ type, style }); // 객체로 전달
    onClose(); // 팝업 닫기
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
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // 빨간색 반투명 배경
          padding: 2,
          border: '1px solid red'  // 테두리 추가
        }
      }}
    >
      <Box sx={{ p: 2, minWidth: 200 }}>
        <Tabs 
          value={selectedType}
          onChange={(_, newValue) => setSelectedType(newValue)}
        >
          {Object.keys(COLUMN_TYPES).map((type) => (
            <Tab 
              key={type} 
              label={COLUMN_TYPES[type].name}
              value={type}
            />
          ))}
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {COLUMN_TYPES[selectedType].styles.map((style) => (
            <Button
              key={style}
              onClick={() => handleTypeSelect(selectedType, style)}
              fullWidth
              sx={{ mb: 1 }}
            >
              {style}
            </Button>
          ))}
        </Box>
      </Box>
    </Popover>
  );
};

export default ColumnTypeSelector;