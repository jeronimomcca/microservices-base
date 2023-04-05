import './styles.css';
import Base from '../../views/base/Base'
import { useEffect, useState } from 'react';

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
      <Base appProps={appProps} onChangeAppProps={props.onChangeAppProps} view={currentViewObj} />
    </div> :
    "Loading..."
  return currentScreen;
}

export default App;
