'use client';

import { Box, Grid, Stack, styled, Typography } from '@mui/material';
import { formatDistanceStrict } from 'date-fns';
import Image from 'next/image';
import { useContext } from 'react';
import CountUp from 'react-countup';
import { useAccount } from 'wagmi';

import { MoonPartyContext } from '@/contexts/MoonParty';

const StyledBox = styled(Box)`
  background-color: ${({ theme }) => (theme.palette.mode === 'dark' ? '#131419' : '#e9e9e9')};
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  width: 100% !important;
`;

const StyledStack = styled(Stack)`
  width: 100%;
  margin: 0 0.3rem;
  padding: 1rem;
  background-color: ${({ theme }) => (theme.palette.mode === 'dark' ? '#1A1D21' : '#e0e0e0')};
  border-radius: 12px;
  :hover {
    background-color: ${({ theme }) =>
      theme.palette.mode === 'dark' ? '#222222!important' : '#cccccc!important'};
  }
`;

const StyledNumber = styled(Typography)`
  && {
    background: linear-gradient(to right, #59c3f9, #3070f6);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const formatBigInt = (value: bigint | undefined) =>
  Number((value || 0n) / BigInt('1000000000000000000'));

const Global = () => {
  const { address, chain } = useAccount();
  const { global, user } = useContext(MoonPartyContext);
  const endOfParty = global[chain?.id as number]?.endOfParty || BigInt(Date.now());
  const totalBurnPoints = global[chain?.id as number]?.totalBurnPoints || 0n;
  const totalAllocateXNTCredits = global[chain?.id as number]?.totalAllocateXNTCredits || 0n;

  return (
    <StyledBox>
      <Grid container direction="row">
        <Grid item xs={3} sm={6} lg={2}>
          <Box style={{ paddingLeft: '1rem' }}>
            <Image
              src="/moon.gif"
              alt="moon"
              width={100}
              height={100}
              unoptimized
              unselectable="on"
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} lg={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <StyledStack direction="column" spacing={2}>
            <Typography variant="body2" align="left">
              Time Remaining
            </Typography>
            <StyledNumber variant="h5" align="left">
              {formatDistanceStrict(new Date(), new Date(Number(endOfParty?.toString())), {
                unit: 'day'
              })}
            </StyledNumber>
          </StyledStack>
        </Grid>
        <Grid item xs={12} sm={6} lg={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <StyledStack direction="column" spacing={2}>
            <Typography variant="body2" align="left">
              XNT Distribution
            </Typography>
            <StyledNumber variant="h5" align="left">
              <CountUp
                end={formatBigInt(totalBurnPoints)}
                delay={0}
                duration={1.5}
                useEasing
                useGrouping
              />
            </StyledNumber>
          </StyledStack>
        </Grid>
        <Grid item xs={12} sm={6} lg={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <StyledStack direction="column" spacing={2}>
            <Typography variant="body2" align="left">
              Burn Points Allocated
            </Typography>
            <StyledNumber variant="h5" align="left">
              <CountUp
                end={formatBigInt(totalAllocateXNTCredits)}
                delay={0}
                duration={1.5}
                useEasing
                useGrouping
              />
            </StyledNumber>
          </StyledStack>
        </Grid>
      </Grid>
    </StyledBox>
  );
};

export default Global;
