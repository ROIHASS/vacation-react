import React, { Component } from 'react';


class Login extends Component {
  state = {
    UserName: '',
    Password: ''
  }

  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className="mx-auto" >
            <div className='login'>
              <h1>Welcome!</h1>
              <form>
                <div className="form-group mx-sm-3 mb-2" >
                  User Name:
                  <label className="sr-only"></label>
                  <input className="form-control loginInputs mx-auto" onChange={this.handale.bind(this)} name='UserName' type='text' placeholder='UserName'></input><br />
                </div>
                <div className="form-group mx-sm-3 mb-2">
                  Password:
                  <label className="sr-only"></label>
                  <input className="form-control loginInputs mx-auto" onChange={this.handale.bind(this)} name='Password' type='Password' placeholder='Password'></input><br />
                </div>

                <button className='btn btn-outline-info' style={{ margin: '10px' }} onClick={this.props.GoToRegister.bind(this)} type='button' name='Login' value='Go To Register'>
                  Go To Register
                </button>

                <button className='btn btn-outline-success' onClick={this.login.bind(this)} type='button'>
                  Login &nbsp;
                  <i className="fas fa-sign-in-alt"></i>
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handale(ev) {
    this.setState({ [ev.target.name]: ev.target.value })
  }

  async login() {
    if (this.state.UserName !== '' && this.state.Password !== '') {
      const rawResponse = await fetch('/Login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
      });
      const content = await rawResponse.json();
      if (content[0]) {
        this.props.comp()
      }
      else {
        alert(content.wrong)
      }
    }
    else {
      alert('plese fill the inputs')
    }
  }

}

export default Login;
