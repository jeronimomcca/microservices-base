import './Home.css';
import fetchUrl from '../../hooks/fetchUrl';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Wrapper from '../../components/wrapper'
import React, { useEffect, useState } from 'react';
import {CONFIG_URL} from '../../settings'

let AppProps = {
  "currentView": undefined,
  "viewData": undefined
}

function Home() {
  

  let [configuration, setConfiguration] = useState(undefined)

  const [appProps, setAppProps] = useState(AppProps)
  const changeAppProps = (value) => {
    setAppProps(value);
  }

  let requestConfiguration = fetchUrl({ uri: CONFIG_URL });

  useEffect(() => {
    if (requestConfiguration instanceof TypeError) {
      const fetchError = requestConfiguration;
      console.log(`==================== Error: ${fetchError}`)
    }
    else if (requestConfiguration && !configuration) {
      setConfiguration({ ...requestConfiguration });
      changeAppProps({ ...appProps, currentView: requestConfiguration.homeView });
    }
  }, [requestConfiguration, configuration, appProps])

  let currentScreen = configuration ?
  <div className="Home">
      <Header appProps={appProps} configuration={configuration} onChangeAppProps={changeAppProps} />
      <Wrapper appProps={appProps} configuration={configuration} onChangeAppProps={changeAppProps} />
      <Footer appProps={appProps} configuration={configuration} onChangeAppProps={changeAppProps} />
    </div> :
    "Loading..."

  return currentScreen;
}

export default Home;
