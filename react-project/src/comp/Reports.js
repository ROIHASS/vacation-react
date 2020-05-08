import React, { Component } from 'react';
import CanvasJSReact from '../assets/canvasjs.react'
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Reports extends Component {

  state = {}

  componentDidMount() {
    this.vacation = []
    this.props.Vacations.forEach(r => {
      if (r.Followers > 0) {
        this.vacation.push({ label: r.id, y: r.Followers * 1, indexLabel: r.Destination})
      }
    });
    this.setState({ vacation: this.vacation })
  }

  render() {
    const options = {
      height: 570,
      animationEnabled: true,
      exportEnabled: true,
      theme: "light2", //"light1", "dark1", "dark2"
      title: {
        text: "Chart"
      },
      data: [{
        type: "column", //change type to bar, line, area, pie, etc
        //indexLabel: "{y}", //Shows y value on all Data Points
        indexLabelFontColor: "#5A5757",
        indexLabelPlacement: "outside",
        dataPoints: this.state.vacation
      }]
    }

    return (
      <div className='mx-auto'>
        <CanvasJSChart options={options} />
      </div>
    );
  }
}



export default Reports;
