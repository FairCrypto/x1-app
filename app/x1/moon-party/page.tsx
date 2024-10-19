import { Box, Typography } from '@mui/material';

import Global from '@/app/x1/moon-party/global';
import State from '@/app/x1/moon-party/state';

const Page = async () => (
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
    <Global />
    <Typography variant="h6" align="left" sx={{ mt: 2 }}>
      Your Assets
    </Typography>
    <Box sx={{ width: '100%!important', marginTop: 2 }}>
      <State />
    </Box>
  </Box>
);

export default Page;
