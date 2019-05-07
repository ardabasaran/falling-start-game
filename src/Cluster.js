class Cluster {
    constructor(row, column, color, type) {
        this._row = row
        this._column = column
        this._color = color
        this._type = type
    }

    get type() {
        return this._type
    }

    get color() {
        return this._color
    }

    set row(row) {
        this._row = row
    }

    get row() {
        return this._row
    }

    set column(column) { 
        this._column = column
    }

    get column() {
        return this._column
    }
}

export default Cluster;