import { useEffect, useState } from 'react';

function App(props) {

  const [configuration, setConfiguration] = useState(null);

  const BASE_DOMAIN = "http://localhost:10000"
  useEffect(() => {
    fetch( BASE_DOMAIN + props.uri)
      .then(response => response.json())
      .then(data => setConfiguration(data))
      .catch(error => setConfiguration(error));
  }, [props.uri]);

  return configuration;
}

export default App;
