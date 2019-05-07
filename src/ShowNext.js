import React from 'react'

function ShowNext ({hasNext, color, type}) {
    if (hasNext) {
        return (
            <div className="custom-cluster col s4">
            Next: <i className="material-icons custom-cluster-icons" style={{color: color}}>{type} </i>
            </div>
        )
   } else {
    return (
        <div className="custom-cluster col s4">
            Falling Stars
        </div>
    )
   }
}

export default ShowNext