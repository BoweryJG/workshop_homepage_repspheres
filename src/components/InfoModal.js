import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * InfoModal - reusable modal component with RepSpheres styling
 *
 * Props:
 *  - open: boolean to control visibility
 *  - onClose: function to close the modal
 *  - title: title text for the modal
 *  - children: content of the modal
 */
export default function InfoModal({ open, onClose, title, children, maxWidth = 'xs' }) {
  return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={maxWidth}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            position: 'relative',
            background: 'rgba(20,14,38,0.6)',
            backdropFilter: 'blur(12px)',
            borderRadius: 3,
            color: '#fff',
            overflow: 'hidden',
            boxShadow:
              '0 0 0 2px rgba(0,255,198,0.6), 0 0 20px rgba(123,66,246,0.45)',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              padding: '2px',
              borderRadius: 3,
              background:
                'linear-gradient(135deg, rgba(123,66,246,0.8), rgba(0,255,198,0.8))',
              WebkitMask:
                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              pointerEvents: 'none',
            },
          },
        }}
      >
      <DialogTitle
        sx={{
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {title}
        <IconButton onClick={onClose} size="small" sx={{ color: '#fff' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        {children}
      </DialogContent>
    </Dialog>
  );
}
