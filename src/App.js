import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import 'semantic-ui-css/semantic.min.css'

import DnDMultiDrag from './components/DnDMultiDrag'

class App extends Component {
  render() {
    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <DnDMultiDrag />
      </div>
    );
  }
}

export default App;
