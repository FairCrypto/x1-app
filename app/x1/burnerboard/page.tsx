import { Box, Typography } from '@mui/material';

import Subheader from '@/app/x1/burnerboard/subheader';

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
    <Box
      sx={{
        width: '100%!important',
        height: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography variant="overline">Coming Soon</Typography>
    </Box>
  </Box>
);

export default Page;
