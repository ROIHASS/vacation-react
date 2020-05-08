import React, { Component } from 'react';
import Logout from './Logout';

class NavBar extends Component {


  render() {
    let style = {
      backgroundColor: '#6c757d'
    }
    return (
      <div className="App" style={style} >
        <ul style={{ marginBottom: '0px' }} >
          <li className="li btn" >
            <button className='btn btn-secondary' onClick={this.home.bind(this)}>
              <i className="fas fa-home"></i>&nbsp;
                Home
            </button>
          </li>
          <li className="li btn" >
            <button className='btn btn-secondary' onClick={this.Reports.bind(this)} >
              <i className="fas fa-chart-line"></i>&nbsp;
                Reports
            </button>

          </li>
          <li className="li btn">
            <button className='btn btn-secondary' onClick={this.AddVacation.bind(this)} >
              <i className="fas fa-plus"></i>&nbsp;
                Add Vacation
            </button>
          </li>
          <li style={{ float: 'right' }} className="li btn">
            <Logout apprefreshing={this.props.apprefreshing.bind(this)} />
          </li>
        </ul>
      </div>
    );
  }

  home() {
    this.props.rerender('Home')
    this.props.apprefreshing()
  }

  Reports() {
    this.props.rerender('Reports')
  }

  AddVacation() {
    this.props.rerender('AddVacation')
  }


}

export default NavBar;
