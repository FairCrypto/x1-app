import LaunchIcon from '@mui/icons-material/Launch';
import { Button } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import React from 'react';

const wei = 1_000_000_000_000_000_000n;
const fmtBigInt = (v: bigint | null | undefined) => (BigInt(v ?? 0n) / wei).toLocaleString();

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Asset', width: 200 },
  {
    field: 'buy_cta',
    headerName: 'Buy',
    width: 100,
    renderCell: item =>
      item.value && (
        <Button href={item.value} target="_blank" endIcon={<LaunchIcon fontSize="small" />}>
          Buy
        </Button>
      )
  },
  {
    field: 'mint_cta',
    headerName: 'Mint',
    width: 100,
    renderCell: item =>
      item.value && (
        <Button href={item.value} target="_blank" endIcon={<LaunchIcon fontSize="small" />}>
          Mint
        </Button>
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
    renderCell: item => item.value && <Button>{item.value}</Button>
  },
  {
    field: 'burned',
    headerName: 'Burned Amount',
    width: 200,
    type: 'number',
    align: 'right',
    valueFormatter: ({ value }) => fmtBigInt(value)
  },
  { field: 'used_burns', headerName: 'Used Burns', width: 100 },
  { field: 'avail_burns', headerName: 'Avail Burns', width: 100 },
  { field: 'burn_points', headerName: 'Burn Points', width: 100 },
  {
    field: 'allocate_cta',
    headerName: 'Allocate',
    width: 100,
    renderCell: item => <Button>{item.value}</Button>
  },
  { field: 'allocated', headerName: 'Allocated', width: 100 }
];

const MoonPartyTable = ({ rows, isFetching }: { rows: any[]; isFetching: boolean }) => (
  <div style={{ height: '60vh', width: '100%!important' }}>
    <DataGrid
      rows={rows}
      columns={columns}
      autoPageSize
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
