import { BASE_API_ROUTE } from '../settings'
import store from '../stores/store';

function App(uri,obj) {
  let viewData = store.appProps.viewData;

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj)
  };

  let setViewData = (data) => {
    store.setAppProps({ viewData: data });
  }
  return fetch(`${BASE_API_ROUTE}${uri}`, requestOptions)
    .then((response) => response.json())
    .then(deleteObj => {
      setViewData(viewData.filter(obj => obj.id !== deleteObj.id))
    })
    .catch(error => console.log(error));
}

export default App;
