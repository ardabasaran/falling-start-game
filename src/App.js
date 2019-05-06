import React, { Component } from 'react';
import Sky from './Sky';
import './App.css'

const SKY_WIDTH = 500;
const SKY_HEIGHT = 500;

class App extends Component {
  state = {
    sky: new Sky(16, 16, 4) 
  }

  drawSky = () => {
    let width = this.state.sky.width
    let height = this.state.sky.height
    let regions = this.state.sky.regions
    let clusters = this.state.sky.clusters
    let stars = this.state.sky.stars
  

    let styles = new Array(height)
    for (let i = 0; i < height; i++) {
      styles[i] = new Array(width)
      for (let j = 0; j < width; j++) {
        styles[i][j] = {}
        styles[i][j]['background-color'] = '#eaece5'
        if (regions[i][j].upBlocked) {
          styles[i][j]['border-top'] = '3px solid #3b3a30';
        } else {
          styles[i][j]['border-top'] = '3px solid transparent';
        }
        if (regions[i][j].downBlocked) {
          styles[i][j]['border-bottom'] = '3px solid #3b3a30';
        } else {
          styles[i][j]['border-bottom'] = '3px solid transparent';
        }
        if (regions[i][j].leftBlocked) {
          styles[i][j]['border-left'] = '3px solid #3b3a30';
        } else {
          styles[i][j]['border-left'] = '3px solid transparent';
        }
        if (regions[i][j].rightBlocked) {
          styles[i][j]['border-right'] = '3px solid #3b3a30';
        } else {
          styles[i][j]['border-right'] = '3px solid transparent';
        }
      }
    }

    let rows = new Array(height)
    for (let i = 0; i < height; i++) {
      let row = new Array(width)
      for (let j = 0;j < width; j++) {
        let region = regions[i][j]
        row[j] = <div key={i*width + j} className="custom-item" style={styles[i][j]}></div>
      } 
      rows[i] = <div key={"row"+i.toString()} className="custom-container" >{ row }</div>
    }

    return rows
  }
  render() {
    return (
      <div className="App">
        <div className="container custom-sky" style={{ width: SKY_WIDTH, height: SKY_HEIGHT }}>
          { this.drawSky() }
        </div>
      </div>
    )
  }
  
}

export default App;
