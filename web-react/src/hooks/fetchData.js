import { useEffect, useState } from 'react';
import {BASE_API_ROUTE, FETCH_DATA_RETRY_TIMEOUT} from '../settings'
import store from '../stores/store';
function App(props) {

  let [hasRequest] = useState(false);
  let [hasResponse, setHasResponse] = useState(false);

  const scheduleApiCall = () => {
    fetch( BASE_API_ROUTE + props.uri)
      .then(response => response.json())
      .then(data =>  {
        store.setAppProps({ currentViewProps: Object.keys(data[0]), viewData: data });
        setHasResponse(true);
        hasRequest = false;
      })
      .catch((error) => {
        console.log(`==========Error fetching data: ${JSON.stringify(error)}`)
        setTimeout(() => scheduleApiCall() , [FETCH_DATA_RETRY_TIMEOUT]);
        hasRequest = false;
      });
  }

  useEffect(() => {
    if( !hasRequest && props.uri) {
      console.log(`============ Looking for data at: ${props.uri}`);
      scheduleApiCall();  
      hasRequest = true;
    }
  }, [props.uri]);

  return hasResponse;
}

export default App;