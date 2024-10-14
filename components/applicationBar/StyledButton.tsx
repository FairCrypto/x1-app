import { Button } from '@mui/material';
import Link from 'next/link';
import React from 'react';

import type { LinkTabProps } from '@/config/types';

// import Link from '../Link';

export const StyledButton = ({
  props,
  is_current
}: {
  props: LinkTabProps;
  is_current: boolean;
}) => (
  <Button
    {...props}
    component={Link}
    href={props.href}
    target={props.href?.startsWith('http') ? '_blank' : undefined}
    role="navigation"
    disableRipple
    disableFocusRipple
    disableTouchRipple
    sx={{
      width: { xs: '100%', lg: 'auto' },
      justifyContent: 'start',
      textTransform: 'initial',
      color: is_current ? props.theme.palette.text.primary : props.theme.palette.text.secondary,
      fontSize: '13pt',
      fontWeight: is_current ? '900' : '600'
    }}
  >
    {props.label}
  </Button>
);

StyledButton.displayName = 'StyledButton';
