import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

import openSocket from 'socket.io-client';

import './w3.css';
//import "./components/charts-theme";

var divStyle = {
  margin: '0 16px'
};
var divStyle1 = {
  height: '100px'
};

var divStyle3 = {
  'margin-left': '320px'
};

var divStyle4 = {
  'z-index': '3',
  width: '320px'
};
var divStyle5 = {
  width: '70%'
};
var divStyle6 = {
  'padding-top': '0px'
};

var divStyle7 = {
  width: '100%'
};

var divHeader = {
  padding: '5px',
  'text-align': 'center',
  background: '#2196f3',
  color: 'white',
  'font-size': '30px'
};

const socket = openSocket('http://localhost:8000');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: 32,
      humidity: 78,
      fan: true,
      light: true
    };
    this.onChangeCheck = this.onChangeCheck.bind(this);
  }
  onChangeCheck(e) {
    console.log(e.target.checked + e.target.name);
    var sockpub = e.target.name + '-' + e.target.checked;
    socket.emit('sock-pub', sockpub);
    this.setState({
      [e.target.name]: e.target.checked
    });
  }

  componentDidMount() {
    socket.on('tempChannel', message => this.setState({ temp: message }));
    socket.on('humidityChannel', message =>
      this.setState({ humidity: message })
    );
  }

  logout = () => {
    localStorage.removeItem('jwtToken');
    window.location.reload();
  };

  render() {
    const { temp } = this.state;
    const { humidity } = this.state;
    return (
      <div id="parent">
        <nav
          class="w3-sidebar w3-bar-block w3-collapse w3-white w3-animate-left w3-card"
          style={divStyle4}
          id="mySidebar"
        >
          <a href="#" class="w3-bar-item w3-button w3-border-bottom w3-large">
            {' '}
            <img
              src={
                'https://www.beyondblue.org.au/app_themes/reskin/images/bb-logo.png'
              }
              style={divStyle5}
            />{' '}
          </a>
          <a class="w3-bar-item w3-button w3-dark-grey w3-button w3-hover-black w3-left-align">
            Dashboard{' '}
          </a>
          <div id="Demo1" class="w3-hide w3-animate-left" />
          <a
            href="http://127.0.0.1:8008/api/devicedata"
            class="w3-bar-item w3-button"
          >
            <i class="fa fa-hourglass-end w3-margin-right" />
            Logs
          </a>
          {localStorage.getItem('jwtToken') && (
            <a
              href="src/components/Login.js"
              onClick={this.logout}
              class="w3-bar-item w3-button"
            >
              <i class="fa fa-hourglass-end w3-margin-right" />
              Logout
            </a>
          )}
        </nav>

        <div class="w3-main" style={divStyle3}>
          <div class="w3-row-padding">
            <div style={divHeader}>
              <h1>Smart Home</h1>
            </div>
            <h2>Control Panel</h2>
            <p>Real Time Weather Information & Control Devices</p>
            <div class="w3-row-padding" style={divStyle}>
              <div class="w3-third">
                <div
                  style={divStyle1}
                  class="w3-card w3-container w3-yellow w3-margin-bottom"
                >
                  Temperature<h1>{temp} °C</h1>
                </div>
              </div>
              <div class="w3-third">
                <div
                  style={divStyle1}
                  class="w3-card-2 w3-container w3-blue w3-margin-bottom"
                >
                  Humidity <h1>{humidity} %</h1>
                </div>
              </div>
            </div>

            <div class="w3-row-padding" style={divStyle}>
              <div class="w3-third">
                <div
                  style={divStyle1}
                  class="w3-card w3-container w3-deep-orange w3-margin-bottom"
                >
                  <p>Fan Switch</p>

                  <label class="switch">
                    <input
                      type="checkbox"
                      name="fan"
                      checked={this.state.fan}
                      onChange={this.onChangeCheck}
                    />
                    <span class="slider round" />
                  </label>
                </div>
              </div>
              <div class="w3-third">
                <div
                  style={divStyle1}
                  class="w3-card-2 w3-container w3-deep-orange w3-margin-bottom"
                >
                  <p>Light Switch</p>

                  <label class="switch">
                    <input
                      type="checkbox"
                      name="light"
                      checked={this.state.light}
                      onChange={this.onChangeCheck}
                    />
                    <span class="slider round" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
