import React, { Component } from 'react';

class AddVacation extends Component {
state={
  Destination:'',
  Description:'',
  Price:'',
  StartDate:'',
  EndDate:'',
  Image:''
}

  render() {
    return (
      <div className="App col-sm-4">
        <form>
          <div className='vacation' style={{ height: '480px' }}>
            <div className="form-group mx-sm-3 mb-2" style={{ height: '58px' }}>
              Destination:
            <label className="sr-only"></label>
              <input className="form-control" name='Destination' onChange={this.set.bind(this)} required></input><br />
            </div>

            <div className="form-group mx-sm-3 mb-2" style={{ height: '85px' }}>
              Description:
            <label className="sr-only"></label>
              <textarea className="form-control" name='Description' onChange={this.set.bind(this)} required></textarea><br />
            </div>

            <div className="form-group mx-sm-3 mb-2">
              Price:
            <label className="sr-only"></label>
              <input type='number' className="form-control" name='Price' onChange={this.set.bind(this)} required></input>
            </div>

            <div className="form-group mx-sm-3 mb-2">
              Start Date:
            <label className="sr-only"></label>
              <input className="form-control" type='date' name='StartDate' onChange={this.set.bind(this)} required></input>
            </div>

            <div className="form-group mx-sm-3 mb-2">
              End Date:
            <label className="sr-only"></label>
              <input className="form-control" type='date' name='EndDate' onChange={this.set.bind(this)} required></input>
            </div>

            <div className="form-group mx-sm-3 mb-2">
              Add Image:
            <div className="input-group">
                <div className="custom-file">
                  <input required className="custom-file-input" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" type="file" onChange={this.setFile.bind(this)} name="foo" accept="image/png, image/jpeg"></input>
                  <label className="custom-file-label" htmlFor="inputGroupFile04">Choose file</label>
                </div>
              </div>
            </div>
            <button type="submit" onClick={this.addVacation.bind(this)} className="btn btn-primary">Add</button>
          </div>
        </form>
      </div>
    );
  }


  setFile(ev) {
    this.setState({ Image: ev.target.files[0] })
  }

  set(ev) {
    this.setState({ [ev.target.name]: ev.target.value })
  }

  async addVacation() {
    if (this.state.Destination !== '' && this.state.Description !== '' && this.state.Price !== '' && this.state.StartDate !== '' && this.state.EndDate !== '' && this.state.newImage !== '') {
      var formData = new FormData();
      let stringify = JSON.stringify(this.state)
      formData.append('state', stringify);
      formData.append('foo', this.state.Image);
      await fetch('/addVacation', {
        method: 'POST',
        body: formData
      });
      this.props.rerender('AddVacation')
    }
    else {
      alert('plaese fill the input')
    }
  }

}

export default AddVacation;
