import { useEffect, useState } from 'react';
import {BASE_API_ROUTE} from '../settings'

function App(props) {

  const [response, setResponse] = useState(null);

  useEffect(() => {
    fetch( BASE_API_ROUTE + props.uri)
      .then(response => response.json())
      .then(data => setResponse(data))
      .catch(error => setResponse(error));
  }, [props.uri]);

  return response;
}

export default App;
