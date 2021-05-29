import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://127.0.0.1:8000');

export default class App extends Component {

  onButtonClicked = () => {
    client.send(JSON.stringify({
      type: "message",
      username: "username",
      value: "0.01"
    }));
  }
  componentDidMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      console.log('Message');

      const dataFromServer = JSON.parse(message.data)
      console.log('got reply! ', dataFromServer);
    };
  }
  
  render() {
    return (
      <div>
        <button onClick={() => this.onButtonClicked()}>BID</button> 
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

