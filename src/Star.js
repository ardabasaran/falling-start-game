class Star {
    constructor(row, column, color) {
        this._row = row
        this._column = column
        this._color = color
        this._oldRow = row
        this._oldColumn = column
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

    set oldRow(row) {
        this._oldRow = row
    }

    get oldRow() {
        return this._oldRow
    }

    set oldColumn(column) { 
        this._oldColumn = column
    }

    get oldColumn() {
        return this._oldColumn
    }
}

export default Star;