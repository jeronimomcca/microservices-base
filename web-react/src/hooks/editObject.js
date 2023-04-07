import {BASE_API_ROUTE} from '../settings'

function App(obj) {

  return fetch( BASE_API_ROUTE + obj)
}

export default App;
