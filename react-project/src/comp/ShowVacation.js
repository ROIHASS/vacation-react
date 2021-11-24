import React, { Component } from 'react';


class ShowVacation extends Component {


  render() {
    return (
      <div className="App col-sm-4">
        <div className='vacation'>
        <div className="flex-end">
        <div className='divofbuttons'> 
            <div style={{ cursor: 'help', marginTop: '4px', float: 'left', marginRight: '5px' }} title={this.props.Followers + ' followers'}>
        <i className="fas fa-chart-line"></i>
        </div>
     
          <button title='Edit vacation' type="button" onClick={this.edit.bind(this)} name={this.props.id} className="btn btn-default btn-sm">
          <i className="fas fa-pen"></i></button>
          <button title='Remove' type="button" onClick={this.remove.bind(this)} name={this.props.id} className="btn btn-default btn-sm">
          <i className="fas fa-times"></i></button>
          </div>
          </div>


          <h6><b>Destination: </b>{this.props.Destination}</h6>

          <img src={'' + this.props.Image} alt={this.props.Image} /><br />
          <b>Description: </b><textarea readOnly value={this.props.Description}></textarea><br />
          <span><b>Price: </b>{this.props.Price}<b> $</b></span><br />
          <span><b>Dates: </b>{this.props.StartDate} - {this.props.EndDate}</span>
        </div>
      </div>
    );
  }

  edit() {
    this.props.EditVacation('EditVacation')
  }

  async remove() {
    await fetch('/DeleteVacation', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.props)
    });
    this.props.rerender()
  }

}

export default ShowVacation;
