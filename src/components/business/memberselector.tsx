import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  List,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";
import UserIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import IconButton from "@mui/material/IconButton";
import Skeleton from "react-loading-skeleton";

import BoxDX from "../layout/boxdx";

const MemberSelector = forwardRef((props: any, ref: any) => {
  const members = props.list ?? [];
  const loading = props.loading ?? false;

  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const open = Boolean(anchorEl);

  useEffect(() => {
    // whenever the member list is refreshed, select the first item
    setSelectedIndex(0);
  }, [members]);

  const handleClickListItem = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event: any, index: number) => {
    setSelectedIndex(index);
    setAnchorEl(null);

    if (props.handleCallBack) props.handleCallBack(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useImperativeHandle(ref, () => ({
    membersList() {
      return members[selectedIndex];
    },
  }));

  const memberNameWithRelation = (memberInfo: any) => {
    if (memberInfo)
      return memberInfo.employeeName + " (" + memberInfo.relation + ")";
  };

  if (loading)
    return (
      <Skeleton
        containerClassName="skeleton-container"
        style={{ height: 56 }}
      />
    );
  else
    return (
      <BoxDX sx={{ width: "100%" }}>
        <List
          sx={{
            border: "1px red solid",
            borderRadius: "4px",
            borderColor: theme.palette.secondary.light,
            p: 0,
          }}
        >
          <ListItemButton onClick={handleClickListItem}>
            <ListItemIcon>
              <UserIcon />
            </ListItemIcon>
            <ListItemText
              primary={memberNameWithRelation(members[selectedIndex])}
            />
            <IconButton edge="end">
              <ArrowDropDownIcon sx={{ color: "#8B0037" }} />
            </IconButton>
          </ListItemButton>
        </List>
        <Menu
          id="lock-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          sx={{ width: "100%" }}
        >
          {members.map((m: any, index: number) => (
            <MenuItem
              key={"mem_" + index}
              selected={index === selectedIndex}
              onClick={(event) => handleMenuItemClick(event, index)}
            >
              {memberNameWithRelation(m)}
            </MenuItem>
          ))}
        </Menu>
      </BoxDX>
    );
});

export default MemberSelector;
