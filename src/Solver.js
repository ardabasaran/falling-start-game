import React, { Component } from 'react'
import Sky from './Sky'
import Solution from './Solution'

class Solver extends Component {
    state = {
        showSolution: false,
        original: this.props.sky,
        foundFor: null
    }

    handleShow = () => {
        if (this.props.nextCluster === null) {
            return
        }
        let solution = this.state.solution
        if (this.props.nextCluster !== this.state.foundFor) {
            solution = this.solve(this.state.original, this.props.nextCluster)
            this.setState({
                solution: solution,
                foundFor: this.props.nextCluster
            })
        }

        if (this.state.showSolution) {
            this.setState({
                showSolution: false
            })
            this.props.handleShow(this.state.original)
        } else {
            this.setState({
                showSolution: true
            })
            this.props.handleShow(solution.solutionSky) 
        }
    }

    render() {
        return (
            <div className="custom-solver col s4">
                <h5>Solver</h5>
                <button onClick={this.handleShow} className="waves-effect waves-light btn-large">
                    {this.props.nextCluster === this.state.foundFor ? (this.state.showSolution ? "Hide" : "Show") : "Solve" }
                </button>
            </div>
        )
    }

    solve(sky, nextCluster) {
        this.fallingStarIndex = this.findFallingStarIndex(sky, nextCluster)
        this.nextCluster = nextCluster
        
        let solutionSky = new Sky(false, sky)
        let numMoves = 0;
        while (numMoves <= 30) {
            this.hashmap = {}
            console.log("Checking for solutions in ", numMoves, " moves")
            let solution = this.recursiveSolve(solutionSky, 0, numMoves)
            if (solution != null) {
                console.log("Found solution in ", numMoves, " moves")
                return solution
            }
            numMoves += 1
        }
        console.log("Not found solution in 30 moves")
        return new Solution(0, solutionSky)
    }

    findFallingStarIndex(sky, nextCluster) {
        let stars = sky.stars
        for (let i = 0; i < stars.length; i++) {
            if (stars[i].color === nextCluster.color) {
                return i
            }
        }
        return -1;
    }

    isSolved(solutionSky) {
        let fallingStar = solutionSky.stars[this.fallingStarIndex]
        if (this.nextCluster.row === fallingStar.row && this.nextCluster.column === fallingStar.column) {
            return true
        } else {
            return false
        }
    }

    hashPosition(sky) {
        let positions = []
        let stars = sky.stars
        for (let i = 0; i < 4; i++) {
            if (i === this.fallingStarIndex) {
                continue;
            }
            positions.push(stars[i].row * 16 + stars[i].column)
        }
        positions.sort()
        let hash = 0
        for (let i = 0; i < positions.length; i++) {
            hash += positions[i]
            hash = hash << 8
        }
        hash += stars[this.fallingStarIndex].row * 16 + stars[this.fallingStarIndex].column

        return hash
    }

    getNextSkies(sky) {
        let nextSkies = []
        
        for (let i = 0; i < 4; i++) {
            let nextUp = new Sky(false, sky)
            let stars = nextUp.stars
            let star = stars[i]
            let countMoves = 0
            while (star.row-1 >= 0 && 
                nextUp.regions[star.row-1][star.column].star === null && 
                !nextUp.regions[star.row][star.column].upBlocked) {
                nextUp.regions[star.row][star.column].oldStar = true
                nextUp.regions[star.row][star.column].oldStarColor = star.color
                nextUp.regions[star.row][star.column].star = null
                nextUp.regions[star.row-1][star.column].star = star
                star.row -= 1
                countMoves += 1
            }
            if (countMoves > 0) {
                nextSkies.push(nextUp)
            }

            let nextDown = new Sky(false, sky)
            stars = nextDown.stars
            star = stars[i]
            countMoves = 0
            while (star.row+1 <= 15 && 
                nextDown.regions[star.row+1][star.column].star === null && 
                !nextDown.regions[star.row][star.column].downBlocked) {
                nextDown.regions[star.row][star.column].oldStar = true
                nextDown.regions[star.row][star.column].oldStarColor = star.color
                nextDown.regions[star.row][star.column].star = null
                nextDown.regions[star.row+1][star.column].star = star
                star.row += 1
                countMoves += 1
            }
            if (countMoves > 0) {
                nextSkies.push(nextDown)
            }

            let nextLeft = new Sky(false, sky)
            stars = nextLeft.stars
            star = stars[i]
            countMoves = 0
            while (star.column - 1 >= 0 &&
                nextLeft.regions[star.row][star.column-1].star === null && 
                !nextLeft.regions[star.row][star.column].leftBlocked) {
                nextLeft.regions[star.row][star.column].oldStar = true
                nextLeft.regions[star.row][star.column].oldStarColor = star.color
                nextLeft.regions[star.row][star.column].star = null
                nextLeft.regions[star.row][star.column-1].star = star
                star.column -= 1
                countMoves += 1
            }
            if (countMoves > 0) {
                nextSkies.push(nextLeft)
            }

            let nextRight = new Sky(false, sky)
            stars = nextRight.stars
            star = stars[i]
            countMoves = 0
            while (star.column + 1 <= 15 &&
                nextRight.regions[star.row][star.column+1].star === null &&
                !nextRight.regions[star.row][star.column].rightBlocked) {
                nextRight.regions[star.row][star.column].oldStar = true
                nextRight.regions[star.row][star.column].oldStarColor = star.color
                nextRight.regions[star.row][star.column].star = null
                nextRight.regions[star.row][star.column+1].star = star
                star.column += 1
                countMoves += 1
            }
            if (countMoves > 0) {
                nextSkies.push(nextRight)
            }
        }
        return nextSkies
    }

    recursiveSolve(solutionSky, numMoves, maxDepth) {
        if (this.isSolved(solutionSky)) {
            return new Solution(numMoves, solutionSky)
        }

        let hashValue = this.hashPosition(solutionSky)
        if (this.hashmap[hashValue] != null && this.hashmap[hashValue] <= numMoves) {
            return null
        }

        if (numMoves < maxDepth) {
            let nextSkies = this.getNextSkies(solutionSky)
            for (let i = 0; i < nextSkies.length; i++) {
                let solution = this.recursiveSolve(nextSkies[i], numMoves + 1, maxDepth)
                if (solution != null) {
                    return solution
                }
                this.hashmap[hashValue] = numMoves
            }
        } else {
            return null;
        }
    }
}

export default Solver