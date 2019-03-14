import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
// import WithDimensionLocking from './components/DnDTable/with-dimension-locking'
// import WithFixedColumns from './components/DnDTable/with-fixed-columns'
import WithPortal from './components/DnDTable/with-portal'
import TaskApp from './components/MultiDrag'
import SemanticUITable from './components/SemanticUIDnDTable'
import { quotes } from './data'

class App extends Component {
  render() {
    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        {/* <WithDimensionLocking initial={quotes} /> */}
        <WithPortal initial={quotes} />
        <TaskApp />
        <SemanticUITable />
      </div>
    );
  }
}

export default App;
