import { Popover, Box, Button } from '@mui/material';

const COLUMN_TYPES = {
  SHELF: 'SHELF',
  DRAWER: 'DRAWER',
  COMBINED: 'COMBINED',
  EMPTY: 'EMPTY'
};

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

export default ColumnTypeSelector;