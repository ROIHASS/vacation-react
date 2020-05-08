import React, { Component } from 'react';
import Register from './comp/Register';
import Vacations from './comp/Vacations';
// import Bootstrap, {btn} from 'bootstrap'

class App extends Component {
  state = {}

  async componentDidMount() {
    const rawResponse = await fetch('/isUserLogin')
    debugger
    const bool = await rawResponse.json();
    debugger
    await this.setState({ isUserLogin: bool })
  }

  render() {
    switch (this.state.isUserLogin) {
      case true:
        return (
          <div className="App">
            <Vacations comp={this.componentDidMount.bind(this)} />
          </div>
        )

      case false:
        return (
          <div className="App">
            <Register comp={this.componentDidMount.bind(this)} />
          </div>
        )

      default:
        return (
          <div></div>
        )
    }
  }
}

export default App;
