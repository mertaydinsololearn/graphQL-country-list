import { useState, useEffect } from 'react';
import  ClickableListItem from './ClickableListItem';
import { List } from 'semantic-ui-react';
import "./css/CountryList.css"

export default function CountryList({ text, setClick, data, click  }) {
    const [selectedName, setSelectedName] = useState(null);
    const [previousColor, setPreviousColor] = useState("orange");
       const {search , group} = extractText(text);

    const handleClick = (color, name) => {
        if (name !== selectedName) {
          setPreviousColor(color);
          setSelectedName(name);
          setClick(true);
        }
        else {
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
      if (group && (group.toLowerCase()  === "currency" || group.toLowerCase() === "language")) {
        let currentName;
        let counter = 0;
        let found = false;
          Object.values(groupedCountries).map((countryList) => {
            if (!found && counter + countryList.length <= 10) {
              counter += countryList.length;
              currentName = countryList[countryList.length - 1].name;
              if (counter === 10) found = true;
            }
            else if (!found) {
              currentName = countryList[(10 - counter - 1)].name;
              found = true;
            }
          });
          if (selectedName === currentName) return;
          const colorList = ["gray", "#8FBC8F", "#40E0D0", "#2E8B57"];
          let random = Math.floor(Math.random() * colorList.length);
          while (colorList[random] === previousColor) {
              random = Math.floor(Math.random() * colorList.length);
          }
          setPreviousColor(colorList[random]);
          setSelectedName(currentName);
          setClick(false);

      } else {
        const length = filteredCountries.length > 10 ? 10: filteredCountries.length;

        if (selectedName === filteredCountries[length - 1].name) return;
        const colorList = ["gray", "#8FBC8F", "#40E0D0", "#2E8B57"];
        let random = Math.floor(Math.random() * colorList.length);
        while (colorList[random] === previousColor) {
            random = Math.floor(Math.random() * colorList.length);
        }
        setPreviousColor(colorList[random]);
        setSelectedName(filteredCountries[length - 1].name);
        setClick(false);
      }
      
    }
  }, [search, group]);

    return (
        <List divided verticalAlign='middle'>
        {groupedCountries ? 
          Object.entries(groupedCountries).map(([currency, countries], idx)=>
            countries.map((info) => {
              const bgColor = "#FFFAFA";
              return (
                <List.Item>
                <List.Content>
                  <ClickableListItem
                    key={info.name}
                    info={info}
                    onClick={handleClick}
                    bgColor={bgColor}
                    prevColor={previousColor}
                    selectedName={selectedName} 
                    group={(group.toLowerCase()  === "currency" || group.toLowerCase() === "language")}
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
                    onClick={handleClick}
                    bgColor={bgColor}
                    prevColor={previousColor}
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