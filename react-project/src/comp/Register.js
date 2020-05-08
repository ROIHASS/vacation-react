import React, { Component } from 'react';
import Login from './Login';


class Register extends Component {
  state = {
    FirstName: '',
    LastName: '',
    UserName: '',
    Password: '',
    Login: 'Back To Login'
  }

  render() {
    if (this.state.Login === 'Back To Login') {
      return (
        <div className="App">
          <Login comp={this.props.comp.bind(this)} GoToRegister={this.GoToRegister.bind(this)} />
        </div>
      );
    }

    else if (this.state.Login === 'Go To Register') {
      return (
        <div className='container'>
          <div className='row'>
            <div className="mx-auto" >
              <div className='register'>
                <h1>Welcome!</h1>
                <form>
                  <div className="form-group mx-sm-3 mb-2" style={{ marginTop: '10px', height: '70px' }}>
                    First Name:
                <label className="sr-only"></label>
                    <input className="form-control loginInputs mx-auto" onChange={this.handale.bind(this)} name='FirstName' type='text' placeholder='FirstName'></input><br /> <br />
                  </div>

                  <div className="form-group mx-sm-3 mb-2" style={{ marginTop: '10px', height: '70px' }}>
                    Last Name:
                <label className="sr-only"></label>
                    <input className="form-control loginInputs mx-auto" onChange={this.handale.bind(this)} name='LastName' type='text' placeholder='LastName'></input><br /> <br />
                  </div>

                  <div className="form-group mx-sm-3 mb-2" style={{ marginTop: '10px', height: '70px' }}>
                    User Name:
                <label className="sr-only"></label>
                    <input className="form-control loginInputs mx-auto" onChange={this.handale.bind(this)} name='UserName' type='text' placeholder='UserName'></input><br /> <br />
                  </div>

                  <div className="form-group mx-sm-3 mb-2" style={{ marginTop: '10px', height: '70px' }}>
                    Password:
                <label className="sr-only"></label>
                    <input className="form-control loginInputs mx-auto" onChange={this.handale.bind(this)} name='Password' type='Password' placeholder='Password'></input><br /> <br />
                  </div>

                  <button className='btn btn-outline-info' style={{margin:'10px'}} onClick={this.handale.bind(this)} type='button' name='Login' value='Back To Login'>
                  <i className="fas fa-arrow-circle-left"></i>&nbsp;
                  Back To Login
                  </button>

                  <button className='btn btn-outline-success' onClick={this.register.bind(this)} type='button' value='Register'>
                  Register
                  &nbsp;
                  <i className="fas fa-sign-in-alt"></i>
                  </button>

                </form>
              </div>
            </div>
          </div>
        </div>

    );
    }
  }


  handale(ev) {
    this.setState({ [ev.target.name]: ev.target.value })
  }

  GoToRegister() {
    this.setState({ Login: 'Go To Register' })
  }

  async register() {
    if (this.state.FirstName !== '' && this.state.LastName !== '' && this.state.UserName !== '' && this.state.Password !== '') {
      const rawResponse = await fetch('/Register', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
      });
      const content = await rawResponse.json();
      if (content.wrong) {
        alert(content.wrong)
      }
      else if (content.done) {
        this.props.comp()
      }
    }
    else {
      alert('plese fill the inputs')
    }
  }
}

export default Register;
