import styles from './table.module.css';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@material-ui/core';
import store from '../../stores/store';

function Table({ onChangeData }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleHeaderClick = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const tryParseJSON = (str) => {
    try {
      const obj = JSON.parse(str);
      return obj;
    } catch (e) {
      return str;
    }
  }

  const stringifyProp = (val) => {
    const objType = typeof val;


    switch (objType) {
      case "object":
        return JSON.stringify(val);
        break;
      case "boolean":
        return val ? "true" : "false";
        break;
      default:
        return String(val);
    }

  }
  
  const filter = store.appProps.viewFilter;
  const data = store.appProps.viewData;

  console.log(`======filter: ${JSON.stringify(filter)}`)

  let filteredData = store.appProps.viewData;
  if( Object.values(filter).some((value) => value !== ''))
    filteredData = store.appProps.viewFilterType ? data.filter((row) => {
      const filterProps = Object.keys(filter);

      // If any filter property does not match the corresponding row property, exclude the row
      return filterProps.every(prop => {
        const rowPropValue = stringifyProp(row[prop]).toLowerCase();
        const filterPropValue = filter[prop].toLowerCase();
        return rowPropValue.includes(filterPropValue);
      });
    }) :
    data.filter((row) => {
      const filterProps = Object.keys(filter);

      // If any filter property match the corresponding row property
      return filterProps.some(prop => {
        const rowPropValue = stringifyProp(row[prop]).toLowerCase();
        const filterPropValue = filter[prop].toLowerCase();
        if(filterPropValue === "")
          return false;
        return rowPropValue.includes(filterPropValue);
      });
    })

  const sortedData = filteredData.slice().sort((a, b) => {
    if (sortColumn !== null) {
      if (a[sortColumn] < b[sortColumn]) {
        return sortDirection === 'asc' ? -1 : 1;
      } else if (a[sortColumn] > b[sortColumn]) {
        return sortDirection === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  const handleClickRow = (event, row) => {
    setSelectedRow(row);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditRow(null);
  };

  const handleEditSave = () => {
    // Perform your save logic here
    onChangeData(selectedRow, "update")
    handleEditClose();
  };

  const handleDeleteSave = () => {
    // Perform your save logic here
    onChangeData(selectedRow, "delete")
    handleEditClose();
  };


  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            {Object.keys(data[0]).map(key => (
              <th key={key} onClick={() => handleHeaderClick(key)}>
                {key}
                {sortColumn === key &&
                  (sortDirection === 'asc' ? ' ▲' : ' ▼')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map(row => (
            <tr key={row.id} onClick={(event) => handleClickRow(event, row)}>
              {Object.values(row).map((value, i) => (
                <td key={i}>{stringifyProp(value)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Row</DialogTitle>
        <DialogContent>
          <form>
            {selectedRow && Object.keys(selectedRow).map(key => (
              <TextField
                key={key}
                label={key}
                value={stringifyProp(selectedRow[key])}
                onChange={(event) => setSelectedRow({ ...selectedRow, [key]: tryParseJSON(event.target.value) })}
                fullWidth
              />
            ))}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} color="primary">Save</Button>
          <Button onClick={handleDeleteSave} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Table;
