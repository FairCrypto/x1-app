import { Box, Grid, Stack, Typography } from '@mui/material';
import Image from 'next/image';

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
    <Box
      sx={{
        display: 'flex',
        height: '20vh',
        flexDirection: 'row',
        justifyContent: 'top',
        width: '100%!important',
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'primary.main',
        alignItems: 'center'
      }}
    >
      <Grid container direction="row">
        <Grid item xs={3}>
          <Box style={{ paddingLeft: '1rem' }}>
            <Image src="/moon.gif" alt="moon" width={100} height={100} />
          </Box>
        </Grid>
        <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body1" align="left">
              Current Cycle
            </Typography>
            <Typography
              variant="body1"
              color="primary"
              align="left"
              sx={{ p: { marginTop: '0!important' } }}
            >
              8 / 256
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body1" align="left">
              Time Remaining
            </Typography>
            <Typography
              variant="body1"
              color="primary"
              align="left"
              sx={{ p: { marginTop: '0!important' } }}
            >
              10:02:40
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body1" align="left">
              XNT Distribution
            </Typography>
            <Typography
              variant="body1"
              color="primary"
              align="left"
              sx={{ p: { marginTop: '0!important' } }}
            >
              50,000,000
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body1" align="left">
              Burn Points Allocated
            </Typography>
            <Typography
              variant="body1"
              color="primary"
              align="left"
              sx={{ p: { marginTop: '0!important' } }}
            >
              100,100,000
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
    <Box sx={{ width: '100%!important', marginTop: 2 }}>
      <State />
    </Box>
  </Box>
);

export default Page;
