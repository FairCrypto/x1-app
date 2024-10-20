'use client';

import LaunchIcon from '@mui/icons-material/Launch';
import { Button } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import React from 'react';

import { BurnXenDialog } from '@/app/x1/moon-party/burn-xen';
import { BurnXenftDialog } from '@/app/x1/moon-party/burn-xenft';
import type { IRow } from '@/app/x1/moon-party/state';

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
          onClick={item.value?.handler || (() => {})}
          size="small"
          variant="contained"
          sx={{ borderRadius: 25, textTransform: 'capitalize' }}
        >
          {item.value?.label || 'Burn'}
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

const MoonPartyTable = ({
  rows,
  isFetching,
  mode
}: {
  rows: IRow[];
  isFetching: boolean;
  mode: string;
}) => {
  const [open, setOpen] = React.useState(false);
  const [row, setRow] = React.useState<IRow>();
  return (
    <>
      {row?.id === 'XEN Crypto' && (
        <BurnXenDialog open={open} onClose={() => setOpen(false)} row={row} />
      )}
      {row?.id?.endsWith('XENFT') && (
        <BurnXenftDialog open={open} onClose={() => setOpen(false)} row={row} />
      )}
      <div style={{ height: '300px', width: '100%!important' }}>
        <DataGrid
          rows={rows.map((row, i) => ({
            ...row,
            burn_cta: row.burn_cta
              ? {
                  handler: () => {
                    setOpen(true);
                    setRow(row);
                  },
                  label: row.burn_cta
                }
              : undefined
          }))}
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
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none'
            },
            '& .MuiDataGrid-columnHeaders': {
              outline: 'none',
              borderBottom: 'none',
              backgroundColor: mode === 'dark' ? '#1A1D21' : undefined
            }
          }}
        />
      </div>
    </>
  );
};

export default MoonPartyTable;
