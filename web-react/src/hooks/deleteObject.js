import { BASE_API_ROUTE } from '../settings'
import store from '../stores/store';

function App(obj) {
  let viewData = store.appProps.viewData;

  let setViewData = (data) => {
    store.setAppProps({ viewData: data });
  }
  return fetch(BASE_API_ROUTE + obj)
    .then((response) => response.json())
    .then(deleteObj => {
      setViewData(viewData.filter(obj => obj.id !== deleteObj.id))
    })
    .catch(error => console.log(error));
}

export default App;
