import { Box } from '@mui/material';

import State from '@/app/x1/moon-party/state';

import Subheader from './subheader';

const Page = () => (
  <Box
    sx={{
      minHeight: '80vh',
      // display: 'flex',
      alignItems: 'top',
      justifyContent: 'left',
      mx: 0,
      px: 2,
      width: '100%!important',
      '& .MuiContainer-root': { padding: 0 }
    }}
  >
    <Subheader />
    <Box sx={{ width: '100%!important' }}>
      <State />
    </Box>
  </Box>
);

export default Page;
