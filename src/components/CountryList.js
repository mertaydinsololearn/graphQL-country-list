import { useState, useEffect } from 'react';
import  ClickableListItem from './ClickableListItem';
import { List } from 'semantic-ui-react';

export default function CountryList({ text, setClick, data, click  }) {
    const [selectedIdx, setSelectedIdx] = useState(null);
    const [selectedName, setSelectedName] = useState(null);
    const [previousColor, setPreviousColor] = useState("orange");
   
    let counter = [1];
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
  if (group && (group === "currency" || group === "language")) {
    groupedCountries = {};
    if (group === "currency") {
      filteredCountries.forEach(country => {
        const currency = country.currency;
        if (!groupedCountries[currency]) {
          groupedCountries[currency] = [];
        }
        groupedCountries[currency].push(country);
      });
    } else  {
      filteredCountries.forEach(country => {
        const language = country.languages[0]  ? country.languages[0].name : 'none';
        if (!groupedCountries[language]) {
          groupedCountries[language] = [];
        }
        groupedCountries[language].push(country);
      });
    }
  }

  useEffect(() => {
    if (filteredCountries && filteredCountries.length && !click) {
      const length = filteredCountries.length > 10 ? 10: filteredCountries.length;

      if (selectedName === filteredCountries[length - 1].name && selectedIdx === length) return;
      const colorList = ["gray", "#8FBC8F", "#40E0D0", "#2E8B57"];
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

    return (
        <List divided verticalAlign='middle'>
        {groupedCountries ? 
          Object.entries(groupedCountries).map(([currency, countries], idx)=>
            countries.map((info) => {
              const bgColor = "#FFFAFA";
              const listIdx = counter[0];
              counter[0] += 1;
              return (
                <List.Item>
                <List.Content>
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
                 </List.Content>
                </List.Item>
              );
            })
          )
          :
          filteredCountries.map((info, idx) => {
            const bgColor = "#FFFAFA";
            return (
              <List.Item>
                <List.Content>
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
                </List.Content>
              </List.Item>
            );
          })
        }
        </List>
    )
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