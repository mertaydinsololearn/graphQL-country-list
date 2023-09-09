import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useState, useEffect} from "react";
import 'semantic-ui-css/semantic.min.css'
import Spinner from './components/Spinner';
import  ClickableListItem from './components/ClickableListItem';

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
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [previousColor, setPreviousColor] = useState("orange");
  const [click, setClick] = useState(false);
  
  const {search , group} = extractText(text);

  const handleClick = (color, idx, name) => {
    if (selectedIdx !== idx) {
      setSelectedIdx(idx);
      setPreviousColor(color);
      setSelectedName(name);
      setClick(true);
    }
    else {
      setSelectedIdx(null);
      setSelectedName(null);
      setClick(true);
    }
  }


  let filteredCountries = data ? data.countries : [];

  if (search) {
    filteredCountries = filteredCountries.filter(country =>
      country.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  let groupedCountries;
  if (group && group === "currency") {
    groupedCountries = {};
    filteredCountries.forEach(country => {
      const currency = country.currency;
      if (!groupedCountries[currency]) {
        groupedCountries[currency] = [];
      }
      groupedCountries[currency].push(country);
    });
  }

  useEffect(() => {
    if (filteredCountries && filteredCountries.length && !click) {
      const length = filteredCountries.length > 10 ? 10: filteredCountries.length;

      if (selectedName === filteredCountries[length - 1].name && selectedIdx === length) return;
      const colorList = ["gray", "blue", "#40E0D0", "#2E8B57"];
      let random = Math.floor(Math.random() * colorList.length);
      while (colorList[random] === previousColor) {
          random = Math.floor(Math.random() * colorList.length);
      }
      setPreviousColor(colorList[random]);
      setSelectedIdx(length);
      setSelectedName(filteredCountries[length - 1].name);
      setClick(false);
      
    }
  }, [filteredCountries, group]);

  if (loading) return <Spinner />
  if (error) return <pre>{error.message}</pre>

  let counter = [1];

  return (
    <div>
      <h1  style={{marginLeft:"10px"}}>GraphQL List</h1>
      <p style={{marginLeft:"10px"}}>You can input search:countryName to filter countries with their names and group them by 
        using group:currency / Example: name:qatar group:currency
      </p>
      <label style={{marginRight: "10px", marginLeft:"10px"}}>Filter:</label>
      <input type="text" value={text} onInput={(e) => {setText(e.target.value); setClick(false)}} />
      <ul>
        {groupedCountries ? 
          Object.entries(groupedCountries).map(([currency, countries], idx) =>
            countries.map((info, subIdx) => {
              const bgColor = "#FFFAFA";
              const listIdx = counter[0];
              counter[0] += 1;
              return (
                <ClickableListItem
                  key={info.name}
                  info={info}
                  idx={listIdx}
                  onClick={handleClick}
                  bgColor={bgColor}
                  prevColor={previousColor}
                  selectedIdx={selectedIdx}
                  selectedName={selectedName} 
                />
              );
            })
          )
          :
          filteredCountries.map((info, idx) => {
            const bgColor = "#FFFAFA";
            return (
              <ClickableListItem
                key={info.name}
                info={info}
                idx={idx + 1}
                onClick={handleClick}
                bgColor={bgColor}
                prevColor={previousColor}
                selectedIdx={selectedIdx} 
                selectedName={selectedName}
              />
            );
          })
        }
      </ul>
    </div>
  );
}

function extractText(inputString) {
  const searchRegex = /search:(\S+)/;
  const groupRegex = /group:(\S+)/;

  const searchMatch = inputString.match(searchRegex);
  const groupMatch = inputString.match(groupRegex);

  const searchResult = searchMatch ? searchMatch[1] : null;
  const groupResult = groupMatch ? groupMatch[1] : null;

  return { search: searchResult, group: groupResult };
}