import React from 'react';

export const Button = (props) => {
    const {onClick, title, startWatch, id} = props
    return(
        <button id={id} onClick={()=>onClick(startWatch)}>{title}</button>
    )
}