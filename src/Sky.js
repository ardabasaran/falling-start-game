import _ from 'lodash'
import Star from './Star'
import Region from './Region'
import Cluster from './Cluster'

const Colors = ["DarkRed", "Gold", "Purple", "DarkGreen", "DarkBlue", "Indigo", "SkyBlue", "Olive", "Coral", "DimGray"]
const Types = ["spa", "extension", "whatshot", "terrain"]
class Sky {
    constructor(width, height, numStars) {
        this._width = width
        this._height = height
        this._numStars = numStars
        
        this._initializeRegionsAndClusters()
        this._initializeStars()
        this._nextClusterList = [...this._clusters]
        this._nextClusterList = _.shuffle(this._nextClusterList)
        this._nextClusterCount = 0
    }

    resetNextCluster() {
        this._nextClusterList = _.shuffle(this._nextClusterList)
        this._nextClusterCount = 0
    }

    getNextCluster() {
        let val = this._nextClusterList[this._nextClusterCount]
        this._nextClusterCount += 1
        if (this._nextClusterCount === this._nextClusterList.length) {
            this._nextClusterList = _.shuffle(this._nextClusterList)
            this._nextClusterCount = 0
        }
        return val
    }

    get height() {
        return this._height
    }

    get width() {
        return this._width
    }

    get regions() {
        return this._regions
    }

    get stars() {
        return this._stars
    }

    get clusters() {
        return this._clusters
    }

    _initializeStars() { 
        let height = this._height
        let width = this._width
        this._stars = new Array(this._numStars)
        for (let i = 0; i < this._numStars; i++) {
            let row = Math.floor(Math.random()*height)
            let column = Math.floor(Math.random()*width)
            while (this._regions[row][column].star != null || 
                this._regions[row][column].cluster != null || 
                this._regions[row][column].isMiddle === true ) {
                row = Math.floor(Math.random()*height)
                column = Math.floor(Math.random()*width)
            }
            this._stars[i] = new Star(row, column, Colors[i])
            this._regions[row][column].star = this._stars[i]
        }
    }

    _initializeRegionsAndClusters() {
        let height = this._height
        let width = this._width
        this._regions = new Array(height)
        for (let i = 0; i < height; i++) {
            this._regions[i] = new Array(width)
            for (let j = 0; j < width; j++) {
                this._regions[i][j] = new Region(i, j)
            }
        }
        // block border regions
        for (let i = 0; i < height; i++) {
            this._regions[i][0].leftBlocked = true
            this._regions[i][width-1].rightBlocked = true
        }
        for (let i = 0; i < width; i++) {
            this._regions[0][i].upBlocked = true
            this._regions[height-1][i].downBlocked = true
        }

        // middle block regions
        this._middleBlocks()

        // random pick single blocks on border
        this._singleBlocks()

        
        // random pick double blocks inside regions and place clusters
        this._clusters = new Array(4*this._numStars)
        let typePerQuadrant = new Array(this._numStars)
        for (let i = 0; i < this._numStars; i++) {
            typePerQuadrant[i] = [...Types]
            typePerQuadrant[i] = _.shuffle(typePerQuadrant[i])
        }
        // Q2
        let spots = this._pickNSpots(width, height, this._numStars)
        this._placeClustersAndBlock(1, spots, 0, 0, typePerQuadrant)
        // Q1
        spots = this._pickNSpots(width, height, this._numStars)
        this._placeClustersAndBlock(0, spots, 0, width/2, typePerQuadrant)
        // Q3
        spots = this._pickNSpots(width, height, this._numStars)
        this._placeClustersAndBlock(2, spots, height/2, 0, typePerQuadrant)
        // Q4
        spots = this._pickNSpots(width, height, this._numStars)
        this._placeClustersAndBlock(3, spots, height/2, width/2, typePerQuadrant)
    }

    _placeClustersAndBlock(quadrant, spots, heightOffset, widthOffset, typePerQuadrant) {
        let blocks = [0, 1, 2, 3]
        blocks = _.shuffle(blocks)
        for (let i = 0; i < this._numStars; i++) {
            let row = heightOffset + 1 + spots[i][0]
            let column = widthOffset + 1 + spots[i][1]
            this._clusters[i + (quadrant*this._numStars)] = new Cluster(row, column, Colors[i], typePerQuadrant[i][quadrant])
            this._regions[row][column].cluster = this._clusters[i + (quadrant*this._numStars)]
            if (blocks[i] === 0) {
                this._regions[row][column].leftBlocked = true
                this._regions[row][column-1].rightBlocked = true
                this._regions[row][column].upBlocked = true
                this._regions[row-1][column].downBlocked = true
            } else if (blocks[i] === 1) {
                this._regions[row][column].upBlocked = true
                this._regions[row-1][column].downBlocked = true
                this._regions[row][column].rightBlocked = true
                this._regions[row][column+1].leftBlocked = true
            } else if (blocks[i] === 2) {
                this._regions[row][column].rightBlocked = true
                this._regions[row][column+1].leftBlocked = true
                this._regions[row][column].downBlocked = true
                this._regions[row+1][column].upBlocked = true
            } else {
                this._regions[row][column].downBlocked = true
                this._regions[row+1][column].upBlocked = true
                this._regions[row][column].leftBlocked = true
                this._regions[row][column-1].rightBlocked = true
            }
        }
    }

    _pickNSpots(width, height, n) {
        let spots = _.range((width/2-2)*(height/2-2))
        spots = _.shuffle(spots)
        let p = new Array(n)
        for (let i = 0; i < n; i++) {
            p[i] = [Math.floor(spots[i]/(height/2-2)), Math.floor(spots[i]%(height/2-2))]
        }
        // pick 4 spots
        while(this._areNeighbors(p)) {
            spots = _.shuffle(spots)
            for (let i = 0; i < n; i++) {
                p[i] = [Math.floor(spots[i]/(height/2-2)), Math.floor(spots[i]%(height/2-2))]
            }
        }
        return p
    }

    _areNeighbors(p) {
        let sum = 0
        for (let i = 0; i < p.length; i++) {
            for (let j = i + 1; j < p.length; j++) {
                if (Math.abs(p[i][0]-p[j][0]) + Math.abs(p[i][1]-p[j][1]) < 4) {
                    sum += 1
                }
            }
        }
        if (sum > 1) {
            return true
        } else {
            return false
        }
    }

    _middleBlocks() {
        let height = this._height
        let width = this._width

        this._regions[height/2][width/2].isMiddle = true
        this._regions[height/2-1][width/2].isMiddle = true
        this._regions[height/2-1][width/2-1].isMiddle = true
        this._regions[height/2][width/2-1].isMiddle = true

        this._regions[height/2][width/2].rightBlocked = true
        this._regions[height/2][width/2+1].leftBlocked = true

        this._regions[height/2][width/2].downBlocked = true
        this._regions[height/2+1][width/2].upBlocked = true
        
        this._regions[height/2-1][width/2].rightBlocked = true
        this._regions[height/2-1][width/2+1].leftBlocked = true

        this._regions[height/2-1][width/2].upBlocked = true
        this._regions[height/2-2][width/2].downBlocked = true

        this._regions[height/2-1][width/2-1].leftBlocked = true
        this._regions[height/2-1][width/2-2].rightBlocked = true

        this._regions[height/2-1][width/2-1].upBlocked = true
        this._regions[height/2-2][width/2-1].downBlocked = true

        this._regions[height/2][width/2-1].leftBlocked = true
        this._regions[height/2][width/2-2].rightBlocked = true
        
        this._regions[height/2][width/2-1].downBlocked = true
        this._regions[height/2+1][width/2-1].upBlocked = true
    }

    _singleBlocks() {
        let height = this._height
        let width = this._width

        let randIndex = Math.floor(Math.random()*(height/2-2))
        this._regions[1 + randIndex][0].downBlocked = true
        this._regions[2 + randIndex][0].upBlocked = true

        randIndex = Math.floor(Math.random()*(height/2-2))
        this._regions[height/2 + randIndex][0].downBlocked = true
        this._regions[1 + height/2 + randIndex][0].upBlocked = true

        randIndex = Math.floor(Math.random()*(height/2-2))
        this._regions[1 + randIndex][width-1].downBlocked = true
        this._regions[2 + randIndex][width-1].upBlocked = true

        randIndex = Math.floor(Math.random()*(height/2-2))
        this._regions[height/2 + randIndex][width-1].downBlocked = true
        this._regions[1 + height/2 + randIndex][width-1].upBlocked = true

        randIndex = Math.floor(Math.random()*(width/2-2))
        this._regions[0][1 + randIndex].rightBlocked = true
        this._regions[0][2 + randIndex].leftBlocked = true

        randIndex = Math.floor(Math.random()*(width/2-2))
        this._regions[0][width/2 + randIndex].rightBlocked = true
        this._regions[0][1 + width/2 + randIndex].leftBlocked = true

        randIndex = Math.floor(Math.random()*(width/2-2))
        this._regions[height-1][1 + randIndex].rightBlocked = true
        this._regions[height-1][2 + randIndex].leftBlocked = true

        randIndex = Math.floor(Math.random()*(width/2-2))
        this._regions[height-1][width/2 + randIndex].rightBlocked = true
        this._regions[height-1][1 + width/2 + randIndex].leftBlocked = true
    }
}

export default Sky;