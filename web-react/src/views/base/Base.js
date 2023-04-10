import './Base.css';
import fetchData from '../../hooks/fetchData';
import editDataObj from '../../hooks/editObject';
import deleteDataObj from '../../hooks/deleteObject';
import Table from '../../components/dataTable';
import Loading from '../../components/loading/loading';
import store from '../../stores/store';

function Base(props) {

  const view = props.view
  const viewFetchUri = view.get;
  const viewUpdate = view.update;
  const viewDelete = view.delete;

  let query = view.query
  fetchData({ uri: viewFetchUri + encodeURIComponent(JSON.stringify(query)) });

  let currentScreen = !store.appProps.viewData ?
    <div className="loading-fullcontainer">
      <Loading />
      <h1>Loading View Data 2</h1>
    </div> :
    <div className="Base-content">
      <Table onChangeData={changeRecord} />
    </div>

  return currentScreen;

  function changeRecord(targetObj, operation) {
    targetObj.object = view.object;

    if (operation === "update") {
      console.log(`updating ${JSON.stringify(targetObj)}`)
      editDataObj(`${viewUpdate}${encodeURIComponent(JSON.stringify(targetObj))}`)
        
    }
    else if (operation === "delete") {
      console.log(`deleting ${JSON.stringify(targetObj)}`)
      deleteDataObj(`${viewDelete}${encodeURIComponent(JSON.stringify(targetObj))}`)
        
    }
  }
}

export default Base;
