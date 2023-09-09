import { useState, useEffect } from "react";
import 'semantic-ui-css/semantic.min.css'


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
          <div  onClick={handleClick} className="item" style={{ cursor: 'pointer', backgroundColor: backGroundColor, paddingLeft: "10px"}} >
                <i>{info.flag}</i>
                <div className="content">
                  <a className="header">{info.emoji}</a>
                   <div className="description">Name: {info.name} / Capital: {info.capital} / 
                        Currency: {info.currency} / Language: {info.languages[0] && info.languages[0].name} </div>
                     </div>
            </div>
    );
}
