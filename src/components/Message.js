import { useState } from "react";

export default function Message( {header, children})  {
    const [visible, setVisible] = useState(true);

    const handleDismiss = () => {
        setVisible(false);
    }

    return (
        visible ?  <div className="ui message" style={{marginLeft:"10px"}}> 
          <i className="close icon" onClick={handleDismiss}></i>
          <div className="header">{header}</div>
          <p>{children}</p>
     </div> : null
    );

}