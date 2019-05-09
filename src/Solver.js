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
        if (this.props.nextCluster == null) {
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
            this.props.handleShow(false)
        } else {
            this.setState({
                showSolution: true
            })
            this.props.handleShow(true) 
        }
    }

    hide() {
        this.setState({
            showSolution: false
        })
    }

    getSolution(sky, nextCluster) {
        if (nextCluster == null) {
            return
        }
        let solution = this.state.solution
        if (nextCluster !== this.state.foundFor) {
            solution = this.solve(sky, nextCluster)
            this.setState({
                solution: solution,
                foundFor: nextCluster,
            })
        }
        return solution
    }

    render() {
        return (
            <div className="custom-solver col s4">
                <h5>Solver</h5>
                <button onClick={this.handleShow} className="waves-effect waves-light btn-large">
                    {(this.props.nextCluster != null && this.props.nextCluster  === this.state.foundFor) ? (this.state.showSolution ? "Hide" : "Show") : "Solve" }
                </button>
            </div>
        )
    }

    getDistanceMap(sky, nextCluster) {
        let distanceMap = new Array(16)
        for (let i = 0; i < 16; i++) {
            distanceMap[i] = new Array(16)
            for (let j = 0; j < 16; j++) {
                distanceMap[i][j] = 987654321 
            }
        }
        let regions = sky.regions
        let queue = []
        distanceMap[nextCluster.row][nextCluster.column] = 0
        queue.push([nextCluster.row, nextCluster.column])
        while (queue.length > 0) {
            let position = queue.pop()
            let next_distance = distanceMap[position[0]][position[1]] + 1
            let moves = [[-1,0], [1,0], [0,-1], [0,1]]
            for (let i = 0; i < 4; i++) {
                let move = moves[i]
                let temp = [...position]
                while (temp[0] + move[0] >= 0 &&
                    temp[0] + move[0] <= 15 && 
                    temp[1] + move[1] >= 0 &&
                    temp[1] + move[1] <= 15) {  
                    if (move[0] === -1 && regions[temp[0]][temp[1]].upBlocked ) {
                        break
                    }
                    if (move[0] === 1 && regions[temp[0]][temp[1]].downBlocked ) {
                        break
                    }
                    if (move[1] === -1 && regions[temp[0]][temp[1]].leftBlocked ) {
                        break
                    }
                    if (move[1] === 1 && regions[temp[0]][temp[1]].rightBlocked ) {
                        break
                    }
                    temp[0] += move[0]
                    temp[1] += move[1]
                    if (distanceMap[temp[0]][temp[1]] > next_distance) {
                        distanceMap[temp[0]][temp[1]] = next_distance
                        queue.push([...temp])
                    }
                }
            }
            
        }

        return distanceMap
    }

    solve(sky, nextCluster) {
        this.fallingStarIndex = this.findFallingStarIndex(sky, nextCluster)
        this.nextCluster = nextCluster
        
        let solutionSky = new Sky(false, sky)
        let numMoves = 0;
        this.distanceMap = this.getDistanceMap(sky, nextCluster)
        while (numMoves <= 30) {
            this.hashmap = {}
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

    makeMove(solutionSky, star, move, numMoves, maxDepth) {
        let countMoves = 0
        let oldRow = star.row
        let oldColumn = star.column
        while ( star.row + move[0] >= 0 &&
                star.row + move[0] <= 15 && 
                star.column + move[1] >= 0 &&
                star.column + move[1] <= 15 && 
                solutionSky.regions[star.row + move[0]][star.column + move[1]].star == null 
                ) {
            if (move[0] === -1 && solutionSky.regions[star.row][star.column].upBlocked ) {
                break
            }
            if (move[0] === 1 && solutionSky.regions[star.row][star.column].downBlocked ) {
                break
            }
            if (move[1] === -1 && solutionSky.regions[star.row][star.column].leftBlocked ) {
                break
            }
            if (move[1] === 1 && solutionSky.regions[star.row][star.column].rightBlocked ) {
                break
            }
            solutionSky.regions[star.row][star.column].oldStarColor = star.color
            solutionSky.regions[star.row][star.column].star = null
            solutionSky.regions[star.row + move[0]][star.column + move[1]].star = star
            star.row += move[0]
            star.column += move[1]
            countMoves += 1
        }
        if (countMoves > 0) {
            solutionSky.regions[star.row][star.column].oldStarColor = star.color
            let solution = this.recursiveSolve(solutionSky, numMoves + 1, maxDepth)
            if (solution != null) {
                return solution
            }
            solutionSky.regions[star.row][star.column].oldStarColor = null
        }
        while (star.row !== oldRow || star.column !== oldColumn) {
            solutionSky.regions[star.row][star.column].star = null
            solutionSky.regions[star.row - move[0]][star.column - move[1]].star = star
            star.row -= move[0]
            star.column -= move[1]
            solutionSky.regions[star.row][star.column].oldStarColor = null
        }
        if (countMoves > 0) {
            //solutionSky.regions[star.row][star.column].oldStarColor = null
        }
        solutionSky.regions[star.row][star.column].star = star
        return null
    }

    recursiveSolve(solutionSky, numMoves, maxDepth) {
        if (this.isSolved(solutionSky)) {
            return new Solution(numMoves, solutionSky)
        }

        let fallingStar = solutionSky.stars[this.fallingStarIndex]
        if (this.distanceMap[fallingStar.row][fallingStar.column] > maxDepth - numMoves) {
            return null
        }

        let hashValue = this.hashPosition(solutionSky)
        if (this.hashmap[hashValue] != null && this.hashmap[hashValue] <= numMoves) {
            return null
        }

        if (numMoves < maxDepth) {
            let stars = solutionSky.stars
            for (let i = 0; i < 4; i++) {
                let star = stars[i]
                let moves = [[-1,0], [1,0], [0,-1], [0,1]]

                let solution = this.makeMove(solutionSky, star, moves[0], numMoves, maxDepth) 
                if (solution != null) {
                    return solution
                }
                solution = this.makeMove(solutionSky, star, moves[1], numMoves, maxDepth) 
                if (solution != null) {
                    return solution
                }
                solution = this.makeMove(solutionSky, star, moves[2], numMoves, maxDepth) 
                if (solution != null) {
                    return solution
                }
                solution = this.makeMove(solutionSky, star, moves[3], numMoves, maxDepth) 
                if (solution != null) {
                    return solution
                }
            }
            this.hashmap[hashValue] = numMoves
        } else {
            return null;
        }
    }
}

export default Solver