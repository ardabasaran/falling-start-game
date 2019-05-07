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
        this._oldStar = false
        this._isMiddle = false
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

    get oldStar() {
        return this._oldStar
    }

    set oldStar(star) {
        this._oldStar = star
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