import './styles.css';
import Menu from '../menu'
import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Switch } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Search } from '@material-ui/icons';
import createObject from '../../hooks/createObject';
import { DEFAULT_FILTER_TYPE } from '../../settings';

function App(props) {
  let configuration = props.configuration;
  let onChangeAppProps = props.onChangeAppProps;
  let appProps = props.appProps;
  const filterObj = appProps.viewFilter;

  const setFilterObj = (val) => {
    onChangeAppProps({ ...appProps, viewFilter: val });
  }

  const [createOpen, setCreateOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [createObj, setCreateObj] = useState({});

  const updateFilterType = () => {
    onChangeAppProps({ ...appProps, viewFilterType: !appProps.viewFilterType });
  }

  let [currentViewObj, setCurrentViewObj] = useState(undefined);
  let currentView = appProps.currentView;

  useEffect(() => {
    if (configuration) {
      setCurrentViewObj(configuration.views.find((view) => view.name === currentView));
      loadFilterProps();
    }
  }, [appProps.currentView, configuration, currentView])

  const callCreateForm = () => {
    if (currentViewObj) {
      setCreateOpen(true)
      console.log(JSON.stringify(createObj))
      createObject(`${currentViewObj.create}${encodeURIComponent(JSON.stringify({ ...createObj, object: currentViewObj.object }))}`)
        .then(addObjArray => {
          const addObj = addObjArray[0];
          console.log(JSON.stringify(addObj));
          let aux = appProps.viewData.slice();
          console.log(JSON.stringify(aux));
          onChangeAppProps({ ...appProps, viewData: [...aux, addObj] });
        })
        .catch(error => console.log(error));
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
    if (currentViewObj) {
      console.log(JSON.stringify(filterObj))

      handleFilterClose();
    }
  }

  const loadFilterProps = () => {
    if (appProps.currentViewProps) {
      let filterObjRed = appProps.currentViewProps.reduce((acc, curr) => {
        acc[curr] = "";
        return acc;
      }, {});

      setFilterObj(filterObjRed);
    }
  }


  const handleFilterOpen = () => {
    setFilterOpen(true);
    console.log(`---------${JSON.stringify(filterObj)}`)
    console.log(`---------${JSON.stringify(appProps.currentViewProps)}`)
    if (Object.keys(filterObj).length != Object.keys(appProps.currentViewProps).length)
      loadFilterProps();
  };

  const handleFilterClose = () => {
    setFilterOpen(false);
  };

  const handleClearFilterClose = () => {
    setFilterOpen(false);
    loadFilterProps();
    if (appProps.viewFilterType != DEFAULT_FILTER_TYPE)
      onChangeAppProps({ ...appProps, viewFilterType: DEFAULT_FILTER_TYPE });
  };

  return (

    <header className="Header">
      <table className='Header-full'>
        <tbody>
          <tr>
            <td className='Header-menu'>
              <Menu configuration={configuration} appProps={appProps} onChangeAppProps={onChangeAppProps} />
            </td>
            <td className='Header-view'>
              {currentView}
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
            {appProps && appProps.currentViewProps && Object.keys(appProps.currentViewProps).map((key, val) => (
              <TextField
                key={appProps.currentViewProps[key]}
                label={appProps.currentViewProps[key]}
                value={createObj[val]}
                onChange={(event) => setCreateObj({ ...createObj, [appProps.currentViewProps[key]]: event.target.value })}
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
            checked={appProps.viewFilterType}
            onChange={updateFilterType}
            color='blue'
          />
          {appProps.viewFilterType ? "AND" : "OR"} </div> </DialogTitle>
        <DialogContent>
          <form>
            {appProps && appProps.currentViewProps && Object.keys(appProps.currentViewProps).map((key, val) => (
              <TextField
                key={appProps.currentViewProps[key]}
                label={appProps.currentViewProps[key]}
                value={filterObj[appProps.currentViewProps[key].toString()]}
                onChange={(event) => setFilterObj({ ...filterObj, [appProps.currentViewProps[key]]: event.target.value })}
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
}

export default App;
