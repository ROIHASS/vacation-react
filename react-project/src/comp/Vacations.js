import React, { Component } from 'react';
import AdminHomepage from './AdminHomepage';
import UserHomepage from './UserHomepage';


class Vacations extends Component {
  state = {
    switch: ''
  }

  async componentDidMount() {
    const isIt = await fetch('/isAdmin')
    const isItJeson = await isIt.json();
    this.setState(isItJeson)
  }

  render() {
    switch (this.state.switch) {
      case 'AdminHomePage':
        return (
          <AdminHomepage apprefreshing={this.props.comp.bind(this)} comp={this.componentDidMount.bind(this)} />
        )

      case 'UserHomePage':
        return (
          <UserHomepage apprefreshing={this.props.comp.bind(this)} />
        )
      default:
        return (
          <div></div>
        )
    }
  }
}



export default Vacations;
