import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button, ClickAwayListener, Divider, MenuList, Paper, Popper } from '@mui/material';
import React, { useEffect, useState } from 'react';

import type { LinkTabProps } from '@/config/types';

import { StyledButton } from './StyledButton';
import { StyledMenuItem } from './StyledMenuItem';

export const LinkTab = (props: LinkTabProps) => {
  const { menuEl, setMenuEl, ...otherProps } = props;
  const isCurrent = props.items?.some(i => i.href === props.current);
  const menuOpen = Boolean(menuEl) && menuEl?.id.endsWith(props.label || '');
  const [items, setItems] = useState<LinkTabProps[]>([]);
  useEffect(() => {
    setItems(props?.items as LinkTabProps[]);
  }, [props.items, menuEl]);
  const handleMenuClick = label => event => {
    if (setMenuEl) setMenuEl(menuEl ? null : event.target);
  };
  const projectsId = menuOpen ? `projects_menu_${props.label}` : undefined;
  return (
    <>
      {!props.label && <Divider component="span" orientation="vertical" />}
      {props.href && <StyledButton props={otherProps} is_current={!!isCurrent} />}
      {items?.length > 0 && (
        <>
          <Button
            {...otherProps}
            id={`projects_menu_${props.label}`}
            disableRipple
            disableFocusRipple
            disableTouchRipple
            endIcon={
              menuOpen ? (
                <KeyboardArrowUpIcon onClick={handleMenuClick(props.label)} />
              ) : (
                <KeyboardArrowDownIcon onClick={handleMenuClick(props.label)} />
              )
            }
            onClick={handleMenuClick(props.label)}
            sx={{
              textTransform: 'initial',
              color: isCurrent ? 'text.primary' : 'text.secondary',
              fontSize: '13pt',
              fontWeight: isCurrent ? '900' : '600'
            }}
          >
            {props.label}
          </Button>
          <Popper
            open={!!menuOpen}
            id={projectsId}
            anchorEl={menuEl}
            role={undefined}
            placement="bottom-start"
            disablePortal
            // placeholder={''}
            // onPointerEnterCapture={undefined}
            // onPointerLeaveCapture={undefined}
          >
            <ClickAwayListener onClickAway={handleMenuClick(props.label)}>
              <Paper>
                <MenuList
                  autoFocusItem={menuOpen}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                >
                  {items?.map(item => (
                    <StyledMenuItem
                      key={item.label}
                      item={item}
                      onClick={handleMenuClick(props.label)}
                      isCurrent={item.href === props.current}
                    />
                  ))}
                </MenuList>
              </Paper>
            </ClickAwayListener>
          </Popper>
        </>
      )}
    </>
  );
};
