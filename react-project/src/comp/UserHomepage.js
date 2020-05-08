import React, { Component } from 'react';
import MapVacations from './MapVacations';
import Logout from './Logout';
import io from 'socket.io-client';


class UserHomepage extends Component {
  constructor() {
    super()
    this.socket = io('http://localhost:8888');
  }
  state = {
    reload:this.componentDidMount.bind(this)
  }

  async componentDidMount() {
    const Response = await fetch('/LoadVacation')
    const res = await Response.json();
    this.setState({ Vacations: res })
    const rawResponse = await fetch('/LoadUser')
    const content = await rawResponse.json();
    this.setState(content[0])
  }

  componentWillMount() {
    this.socket.on('reload',  (msg)=> {
      this.state.reload()
    });
  }

  render() {
    if (this.state.Vacations) {
      let style = {
        backgroundColor: '#6c757d',
        height: '55px'
      }
      return (

        <div className="App">
          <ul style={style} >
            <li style={{ color: 'aliceblue', fontSize: '25px' }} className="li btn" >
              hello {this.state.UserName}
            </li>
            <li style={{ float: 'right' }} className="li btn">
              <Logout apprefreshing={this.props.apprefreshing.bind(this)} />
            </li>
          </ul>
          <div className="App container">
            <div className='row'>
              {this.state.Vacations.map(r => <MapVacations key={r.id}
                Description={r.Description}
                Destination={r.Destination}
                Image={r.Image}
                Price={r.Price}
                StartDate={r.StartDate}
                EndDate={r.EndDate}
                id={r.id}
                checked={r.checked}
              />)}
            </div>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="mx-auto">
          <img src="ajax-loader-big.gif" alt="icon" />
        </div>
      )
    }
  }
}

export default UserHomepage;
