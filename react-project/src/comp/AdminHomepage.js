import React, { Component } from 'react';
import MapAdminVacations from './MapAdminVacations'
import AddVacation from './AddVacation'
import NavBar from './NavBar'
import Reports from './Reports';

class AdminHomepage extends Component {

  state = {
    Name: ''
  }

  async componentDidMount() {
    const Response = await fetch('/LoadVacation')
    const res = await Response.json();
    this.setState({ Vacations: res, Name: 'Home' })
  }

  render() {
    switch (this.state.Name) {
      case 'Home':
        return (
          <div className="App">
            <NavBar apprefreshing={this.props.apprefreshing.bind(this)} rerender={this.rerender.bind(this)} />
            <div className="App container">
              <div className='row'>
                {this.state.Vacations.map(r => <MapAdminVacations key={r.id}
                  Followers={r.Followers}
                  Description={r.Description}
                  Destination={r.Destination}
                  Image={r.Image}
                  Price={r.Price}
                  StartDate={r.StartDate}
                  EndDate={r.EndDate}
                  id={r.id}
                  rerender={this.componentDidMount.bind(this)}
                />
                )}
              </div>
            </div>
          </div>
        );

      case 'Reports':
        return (
          <div>
            <NavBar apprefreshing={this.props.apprefreshing.bind(this)} rerender={this.rerender.bind(this)} />
            <Reports Vacations={this.state.Vacations}/>
          </div>
        )

      case 'AddVacation':
        return (
          <div>
            <NavBar apprefreshing={this.props.apprefreshing.bind(this)} rerender={this.rerender.bind(this)} />
            <div className='container'>
              <div className='row'>
                <div className="mx-auto" >
                  <AddVacation rerender={this.componentDidMount.bind(this)} />
                </div>
              </div>
            </div>
          </div>
        )
      default:

        return (
          <div></div>
        )
    }
  }

  rerender(name) {
    this.setState({ Name: name })
  }

}

export default AdminHomepage;
