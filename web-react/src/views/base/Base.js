import './Base.css';
import fetchData from '../../hooks/fetchData';
import editDataObj from '../../hooks/editObject';
import deleteDataObj from '../../hooks/deleteObject';
import { useEffect, useState } from 'react';
import Table from '../../components/dataTable';
import Loading from '../../components/loading/loading';
import store from '../../stores/store';
import { observer } from 'mobx-react-lite';

function Base(props) {

  const view = props.view
  const viewFetchUri = view.get;
  const viewUpdate = view.update;
  const viewDelete = view.delete;
  let viewData = store.appProps.viewData;

  let setViewData = (data) => {
    store.setAppProps({ viewData: data });
  }

  let query = view.query



  console.log(`Base: store.appProps.viewData: ${JSON.stringify(store.appProps.viewData)}`);
  console.log(`Base: view: ${JSON.stringify(view)}`);


   fetchData({ uri: viewFetchUri + encodeURIComponent(JSON.stringify(query)) });

 
  // useEffect(() => {
  //   if (request && request[0]) {
  //     store.setAppProps({ currentViewProps: Object.keys(request[0]), viewData: request });
  //     console.log(`======= request: ${JSON.stringify(request)}`)
  //   }
  // }, [])


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
