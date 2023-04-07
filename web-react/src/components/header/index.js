import './styles.css';
import Menu from '../menu'
import { BASE_API_ROUTE } from '../../settings'
import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

function App(props) {
  let configuration = props.configuration;
  let onChangeAppProps = props.onChangeAppProps;
  let appProps = props.appProps;
  const [createOpen, setCreateOpen] = useState(false);
  const [createObj, setCreateObj] = useState({});
  let [currentViewObj, setCurrentViewObj] = useState(undefined);
  let currentView = appProps.currentView;

  useEffect(() => {
    if (configuration) {
      setCurrentViewObj(configuration.views.find((view) => view.name === currentView))
    }
  }, [appProps.currentView, configuration, currentView])

  const callCreateForm = () => {
    if (currentViewObj) {
      setCreateOpen(true)
      console.log(JSON.stringify(createObj))
      fetch(`${BASE_API_ROUTE}${currentViewObj.create}${encodeURIComponent(JSON.stringify({ ...createObj, object: currentViewObj.object }))}`)
        .then((data) => data.json())
        .then(addObj => {
          console.log(JSON.stringify(addObj));
          let aux =  appProps.viewData.slice();
          console.log(JSON.stringify(aux));
          onChangeAppProps({ ...appProps, viewData: [...aux, addObj] });
        })
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
    </header>

  );
}

export default App;
