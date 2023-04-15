import { BASE_API_ROUTE } from '../settings';
import store from '../stores/store';

function updateDataOnApi(uri, obj) {
  const setViewData = (data) => {
    store.setAppProps({ viewData: data });
  }
  const viewData = store.appProps.viewData;

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj)
  };

  return fetch(`${BASE_API_ROUTE}${uri}`, requestOptions)
    .then((response) => response.json())
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

export default updateDataOnApi;
