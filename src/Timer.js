import React, { Component } from 'react'

class Timer extends Component {
    state = {
        seconds: 0,
        minutes: 0,
        running: false,
    }

    incrementTime() {
        let seconds = this.state.seconds
        let minutes = this.state.minutes
        seconds += 1
        minutes += Math.floor(seconds / 60)
        seconds = seconds % 60
        this.setState({
            seconds: seconds,
            minutes: minutes
        })
    }

    handleStart = () => {
        this.setState({
            running: true
        })
        this.timerID = setInterval(() => {
            this.incrementTime()
        }, 1000);
        this.props.handleStart()
    }

    handleStop = () => {
        this.setState({
            running: false
        })
        clearInterval(this.timerID)
    }

    handleReset = () => {
        this.setState({
            running: false,
            seconds: 0,
            minutes: 0
        })
        clearInterval(this.timerID)
        this.props.handleReset()
    }

    handleNext = () => {
        this.setState({
            running: true,
            seconds: 0,
            minutes: 0
        })
        clearInterval(this.timerID)
        this.timerID = setInterval(() => {
            this.incrementTime()
        }, 1000);
        this.props.handleNext()
    }

    render() {
        return (
            <div className="custom-timer col s4">
                <h3>{this.state.minutes > 9 ? this.state.minutes.toString() : '0' + this.state.minutes.toString()}:{this.state.seconds > 9 ? this.state.seconds.toString() : '0' + this.state.seconds.toString()}</h3>
                {this.state.running ? <button onClick={this.handleStop} className="waves-effect waves-light btn-large">Stop</button> : <button onClick={this.handleStart} className="waves-effect waves-light btn-large">Start</button>}
                <button onClick={this.handleNext} className="waves-effect waves-light btn-large">Next</button>
                <button onClick={this.handleReset} className="waves-effect waves-light btn-large">Reset</button>
            </div>
        )
    }
}

export default Timer