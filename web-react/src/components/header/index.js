import './styles.css';
import Menu from '../menu'
import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Switch } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Search } from '@material-ui/icons';
import createObject from '../../hooks/createObject';
import { DEFAULT_FILTER_TYPE } from '../../settings';
import store from '../../stores/store';
import { observer } from 'mobx-react-lite';

const App = observer(() => {

  const filterObj =  store.appProps.viewFilter;
  const setFilterObj = (val) => {
    store.setAppProps({ viewFilter: val });
  }

  const [createOpen, setCreateOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [createObj, setCreateObj] = useState({});

  const updateFilterType = () => {
    store.setAppProps({ viewFilterType: !store.appProps.viewFilterType });
  }

  let [currentViewObj, setCurrentViewObj] = useState(undefined);


  useEffect(() => {
    if (store.configuration.views) {
      setCurrentViewObj(store.configuration.views.find((view) => view.name === store.appProps.currentView));
      loadFilterProps();
    }
  }, [store.appProps.currentView, store.configuration])

  const callCreateForm = () => {
    if (currentViewObj) {
      setCreateOpen(true)
      console.log(JSON.stringify(createObj))
      createObject(currentViewObj.create, createObj);
      handleCreateClose();
    }
  }

  const handleCreateOpen = () => {
    setCreateOpen(true);
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
    setCreateObj({});
  };

  const callFilterForm = () => {
    if (currentViewObj)
      handleFilterClose();
  }

  const loadFilterProps = () => {
    if (store.appProps.currentViewProps) {
      let filterObjRed = store.appProps.currentViewProps.reduce((acc, curr) => {
        acc[curr] = "";
        return acc;
      }, {});

      setFilterObj(filterObjRed);
    }
  }


  const handleFilterOpen = () => {
    setFilterOpen(true);
    if (Object.keys(filterObj).length != Object.keys(store.appProps.currentViewProps).length)
      loadFilterProps();
  };

  const handleFilterClose = () => {
    setFilterOpen(false);
  };

  const handleClearFilterClose = () => {
    setFilterOpen(false);
    loadFilterProps();
    if (store.appProps.viewFilterType != DEFAULT_FILTER_TYPE)
      store.setAppProps({ viewFilterType: DEFAULT_FILTER_TYPE });
  };

  return (

    <header className="Header">
      <table className='Header-full'>
        <tbody>
          <tr>
            <td className='Header-menu'>
              <Menu />
            </td>
            <td className='Header-view'>
              {store.appProps.currentView}
            </td>
            <td className='Header-menu'>
              <Button onClick={handleCreateOpen}
                variant="contained"
                color="primary"
                id="green-button"
                startIcon={<AddIcon />} />
            </td>
            <td className='Header-menu'>
              <Button onClick={handleFilterOpen}
                variant="contained"
                color="primary"
                id="grey-button"
                startIcon={<Search />} />
            </td>
          </tr>
        </tbody>
      </table>
      <Dialog open={createOpen} onClose={handleCreateClose}>
        <DialogTitle>Create</DialogTitle>
        <DialogContent>
          <form>
            {store.appProps && store.appProps.currentViewProps && Object.keys(store.appProps.currentViewProps).map((key, val) => (
              <TextField
                key={store.appProps.currentViewProps[key]}
                label={store.appProps.currentViewProps[key]}
                value={createObj[val]}
                onChange={(event) => setCreateObj({ ...createObj, [store.appProps.currentViewProps[key]]: event.target.value })}
                fullWidth
              />
            ))}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose}>Cancel</Button>
          <Button onClick={callCreateForm} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={filterOpen} onClose={handleFilterClose}>
        <DialogTitle> <div> <p> Filter </p>
          <Switch
            checked={store.appProps.viewFilterType}
            onChange={updateFilterType}
            color='primary'
          />
          {store.appProps.viewFilterType ? "AND" : "OR"} </div> </DialogTitle>
        <DialogContent>
          <form>
            {store.appProps && store.appProps.currentViewProps && Object.keys(store.appProps.currentViewProps).map((key, val) => (
              <TextField
                key={store.appProps.currentViewProps[key]}
                label={store.appProps.currentViewProps[key]}
                value={filterObj[store.appProps.currentViewProps[key].toString()]}
                onChange={(event) => setFilterObj({ ...filterObj, [store.appProps.currentViewProps[key]]: event.target.value })}
                fullWidth
              />
            ))}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearFilterClose}>Clear Filters</Button>
          <Button onClick={callFilterForm} color="primary">Apply</Button>

        </DialogActions>
      </Dialog>
    </header>

  );
})

export default App;
