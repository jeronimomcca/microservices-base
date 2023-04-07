import './Home.css';
import fetchConfiguration from '../../hooks/fetchConfiguration';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Wrapper from '../../components/wrapper'
import React, { useState } from 'react';
import Loading from '../../components/loading/loading';

let AppProps = {
  "currentView": undefined,
  "viewData": undefined
}

function Home() {

  let [configuration, setConfiguration] = useState(undefined)
  const [appProps, setAppProps] = useState(AppProps)

  let requestConfiguration = fetchConfiguration();

  applyConfiguration();


  let currentScreen = configuration ?
    <div className="Home">
      <Header appProps={appProps} configuration={configuration} onChangeAppProps={changeAppProps} />
      <Wrapper appProps={appProps} configuration={configuration} onChangeAppProps={changeAppProps} />
      <Footer appProps={appProps} configuration={configuration} onChangeAppProps={changeAppProps} />
    </div> :
    <div className="loading-fullcontainer">
      <Loading />
      <h1>Loading Configuration</h1>
    </div>
  return currentScreen;

  function changeAppProps(value) {
    setAppProps(value);
  }

  function applyConfiguration() {
    if (!requestConfiguration)
      return;
    if (requestConfiguration instanceof TypeError) {
      const fetchError = requestConfiguration;
      console.log(`==================== Error: ${fetchError}`);
    }
    else if (requestConfiguration && !configuration) {
      setConfiguration({ ...requestConfiguration });
      changeAppProps({ ...appProps, currentView: requestConfiguration.homeView });
    }
  }
}

export default Home;
