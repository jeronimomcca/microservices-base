import { useEffect, useState } from 'react';
import { BASE_API_ROUTE, CONFIG_URL, FETCH_CONFIG_RETRY_TIMEOUT  } from '../settings'
import store from '../stores/store';


function App() {

  const appProps = store.appProps;
  let [hasRequest] = useState(false);
 let [hasResponse, setHasResponse] = useState(false);

  const scheduleApiCall = () => {
    fetch(BASE_API_ROUTE + CONFIG_URL)
      .then(response => response.json())
      .then((data) => {
        store.setConfiguration(data);
        store.setAppProps({ currentView: data.views[0].name });
        setHasResponse(true);
      }) 
      .catch((error) => {
        console.log(`==========Error fetching configuration: ${JSON.stringify(error)}`)
        setTimeout(() => scheduleApiCall() , [FETCH_CONFIG_RETRY_TIMEOUT])
      });

  }

  useEffect(() => {
    if (!hasRequest) {
      console.log(`============ Looking for configuration at: ${CONFIG_URL}`);
      scheduleApiCall();
      hasRequest = true;
    }
  }, []);

return hasResponse;
}

export default App;


