import './Base.css';
import fetchData from '../../hooks/fetchData';
import editDataObj from '../../hooks/editObject';
import deleteDataObj from '../../hooks/deleteObject';
import { useEffect } from 'react';
import Table from '../../components/dataTable';
import Loading from '../../components/loading/loading';

function Base(props) {

  const view = props.view
  const viewFetchUri = view.get;
  const viewUpdate = view.update;
  const viewDelete = view.delete;
  const appProps = props.appProps;
  let viewData = appProps.viewData;
  let setViewData = (data) => {
    props.onChangeAppProps({ ...appProps, viewData: data });
  }

  let query = view.query

  let request = fetchData({ uri: viewFetchUri + encodeURIComponent(JSON.stringify(query)) });

  useEffect(() => {
    if (request && request[0]) {
      props.onChangeAppProps({ ...appProps, currentViewProps: Object.keys(request[0]), viewData: request });

    }
  }, [request])

  let currentScreen = viewData ?
    <div className="Base-content">
      <Table data={viewData} onChangeData={changeRecord} />
    </div> :
    <div className="loading-fullcontainer">
      <Loading />
      <h1>Loading View Data</h1>
    </div>


  return currentScreen;


  function changeRecord(targetObj, operation) {
    targetObj.object = view.object;

    if (operation === "update") {
      console.log(`updating ${JSON.stringify(targetObj)}`)
      editDataObj(`${viewUpdate}${encodeURIComponent(JSON.stringify(targetObj))}`)
        .then(data => {
          const updatedObj = data[0];
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
    else if (operation === "delete") {
      console.log(`deleting ${JSON.stringify(targetObj)}`)
      deleteDataObj(`${viewDelete}${encodeURIComponent(JSON.stringify(targetObj))}`)
        .then(deleteObj => {
          setViewData(viewData.filter(obj => obj.id !== deleteObj.id))
        })
        .catch(error => console.log(error))
    }
  }
}

export default Base;
