import './styles.css';
import Base from '../../views/base/Base'
import { useEffect, useState } from 'react';
import Loading from '../loading/loading';
import store from '../../stores/store';
import { observer } from 'mobx-react-lite';

const App = observer(() => {

  
  let [currentViewObj, setCurrentViewObj] = useState(undefined)
  
  useEffect(() => {
    if (store.configuration.views) {
      setCurrentViewObj(store.configuration.views.find((view) => view.name === store.appProps.currentView))
    }
    console.log(`-----------wrapper.currentViewObj: ${JSON.stringify(currentViewObj)}`);
    console.log(`-----------wrapper.store.appProps.currentView: ${JSON.stringify(store.appProps.currentView)}`)
  }, [store.appProps.currentView, store.configuration])

  let currentScreen = currentViewObj ?
    <div className="Wrapper">
      <Base view={currentViewObj} />
    </div> :
    <div className="loading-fullcontainer">
      <Loading />
      <h1>Loading View Data 1</h1>
    </div>
  return currentScreen;

});

export default App;
