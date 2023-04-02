import './Base.css';
import fetchUrl from '../../hooks/fetchUrl';
import { useEffect, useState } from 'react';
import Table from '../../components/dataTable'

function Base(props) {

  const view = props.view
  const viewFetchUri = view.get;
  const viewUpdate = view.update;
  const viewDelete = view.delete;

  const domainUrl = 'http://localhost:10000';

  let query = view.query
  let [viewData, setViewData] = useState(undefined)

  let request = fetchUrl({ uri: viewFetchUri + "/" + encodeURIComponent(JSON.stringify(query)) });

  const changeRecord = (targetObj, operation) => {
    targetObj.object = view.object;

    if (operation === "update") {
      console.log(`updating ${JSON.stringify(targetObj)}`)
      fetch(`${domainUrl}${viewUpdate}${encodeURIComponent(JSON.stringify(targetObj))}`)
    }
    else if (operation === "delete") {
      console.log(`deleting ${JSON.stringify(targetObj)}`)
      fetch(`${domainUrl}${viewDelete}${encodeURIComponent(JSON.stringify(targetObj))}`)
    }
  }

  useEffect(() => {
    setViewData(request)
  }, [request])

  let currentScreen = viewData ?
    <div className="Base-content">
      <Table data={viewData} onChangeData={changeRecord} />
    </div> :
    "Loading"
  return currentScreen;
}

export default Base;
