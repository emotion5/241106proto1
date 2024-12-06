import { Popover, Button } from '@mui/material';

const StyleSelector = ({ open, anchorEl, onClose, onStyleSelect }) => {
  const styles = [
    { id: 'style1', name: '서랍제거' },
    { id: 'style2', name: '전체서랍' },
    { id: 'style3', name: '전체문' },
    // ... more styles
  ];

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      sx={{
        '& .MuiPopover-paper': {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: 2
        }
      }}
    >
      {styles.map(style => (
        <Button
          key={style.id}
          onClick={() => onStyleSelect(style.id)}
          fullWidth
          sx={{ p: 1 }}
        >
          {style.name}
        </Button>
      ))}
    </Popover>
  );
};

export default StyleSelector;