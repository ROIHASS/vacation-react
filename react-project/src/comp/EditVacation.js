import React, { Component } from 'react';

class EditVacation extends Component {

  constructor(props) {
    super(props)
    this.state = props;
  }

  render() {

    return (
      <div className="App col-sm-4">
        <div className='vacation' style={{ height: '495px' }}>
          <div className="form-group mx-sm-3 mb-2" style={{ height: '58px' }}>
            Destination:
            <label className="sr-only"></label>
            <input className="form-control" name='Destination' onChange={this.set.bind(this)} value={this.state.Destination}></input><br />
          </div>

          <div className="form-group mx-sm-3 mb-2" style={{ height: '85px' }}>
            Description:
            <label className="sr-only"></label>
            <textarea className="form-control" name='Description' onChange={this.set.bind(this)} value={this.state.Description}></textarea><br />
          </div>

          <div className="form-group mx-sm-3 mb-2">
            Price:
            <label className="sr-only"></label>
            <input type='number' className="form-control" name='Price' onChange={this.set.bind(this)} value={this.state.Price}></input>
          </div>

          <div className="form-group mx-sm-3 mb-2">
            Start Date:
            <label className="sr-only"></label>
            <input className="form-control" type='date' name='StartDate' onChange={this.set.bind(this)} value={this.state.StartDate}></input>
          </div>

          <div className="form-group mx-sm-3 mb-2">
            End Date:
            <label className="sr-only"></label>
            <input className="form-control" type='date' name='EndDate' onChange={this.set.bind(this)} value={this.state.EndDate}></input>
          </div>
          <div className="form-group mx-sm-3 mb-2">
            Add Image:
            <div className="input-group">
              <div className="custom-file">
                <input className="custom-file-input" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" type="file" onChange={this.setFile.bind(this)} name="foo" accept="image/png, image/jpeg"></input>
                <label className="custom-file-label" htmlFor="inputGroupFile04">Choose file</label>
              </div>
            </div>
          </div>
          <button style={{ margin: '5px' }} onClick={this.cancel.bind(this)} type="button" className="btn btn-danger">cancel</button>
          <button onClick={this.sendEdit.bind(this)} type="button" className="btn btn-primary">Update</button>
        </div>
      </div>
    );
  }

  cancel() {
    this.props.ShowVacation('ShowVacation')
  }
  set(ev) {
    this.setState({ [ev.target.name]: ev.target.value })
  }

  setFile(ev) {
    this.setState({ newImage: ev.target.files[0] })
  }

  async sendEdit() {
    var formData = new FormData();
    let stringify = JSON.stringify(this.state)
    formData.append('state', stringify);
    formData.append('foo', this.state.newImage);
    let res = await fetch('/UpdateVacation', {
      method: 'PUT',
      body: formData
    });
    if (res) {
      await this.props.rerender()
      this.props.ShowVacation('ShowVacation')
    }
  }



}

export default EditVacation;
