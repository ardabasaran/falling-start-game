import _ from 'lodash'
import Star from './Star'
import Region from './Region'
import Cluster from './Cluster'
import QuadrantSky from './QuadrantSky'

// (downSingle, sideSingle, firstDouble, secondDouble, thirdDouble, fourthDouble)
const quadrant_skies = [
    new QuadrantSky(4, 0, [2,6], [5,2], [0,3], [5,1]),
    new QuadrantSky(2, 0, [4,4], [0,2], [4,5], [5,1]),
    new QuadrantSky(5, 0, [3,6], [4,1], [1,3], [6,4]),
    new QuadrantSky(3, 2, [2,0], [5,2], [3,5], [1,6]),
    new QuadrantSky(2, 2, [4,1], [1,6], [2,3], [6,5]),
    new QuadrantSky(1, 5, [1,4], [4,1], [5,6], [6,3]),
    new QuadrantSky(2, 4, [3,4], [5,1], [5,6], [3,5]),
    new QuadrantSky(3, 0, [6,1], [2,5], [4,6], [3,2]),
    new QuadrantSky(2, 2, [4,6], [6,5], [1,2], [3,1]),
    new QuadrantSky(5, 1, [4,6], [1,4], [6,3], [2,2]),
    new QuadrantSky(2, 1, [1,4], [6,1], [2,1], [5,6]),
    new QuadrantSky(3, 3, [5,6], [6,2], [1,5], [3,1]),
    new QuadrantSky(3, 1, [6,6], [3,5], [5,1], [2,0]),
    new QuadrantSky(1, 1, [1,4], [3,1], [1,5], [4,6]),
    new QuadrantSky(4, 3, [6,2], [5,0], [1,6], [2,1]),
    new QuadrantSky(1, 3, [4,2], [2,3], [3,5], [5,4]),
]
const Colors = ["DarkRed", "Gold", "Purple", "DarkGreen", "DarkBlue", "Indigo", "SkyBlue", "Olive", "Coral", "DimGray"]
const Types = ["spa", "extension", "whatshot", "terrain"]

class Sky {
    constructor(randomSky, sky) {
        if (sky != null) {
            this._width = sky._width
            this._height = sky._height
            this._numStars = sky._numStars
            this._nextClusterList = [...sky._nextClusterList]
            
            this._regions = new Array(sky._regions.length)
            for (let i = 0; i < sky._regions.length; i++) {
                this._regions[i] = new Array(sky._regions[0].length)
                for (let j = 0; j < sky._regions[0].length; j++) {
                    this._regions[i][j] = new Region(sky._regions[i][j].row, sky._regions[i][j].column)
                    this._regions[i][j]._upBlocked = sky._regions[i][j]._upBlocked
                    this._regions[i][j]._downBlocked = sky._regions[i][j]._downBlocked
                    this._regions[i][j]._rightBlocked = sky._regions[i][j]._rightBlocked
                    this._regions[i][j]._leftBlocked = sky._regions[i][j]._leftBlocked
                    this._regions[i][j]._oldStarColor = [...sky._regions[i][j]._oldStarColor]
                    this._regions[i][j]._isMiddle = sky._regions[i][j]._isMiddle
                    this._regions[i][j]._isDouble = sky._regions[i][j]._isDouble
                }
            }
            this._stars = new Array(sky._stars.length)
            for (let i = 0; i < sky._stars.length; i++) {
                this._stars[i] = new Star(sky._stars[i].row, sky._stars[i].column, sky._stars[i].color)
                this._stars[i].oldRow = sky._stars[i].oldRow
                this._stars[i]._oldColumn = sky._stars[i].oldColumn
                this._regions[this._stars[i].row][this._stars[i].column].star = this._stars[i]
            }
            this._clusters = new Array(sky._clusters.length)
            for (let i = 0; i < sky._clusters.length; i++) {
                this._clusters[i] = new Cluster(sky._clusters[i].row, sky._clusters[i].column, sky._clusters[i].color, sky._clusters[i].type)
                this._regions[this._clusters[i].row][this._clusters[i].column].cluster = this._clusters[i]
            }
        } else {
            this._width = 16
            this._height = 16
            this._numStars = 4
            
            if (randomSky) {
                this._initializeRegionsAndClustersRandom()
            } else {
                this._initializeRegionsAndClusters()
            }
            this._initializeStars()
            this._nextClusterList = [...this._clusters]
            this._nextClusterList = _.shuffle(this._nextClusterList)
        }
    }

    resetNextCluster() {
        this._nextClusterList = _.shuffle(this._nextClusterList)
    }

    get nextClusterList() {
        return this._nextClusterList
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
        let shuffled = _.shuffle(quadrant_skies)
        let quadrants = new Array(4)
        quadrants[0] = shuffled[0].getQuadrant(0)
        quadrants[1] = shuffled[1].getQuadrant(1)
        quadrants[2] = shuffled[2].getQuadrant(2)
        quadrants[3] = shuffled[3].getQuadrant(3)
        this._mergeQuadrants(quadrants)
    }

    _mergeQuadrants(quadrants) {
        this._regions = new Array(16)
        for (let i = 0; i < 16; i++) {
            this._regions[i] = new Array(16)
            for (let j = 0; j < 16; j++) {
                this._regions[i][j] = new Region(i, j)
            }
        }
        let heightOffset = 0
        let widthOffset = 0
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this._regions[i + heightOffset][j + widthOffset].upBlocked = quadrants[2][i][j].upBlocked
                this._regions[i + heightOffset][j + widthOffset].downBlocked = quadrants[2][i][j].downBlocked
                this._regions[i + heightOffset][j + widthOffset].leftBlocked = quadrants[2][i][j].leftBlocked
                this._regions[i + heightOffset][j + widthOffset].rightBlocked = quadrants[2][i][j].rightBlocked
                this._regions[i + heightOffset][j + widthOffset].isMiddle =  quadrants[2][i][j].isMiddle
                this._regions[i + heightOffset][j + widthOffset].isDouble =  quadrants[2][i][j].isDouble
            }
        } 
        heightOffset = 0
        widthOffset = 8
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this._regions[i + heightOffset][j + widthOffset].upBlocked = quadrants[3][i][j].upBlocked
                this._regions[i + heightOffset][j + widthOffset].downBlocked = quadrants[3][i][j].downBlocked
                this._regions[i + heightOffset][j + widthOffset].leftBlocked = quadrants[3][i][j].leftBlocked
                this._regions[i + heightOffset][j + widthOffset].rightBlocked = quadrants[3][i][j].rightBlocked
                this._regions[i + heightOffset][j + widthOffset].isMiddle =  quadrants[3][i][j].isMiddle
                this._regions[i + heightOffset][j + widthOffset].isDouble =  quadrants[3][i][j].isDouble
            }
        } 
        heightOffset = 8
        widthOffset = 0
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this._regions[i + heightOffset][j + widthOffset].upBlocked = quadrants[1][i][j].upBlocked
                this._regions[i + heightOffset][j + widthOffset].downBlocked = quadrants[1][i][j].downBlocked
                this._regions[i + heightOffset][j + widthOffset].leftBlocked = quadrants[1][i][j].leftBlocked
                this._regions[i + heightOffset][j + widthOffset].rightBlocked = quadrants[1][i][j].rightBlocked
                this._regions[i + heightOffset][j + widthOffset].isMiddle =  quadrants[1][i][j].isMiddle
                this._regions[i + heightOffset][j + widthOffset].isDouble =  quadrants[1][i][j].isDouble
            }
        } 
        heightOffset = 8
        widthOffset = 8
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this._regions[i + heightOffset][j + widthOffset].upBlocked = quadrants[0][i][j].upBlocked
                this._regions[i + heightOffset][j + widthOffset].downBlocked = quadrants[0][i][j].downBlocked
                this._regions[i + heightOffset][j + widthOffset].leftBlocked = quadrants[0][i][j].leftBlocked
                this._regions[i + heightOffset][j + widthOffset].rightBlocked = quadrants[0][i][j].rightBlocked
                this._regions[i + heightOffset][j + widthOffset].isMiddle =  quadrants[0][i][j].isMiddle
                this._regions[i + heightOffset][j + widthOffset].isDouble =  quadrants[0][i][j].isDouble
            }
        } 

        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                if (i > 0 && this._regions[i][j].upBlocked) {
                    this._regions[i-1][j].downBlocked = true
                }
                if (i < 15 && this._regions[i][j].downBlocked) {
                    this._regions[i+1][j].upBlocked = true
                }
                if (j > 0 && this._regions[i][j].leftBlocked) {
                    this._regions[i][j-1].rightBlocked = true
                }
                if (j < 15 && this._regions[i][j].rightBlocked) {
                    this._regions[i][j+1].leftBlocked = true
                }
            }
        }

        // block border regions
        for (let i = 0; i < 16; i++) {
            this._regions[i][0].leftBlocked = true
            this._regions[i][16-1].rightBlocked = true
        }
        for (let i = 0; i < 16; i++) {
            this._regions[0][i].upBlocked = true
            this._regions[16-1][i].downBlocked = true
        }

        // place clusters
        this._clusters = new Array(16)
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                this._clusters[4*i + j] = new Cluster(0, 0, Colors[i], Types[j])
            }
        }
        this._clusters = _.shuffle(this._clusters)

        let counter = 0
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                if (this._regions[i][j].isMiddle) {}
                if (this._regions[i][j].isDouble) {
                    this._regions[i][j].cluster = this._clusters[counter]
                    this._clusters[counter].row = i 
                    this._clusters[counter].column = j
                    counter += 1 
                }
            }
        }
    }

    _initializeRegionsAndClustersRandom() {
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