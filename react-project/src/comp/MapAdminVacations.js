import React, { Component } from 'react';
import EditVacation from './EditVacation';
import ShowVacation from './ShowVacation';

class MapAdminVacations extends Component {

  state = {
    ShowOrEdit: ''
  }
  componentDidMount() {
    this.setState({ ShowOrEdit: 'ShowVacation' })
  }

  showOrEdit(name) {
    this.setState({ ShowOrEdit: name })
  }

  render() {
    switch (this.state.ShowOrEdit) {
      case 'ShowVacation':
        return (
          <ShowVacation
            Followers={this.props.Followers}
            Destination={this.props.Destination}
            id={this.props.id}
            Image={this.props.Image}
            Description={this.props.Description}
            Price={this.props.Price}
            StartDate={this.props.StartDate}
            EndDate={this.props.EndDate}
            EditVacation={this.showOrEdit.bind(this)}
            rerender={this.props.rerender.bind(this)}
          />
        )
      case 'EditVacation':
        return (
          <EditVacation
            Destination={this.props.Destination}
            id={this.props.id}
            Image={this.props.Image}
            Description={this.props.Description}
            Price={this.props.Price}
            StartDate={this.props.StartDate}
            EndDate={this.props.EndDate}
            ShowVacation={this.showOrEdit.bind(this)}
            rerender={this.props.rerender.bind(this)}
          />
        )
      default:
        return (
          <div className="App">
            <img className='imgStyle' src="ajax-loader-big.gif" alt="icon" />
          </div>
        )
    }
  }
}

export default MapAdminVacations;
