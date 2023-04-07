import './styles.css';
import Base from '../../views/base/Base'
import { useEffect, useState } from 'react';
import Loading from '../loading/loading';
function App(props) {

  let configuration = props.configuration;
  let appProps = props.appProps;


  let [currentViewObj, setCurrentViewObj] = useState(undefined)
  let currentViewName = appProps.currentView
  useEffect(() => {
    if (configuration) {
      setCurrentViewObj(configuration.views.find((view) => view.name === currentViewName))
    }
  }, [appProps.currentView, configuration, currentViewName])

  let currentScreen = currentViewObj ?
    <div className="Wrapper">
      <Base appProps={props.appProps} onChangeAppProps={props.onChangeAppProps} view={currentViewObj} />
    </div> :
    <div className="loading-fullcontainer">
        <Loading />
        <h1>Loading View Data</h1>
      </div>
  return currentScreen;
}

export default App;
