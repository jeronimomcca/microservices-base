import './Base.css';
import fetchUrl from '../../hooks/fetchUrl';
import { useEffect, useState } from 'react';
import Table from '../../components/dataTable'
import { BASE_API_ROUTE } from '../../settings'

function Base(props) {

  const view = props.view
  const viewFetchUri = view.get;
  const viewUpdate = view.update;
  const viewDelete = view.delete;
  const appProps = props.appProps;
  let viewData = appProps.viewData;
  let setViewData = (data) => {
      props.onChangeAppProps({...appProps, viewData:data});
  }

  let query = view.query

  let request = fetchUrl({ uri: viewFetchUri + encodeURIComponent(JSON.stringify(query)) });

  const changeRecord = (targetObj, operation) => {
    targetObj.object = view.object;

    if (operation === "update") {
      console.log(`updating ${JSON.stringify(targetObj)}`)
      fetch(`${BASE_API_ROUTE}${viewUpdate}${encodeURIComponent(JSON.stringify(targetObj))}`)
        .then((data) => data.json())
        .then(updatedObj => {
          setViewData(viewData.map(obj => {
            if (obj.id === updatedObj.id) {
              return updatedObj;
            }
            return obj;
          }))
        })
    }
    else if (operation === "delete") {
      console.log(`deleting ${JSON.stringify(targetObj)}`)
      fetch(`${BASE_API_ROUTE}${viewDelete}${encodeURIComponent(JSON.stringify(targetObj))}`)
        .then((data) => data.json())
        .then(deleteObj => {
          setViewData(viewData.filter(obj => obj.id !== deleteObj.id))
        })
    }
  }

  useEffect(() => {
    if (request && request[0]){
      props.onChangeAppProps({ ...appProps, currentViewProps: Object.keys(request[0]),  viewData: request });

    }
  }, [request])

  let currentScreen = viewData ?
    <div className="Base-content">
      <Table data={viewData} onChangeData={changeRecord} />
    </div> :
    "Loading base"
  return currentScreen;
}

export default Base;
