import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { Menu as MnIcon } from '@material-ui/icons';
import './styles.css';
import store from '../../stores/store';

const ITEM_HEIGHT = 48;

export default function SimpleMenu(props) {

  const options = store.configuration.views ? store.configuration.views : []


  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChoose = (event) => {
    const view = event.currentTarget.getAttribute("id");
    console.log(`==vai tentar setar view: ${view} se essa for diferente de ${store.appProps.currentView}`)
    if (view && store.appProps.currentView !== view)
    store.setAppProps({ currentView: view, viewFilter: {} });
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let menuOptions = options.map((option) => (
    <MenuItem id={option.name} key={option.name} onClick={handleChoose}>
      {option.name}
    </MenuItem>
  ))

  return (
    <div>
      <Button id="Menu-Button" onClick={handleClick}>
        <MnIcon />
      </Button>
      <Menu
        id="views-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {menuOptions}
      </Menu>
    </div>
  );
}
