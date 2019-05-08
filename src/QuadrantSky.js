import Region from './Region'

class QuadrantSky {
    constructor(downSingle, sideSingle, firstDouble, secondDouble, thirdDouble, fourthDouble) {
        this.downSingle = downSingle
        this.sideSingle = sideSingle
        this.firstDouble = firstDouble
        this.secondDouble = secondDouble
        this.thirdDouble = thirdDouble
        this.fourthDouble = fourthDouble
    }

    getQuadrant(rotate) {
        let quadrant = new Array(8)
        for (let i = 0; i < 8; i++) {
            quadrant[i] = new Array(8)
            for (let j = 0; j < 8; j++) {
                quadrant[i][j]= new Region(i, j)
            }
        }

        quadrant[0][0].isMiddle = true
        quadrant[this.firstDouble[0]][this.firstDouble[1]].isDouble = true
        quadrant[this.secondDouble[0]][this.secondDouble[1]].isDouble = true
        quadrant[this.thirdDouble[0]][this.thirdDouble[1]].isDouble = true
        quadrant[this.fourthDouble[0]][this.fourthDouble[1]].isDouble = true

        quadrant[0][0].rightBlocked = true
        quadrant[0][1].leftBlocked = true
        quadrant[0][0].downBlocked = true
        quadrant[0][0].downBlocked = true
        

        quadrant[7][this.downSingle].rightBlocked = true
        quadrant[7][this.downSingle+1].leftBlocked = true

        quadrant[this.sideSingle][7].downBlocked = true
        quadrant[this.sideSingle+1][7].upBlocked = true

        quadrant[this.firstDouble[0]][this.firstDouble[1]].upBlocked = true
        quadrant[this.firstDouble[0]][this.firstDouble[1]].rightBlocked = true

        quadrant[this.secondDouble[0]][this.secondDouble[1]].upBlocked = true
        quadrant[this.secondDouble[0]][this.secondDouble[1]].leftBlocked = true

        quadrant[this.thirdDouble[0]][this.thirdDouble[1]].downBlocked = true
        quadrant[this.thirdDouble[0]][this.thirdDouble[1]].leftBlocked = true

        quadrant[this.fourthDouble[0]][this.fourthDouble[1]].downBlocked = true
        quadrant[this.fourthDouble[0]][this.fourthDouble[1]].rightBlocked = true

        for (let i = 0; i < rotate; i++) {
            quadrant = this.rotateClockwise(quadrant)
        }
        return quadrant
    }

    rotateClockwise(quadrant) {
        let rotated = new Array(8)
        for (let i = 0; i < 8; i++) {
            rotated[i] = new Array(8)
            for (let j = 0; j < 8; j++) {
                rotated[i][j]= new Region(i, j)
            }
        }

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let up = quadrant[i][j].upBlocked
                let down = quadrant[i][j].downBlocked
                let left = quadrant[i][j].leftBlocked
                let right = quadrant[i][j].rightBlocked
                rotated[j][7-i].rightBlocked = up
                rotated[j][7-i].downBlocked = right
                rotated[j][7-i].leftBlocked = down
                rotated[j][7-i].upBlocked = left
                rotated[j][7-i].isMiddle = quadrant[i][j].isMiddle
                rotated[j][7-i].isDouble = quadrant[i][j].isDouble
            }
        }

        return rotated
    }
}

export default QuadrantSky