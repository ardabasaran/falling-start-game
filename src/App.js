import React, { Component } from 'react';
import Sky from './Sky';
import './App.css'
import $ from 'jquery';
import Timer from './Timer'
import Solver from './Solver'
import ShowNext from './ShowNext'


class App extends Component {
  constructor(props) {
    super(props);
    let sky = new Sky(false)
    this.state = {
      sky: sky,
      nextCluster: null,
      nextClusterCounter: 0,
      solution: null,
      original: sky
    }
    this.solverRef = React.createRef()
  }

  drawSky = () => {
    let width = this.state.sky.width
    let height = this.state.sky.height
    let regions = this.state.sky.regions
  
    let styles = new Array(height)
    let values = new Array(height)
    for (let i = 0; i < height; i++) {
      styles[i] = new Array(width)
      values[i] = new Array(width)
      for (let j = 0; j < width; j++) {
        styles[i][j] = {}
        values[i][j] = null
        styles[i][j]['backgroundColor'] = '#eaece5'
        if (regions[i][j].upBlocked) {
          styles[i][j]['borderTop'] = '3px solid #3b3a30';
        } else {
          styles[i][j]['borderTop'] = '3px solid transparent';
        }
        if (regions[i][j].downBlocked) {
          styles[i][j]['borderBottom'] = '3px solid #3b3a30';
        } else {
          styles[i][j]['borderBottom'] = '3px solid transparent';
        }
        if (regions[i][j].leftBlocked) {
          styles[i][j]['borderLeft'] = '3px solid #3b3a30';
        } else {
          styles[i][j]['borderLeft'] = '3px solid transparent';
        }
        if (regions[i][j].rightBlocked) {
          styles[i][j]['borderRight'] = '3px solid #3b3a30';
        } else {
          styles[i][j]['borderRight'] = '3px solid transparent';
        }
        if (regions[i][j].cluster != null) {
          let cluster = regions[i][j].cluster
          styles[i][j]['color'] = cluster.color
          styles[i][j]['backgroundColor'] = '#adafa8'
          values[i][j] = <i className="material-icons custom-icons">{cluster.type}</i>
        }
        if (regions[i][j].star != null) {
          let star = regions[i][j].star
          styles[i][j]['color'] = star.color
          values[i][j] = <i className="material-icons custom-icons">stars</i>
        }
        else if (regions[i][j].oldStarColor) {
          styles[i][j]['backgroundColor'] = regions[i][j].oldStarColor
        }
        
        if (regions[i][j].isMiddle) {
          styles[i][j]['backgroundColor'] = '#adafa8';
          styles[i][j]['borderBottom'] = '3px solid #adafa8';
          styles[i][j]['borderLeft'] = '3px solid #adafa8';
          styles[i][j]['borderRight'] = '3px solid #adafa8';
          styles[i][j]['borderTop'] = '3px solid #adafa8';
        } 
      }
    }

    let rows = new Array(height)
    for (let i = 0; i < height; i++) {
      let row = new Array(width)
      for (let j = 0;j < width; j++) {
        row[j] = <div key={i*width + j} className="custom-item valign-wrapper" style={styles[i][j]}>{values[i][j]}</div>
      } 
      rows[i] = <div key={"row"+i.toString()} className="custom-container" >{ row }</div>
    }

    return rows
  }

  getNextCluster() {
    let val = this.state.nextClusterCounter
    this.setState({
      nextClusterCounter: (val +1)%16
    })
    return this.state.sky.nextClusterList[val]
  }

  handleStart = () => {
    let sky = this.state.sky
    let cluster = this.state.nextCluster
    if (this.state.nextCluster == null) {
      cluster = this.getNextCluster()
    }
    let solution = this.solverRef.current.getSolution(sky, cluster)
    this.setState({
      sky: sky,
      original: sky,
      nextCluster: cluster,
      solution: solution.solutionSky
    })
  }

  handleReset = () => {
    let sky = this.state.sky
    let cluster = null
    sky.resetNextCluster()
    this.setState({
      nextCluster: cluster,
      nextClusterCounter: 0 
    })
  }

  handleNext = () => {
    this.solverRef.current.hide()
    if (this.state.nextCluster == null) {
      return false
    }
    let solution = this.state.solution
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 16; j++) {
        solution.regions[i][j].resetOldStarColor()
      }
    }
    let cluster = this.getNextCluster()
    let new_solution = this.solverRef.current.getSolution(solution, cluster)
    this.setState({
      sky: solution,
      original: solution,
      nextCluster: cluster,
      solution: new_solution.solutionSky
    })
    return true
  }

  handleShow = (val) => {
    if (val) {
      this.setState({
        sky: this.state.solution
      })
    } else {
      this.setState({
        sky: this.state.original
      })
    }
  }

  render() {
    return (
      <div className="App container">
        <div className="row">
          <div className="custom-sky col s8">
            { this.drawSky() }
          </div>
          {this.state.nextCluster==null &&  <ShowNext hasNext={false} type='null' color='null'/>}
          {this.state.nextCluster!=null &&  <ShowNext hasNext={true} type={this.state.nextCluster.type} color={this.state.nextCluster.color}/>}
          <Timer handleStart={this.handleStart} handleReset={this.handleReset} handleNext={this.handleNext} />
          <Solver ref={this.solverRef} sky={this.state.sky} nextCluster={this.state.nextCluster} handleShow={this.handleShow}/>
        </div>
      </div>
    )
  }

  componentWillMount() {
    $(document).ready(function() {
      $(window).on('resize', function() {
        $('.custom-container').each(function() {
          $(this).height(7 + $('.custom-item').width());
          });
        $('.custom-icons').each(function() {
          $(this).css({
            fontSize: ($('.custom-item').width()-3)
          });
        });
      }).trigger('resize');      
    });
  }
}

export default App;
