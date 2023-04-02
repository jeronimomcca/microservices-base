import styles from './table.module.css';
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@material-ui/core';

function Table({ data, onChangeData }) {
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


    switch(objType) {
      case "object":
        return JSON.stringify(val);
        break;
      case "boolean":
        return val ? "true" : "false";
        break;
      default:
        return val;
    }

  }

  const sortedData = data.slice().sort((a, b) => {
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
                value={stringifyProp( selectedRow[key])}
                onChange={(event) => setSelectedRow({...selectedRow, [key]: tryParseJSON(event.target.value)})}
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
