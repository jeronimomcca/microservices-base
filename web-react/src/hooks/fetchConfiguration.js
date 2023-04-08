import { useEffect, useState } from 'react';
import { BASE_API_ROUTE, CONFIG_URL, FETCH_CONFIG_RETRY_TIMEOUT  } from '../settings'

function App() {

  const [response, setResponse] = useState(null);
  let [hasRequest] = useState(false);

  const scheduleApiCall = () => {
    fetch(BASE_API_ROUTE + CONFIG_URL)
      .then(response => response.json())
      .then(data => setResponse(data))
      .catch((error) => {
        setResponse(error);
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

  return response;
}

export default App;
