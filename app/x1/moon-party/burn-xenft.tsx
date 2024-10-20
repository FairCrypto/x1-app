'use client';

import CloseIcon from '@mui/icons-material/Close';
import FireIcon from '@mui/icons-material/LocalFireDepartment';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import React from 'react';

import type { IRow } from '@/app/x1/moon-party/state';

export const BurnXenftDialog = ({
  open,
  onClose,
  row
}: {
  open: boolean;
  onClose: () => void;
  row: IRow;
}) => {
  const [processing, setProcessing] = React.useState(false);
  const onBurnClick = () => {
    console.log('burn', row?.id);
    setProcessing(true);
    new Promise(resolve => {
      setTimeout(resolve, 10_000);
    }).then(() => {
      setProcessing(false);
      onClose();
    });
  };
  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: '12px', backgroundColor: '#1A1D21', backgroundImage: 'unset' }
      }}
      sx={{ padding: 4 }}
    >
      <DialogTitle>
        <FireIcon />
        <Typography>Burn {row?.id}</Typography>
        <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon fontSize="small" color="disabled" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" fontSize={13} gutterBottom>
          Select Token ID to burn
        </Typography>
        <Select size="small" fullWidth>
          <MenuItem value={10}>10 (Limited)</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions sx={{ '&.MuiDialogActions-root': { padding: '24px' } }}>
        <Button variant="contained" fullWidth disabled={processing} onClick={onBurnClick}>
          {processing ? 'Processing...' : `Burn`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
