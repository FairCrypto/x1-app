import { MenuItem } from '@mui/material';
import Link from 'next/link';
import React from 'react';

import type { LinkTabProps } from '@/config/types';

// import Link from '../Link';

export const StyledMenuItem = ({
  props,
  item,
  isCurrent,
  onClick
}: {
  props: LinkTabProps;
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
      color: isCurrent ? props.theme.palette.text.primary : props.theme.palette.text.secondary,
      fontSize: '13pt',
      fontWeight: isCurrent ? '900' : '600'
    }}
  >
    {item.label}
  </MenuItem>
);

StyledMenuItem.displayName = 'StyledMenuItem';
