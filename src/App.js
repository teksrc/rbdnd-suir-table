import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import 'semantic-ui-css/semantic.min.css'

import DnDTable from './components/DnDTable'
// import WithDimensionLocking from './components/with-dimension-locking'
// import WithFixedColumns from './components/with-fixed-columns'
import WithPortal from './components/with-portal'
import { quotes } from './data'
class App extends Component {
  render() {
    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        {/* <WithDimensionLocking initial={quotes} /> */}
        <WithPortal initial={quotes} />
        <DnDTable />
      </div>
    );
  }
}

export default App;
