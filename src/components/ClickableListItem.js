import { useState, useEffect } from "react";

export default function ClickableListItem({ bgColor, info, idx, onClick, prevColor, selectedIdx, selectedName }) {
   const [backGroundColor, setBackgroundColor] = useState("");
    const colorList = ["gray", "blue", "#40E0D0", "#2E8B57"];
    useEffect(() => {
        if (idx === selectedIdx) {
            setBackgroundColor(prevColor);
        } else {
            setBackgroundColor(bgColor);
        }
    }, [selectedName, prevColor]);

    const handleClick = () => {
        let random = Math.floor(Math.random() * colorList.length);
        while (colorList[random] === prevColor) {
            random = Math.floor(Math.random() * colorList.length);
        }
        setBackgroundColor(colorList[random]);
        onClick(colorList[random], idx, info.name);
    }
    

    return (
        <>
             <li style={{ cursor: 'pointer', backgroundColor: backGroundColor}} onClick={handleClick}>
                <b>Name: {info.name}</b> / <b>Capital: {info.capital}</b> / <b>Currency: {info.currency}</b> / <b>Flag</b>: {info.emoji}
             </li> <hr/>
        </>
    );
}
