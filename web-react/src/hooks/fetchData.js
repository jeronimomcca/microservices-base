import { useEffect, useState } from 'react';
import {BASE_API_ROUTE, FETCH_DATA_RETRY_TIMEOUT} from '../settings'

function App(props) {

  const [response, setResponse] = useState(null);
  let [hasRequest] = useState(false);

  const scheduleApiCall = () => {
    fetch( BASE_API_ROUTE + props.uri)
      .then(response => response.json())
      .then(data => setResponse(data))
      .catch((error) => {
        setResponse(error);
        setTimeout(() => scheduleApiCall() , [FETCH_DATA_RETRY_TIMEOUT]);
      });
  }

  useEffect(() => {
    if( !hasRequest && props.uri) {
      console.log(`============ Looking for data at: ${props.uri}`);
      scheduleApiCall();  
      hasRequest = true;
    }
  }, [props.uri]);

  return response;
}

export default App;
