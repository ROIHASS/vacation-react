import React, { Component } from 'react';

class Logout extends Component {
  state = {}

  render() {
    return (
      <div className="App" >
        <button className='btn btn-danger' onClick={this.logout.bind(this)}>
        Logout &nbsp;
        <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>
    );
  }

  async logout() {
    const rawResponse = await fetch('/Logout')
    const content = await rawResponse.json();
    if (content.log) {
      this.props.apprefreshing()
    }
  }
}

export default Logout;
