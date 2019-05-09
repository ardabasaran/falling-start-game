class Region {
    constructor(row, col) {
        this._row = row
        this._col = col
        this._upBlocked = false
        this._downBlocked = false
        this._leftBlocked = false
        this._rightBlocked = false
        this._cluster = null
        this._star = null
        this._oldStarColor = []
        this._isMiddle = false
        this._isDouble = false
    }

    resetOldStarColor() {
        this._oldStarColor = []
    }

    get isDouble() {
        return this._isDouble
    }

    set isDouble(double) {
        return this._isDouble = double
    }

    get isMiddle() {
        return this._isMiddle
    }

    set isMiddle(middle) {
        return this._isMiddle = middle
    }

    get star() {
        return this._star
    }

    set star(star) {
        this._star = star
    }

    get cluster() {
        return this._cluster
    }

    set cluster(cluster) {
        this._cluster = cluster
    }

    get oldStarColor() {
        if (this._oldStarColor.length === 0) {
            return null
        }
        return this._oldStarColor[this._oldStarColor.length-1]
    }

    set oldStarColor(color) {
        if (color == null) {
            this._oldStarColor.pop()
        } else {
            this._oldStarColor.push(color)
        }
    }

    set upBlocked(block) {
        this._upBlocked = block
    }

    get upBlocked() {
        return this._upBlocked
    }

    set downBlocked(block) {
        this._downBlocked = block
    }

    get downBlocked() {
        return this._downBlocked
    }

    set leftBlocked(block) {
        this._leftBlocked = block
    }

    get leftBlocked() {
        return this._leftBlocked
    }

    set rightBlocked(block) {
        this._rightBlocked = block
    }

    get rightBlocked() {
        return this._rightBlocked
    }
}

export default Region;