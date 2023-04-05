import { useEffect, useState } from 'react';
import {BASE_API_ROUTE} from '../settings'

function App(props) {

  const [configuration, setConfiguration] = useState(null);

  useEffect(() => {
    fetch( BASE_API_ROUTE + props.uri)
      .then(response => response.json())
      .then(data => setConfiguration(data))
      .catch(error => setConfiguration(error));
  }, [props.uri]);

  return configuration;
}

export default App;
