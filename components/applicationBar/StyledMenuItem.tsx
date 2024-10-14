import { MenuItem } from '@mui/material';
import Link from 'next/link';
import React from 'react';

import type { LinkTabProps } from '@/config/types';

export const StyledMenuItem = ({
  item,
  isCurrent,
  onClick
}: {
  item: LinkTabProps;
  isCurrent: boolean;
  onClick: any;
}) => (
  <MenuItem
    component={Link}
    role="navigation"
    href={item.href as string}
    target={item.href?.startsWith('http') ? '_blank' : undefined}
    onClick={onClick}
    sx={{
      textTransform: 'initial',
      color: isCurrent ? 'text.primary' : 'text.secondary',
      fontSize: '13pt',
      fontWeight: isCurrent ? '900' : '600'
    }}
  >
    {item.label}
  </MenuItem>
);

StyledMenuItem.displayName = 'StyledMenuItem';
