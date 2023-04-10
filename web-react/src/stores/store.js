import { makeObservable, observable, action } from 'mobx';
import {DEFAULT_FILTER_TYPE} from '../settings'
class Store {
  data = [];
  appProps = {
    "currentView": undefined,
    "viewData": undefined,
    "viewFilter": {},
    "viewFilterType": DEFAULT_FILTER_TYPE,
    "viewHeaders": []
  };
  configuration = {};

  constructor() {
    makeObservable(this, {
      data: observable,
      setData: action,
      appProps: observable, 
      setAppProps: action, 
      configuration: observable, 
      setConfiguration: action, 
    });
  }

  setData(data) {
    this.data = data;
  }
  setAppProps(data) {
    this.appProps = {...this.appProps, ...data};
  }
  setConfiguration(data) {
    this.configuration = data;
  }
}

const store = new Store();

export default store;
