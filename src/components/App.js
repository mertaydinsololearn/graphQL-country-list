import { useState } from "react";

export default function ClickableListItem( {bgColor, info , onClick}) {
    const [selected]
    return (
        <>
             <li    style={{ cursor: 'pointer', bgColor: bgColor}} 
                   onClick={(e) => handleClick(e)}>
                    Name:{info.name} / Capital: {info.capital} / Currency: {currency} / Emoji: {info.emoji}
                 </li> <hr/>
        </>
    );
}