import { useEffect, useState } from 'react';
import {BASE_API_ROUTE} from '../settings'

function App(props) {

  const [response, setResponse] = useState(null);
  let [hasRequest] = useState(false);

  const scheduleApiCall = () => {
    fetch( BASE_API_ROUTE + props.uri)
      .then(response => response.json())
      .then(data => setResponse(data))
      .catch(error => setResponse(error));

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
