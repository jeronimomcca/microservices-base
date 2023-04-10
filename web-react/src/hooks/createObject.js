import { BASE_API_ROUTE } from '../settings'
import store from '../stores/store';

function App(obj) {

  return fetch(BASE_API_ROUTE + obj)
    .then((response) => response.json())
    .then(addObjArray => {
      const addObj = addObjArray.data[0];
      let aux = store.appProps.viewData.slice();
      store.setAppProps({ viewData: [...aux, addObj] });
    })
    .catch(error => console.log(error));
}

export default App;
