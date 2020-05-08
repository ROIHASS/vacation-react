import React, { Component } from 'react';

class MapVacations extends Component {
  state = {
    checked: this.props.checked
  }


  render() {
    return (
      <div className="App col-sm-4">
        <div className='vacation'>
          <ul className="ks-cboxtags" style={{padding:'0px', marginBottom:'0px'}}>
            <li>
              <input type='checkbox' value='Follow' id={"checkbox" + this.props.id} checked={this.state.checked} onChange={this.check.bind(this)} />
              <label htmlFor={"checkbox" + this.props.id} style={{padding:' 1px 6px', float:'right', marginRight:'15px', marginTop: '10px'}}>Follow</label>
            </li>
          </ul>
          <br/><br/>
          <h6><b>Destination: </b>{this.props.Destination}</h6>
          <img src={'' + this.props.Image} alt={this.props.Image} /><br />
          <b>Description: </b><textarea readOnly value={this.props.Description}></textarea><br />
          <span><b>Price: </b>{this.props.Price}<b> $</b></span><br />
          <span><b>Dates: </b>{this.props.StartDate} - {this.props.EndDate}</span>
        </div>
      </div>
    );
  }

  async check(ev) {
    switch (ev.target.checked) {
      case true:
        this.setState({ checked: true })
        await fetch('/StartFollow', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.props)
        });
        break;
      case false:
        this.setState({ checked: false })
        await fetch('/EndFollow', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.props)
        });
        break;
      default:
    }
  }
}

export default MapVacations;
