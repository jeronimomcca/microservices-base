import { BASE_API_ROUTE } from '../settings'
import store from '../stores/store';

function App(obj) {
  const setViewData = (data) => {
    store.setAppProps({ viewData: data });
  }
  const viewData = store.appProps.viewData;
  return fetch(BASE_API_ROUTE + obj).then((response) => response.json())
    .then(data => {
      const updatedObj = data.data[0];
      console.log(`----------${JSON.stringify(updatedObj)}`)
      setViewData(viewData.map(obj => {
        if (obj.id === updatedObj.id) {
          return updatedObj;
        }
        return obj;
      }))
    })
    .catch(error => console.log(error))
}

export default App;
