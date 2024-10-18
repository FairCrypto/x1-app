'use client';

import LaunchIcon from '@mui/icons-material/Launch';
import { Button } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import React from 'react';

const wei = 1_000_000_000_000_000_000n;
const fmtBigInt = (v: bigint | null | undefined) => (BigInt(v ?? 0n) / wei).toLocaleString();

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Asset', width: 150 },
  {
    field: 'acquire',
    headerName: 'Acquire',
    width: 200,
    renderCell: item =>
      item.value && (
        <>
          {item.value.buy && (
            <Button
              size="small"
              variant="outlined"
              href={item.value.buy}
              target="_blank"
              sx={{ borderRadius: 25, mr: 1, textTransform: 'capitalize' }}
              endIcon={<LaunchIcon fontSize="small" />}
            >
              Buy
            </Button>
          )}
          {item.value.mint && (
            <Button
              size="small"
              variant="outlined"
              href={item.value.mint}
              target="_blank"
              sx={{ borderRadius: 25, textTransform: 'capitalize' }}
              endIcon={<LaunchIcon fontSize="small" />}
            >
              Mint
            </Button>
          )}
        </>
      )
  },
  {
    field: 'balance',
    headerName: 'Liquid Amount',
    width: 200,
    type: 'number',
    align: 'right',
    valueFormatter: ({ value }) => fmtBigInt(value)
  },
  {
    field: 'burn_cta',
    headerName: 'Burn',
    width: 100,
    renderCell: item =>
      item.value && (
        <Button
          size="small"
          variant="contained"
          sx={{ borderRadius: 25, textTransform: 'capitalize' }}
        >
          {item.value}
        </Button>
      )
  },
  {
    field: 'burned',
    headerName: 'Burned Amount',
    width: 200,
    type: 'number',
    align: 'right',
    valueFormatter: ({ value }) => fmtBigInt(value)
  },
  { field: 'used_burns', headerName: 'Used Burns', width: 120 },
  { field: 'avail_burns', headerName: 'Avail Burns', width: 120 },
  { field: 'burn_points', headerName: 'Burn Points', width: 120 },
  {
    field: 'allocate_cta',
    headerName: 'Allocate',
    width: 120,
    renderCell: item => (
      <Button
        size="small"
        variant="contained"
        sx={{ borderRadius: 25, textTransform: 'capitalize' }}
      >
        {item.value}
      </Button>
    )
  },
  { field: 'allocated', headerName: 'Allocated', width: 100 }
];

const MoonPartyTable = ({ rows, isFetching }: { rows: any[]; isFetching: boolean }) => (
  <div style={{ height: '60vh', width: '100%!important' }}>
    <DataGrid
      rows={rows}
      columns={columns}
      autoPageSize
      hideFooter
      // checkboxSelection
      disableRowSelectionOnClick
      components={
        {
          // Footer: CustomFooterTotalComponent
          // NoRowsOverlay: CustomNoRowsComponent
        }
      }
      componentsProps={
        {
          // footer: { totalBurned },
          // noRowsOverlay: { noRowsLabel }
        }
      }
      // onStateChange={onStateChange}
      loading={isFetching}
      initialState={{
        sorting: {
          // sortModel: [{ field: 'maturityTs', sort: 'desc' }],
        }
      }}
    />
  </div>
);

export default MoonPartyTable;
