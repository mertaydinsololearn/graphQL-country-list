import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useState, useEffect} from "react";
import 'semantic-ui-css/semantic.min.css'
import Spinner from './components/Spinner';
import { Input, Icon} from 'semantic-ui-react';
import DismissableMessage from './components/DismissableMessage';
import CountryList from './components/CountryList';

const COUNTRIES_QUERY = gql`
{
  countries {
    code
    name
    native
    capital
    emoji
    currency
    languages {
      code
      name
    }
  }
}

`;

export default function App() {
  const { data, loading, error } = useQuery(COUNTRIES_QUERY);
  const [text, setText] = useState(""); 
  const [click, setClick] = useState(false);

  if (loading) return <Spinner />


  return (
    <div>
      <h1 className="ui header"  style={{marginLeft:"10px", paddingTop:"10px"}}>Country List</h1>
      {
        error &&    
          <DismissableMessage negative   header="Veritabanında bir hata oluştu!">
             Lütfen kısa bir süre sonra tekrar deneyin
         </DismissableMessage>
      }
      <DismissableMessage header="Note">You can input search:countryName to filter countries with their names and group them by 
         using group:currency  || group:language <br />Example: name:qatar group:currency || group:language</DismissableMessage>
      <label style={{marginRight: "10px", marginLeft:"10px"}}>Filter:</label>
        <Input 
       icon={<Icon name='search' inverted circular link />}
         value={text} onInput={(e) => {setText(e.target.value); setClick(false)}}
          placeholder="search:france"/>
      {
        data && !error && 
          <CountryList  text={text} setClick={setClick} data={data} click={click} />
      }
     
    </div>
  );
}

