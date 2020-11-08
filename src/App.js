import React, { useEffect, useState } from "react";
import "./App.css";
import { FormControl, Select, MenuItem, Card, CardContent } from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyprintstat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setcountries] = useState([]);
  const [country, setcountry] = useState("worldwide");
  const [countryInfo, setcountryInfo] = useState({});
  const [tableData, settableData] = useState([]);
  const [mapcenter, setmapcenter] = useState({ lat:34.80746, lng:-40.4796 });
  const [mapzoom, setmapzoom] = useState(3);
  const [mapcountries, setmapcountries] = useState([]);
  const [casestype, setcasestype] = useState("cases");

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setcountryInfo(data);
    })
  },[])

  useEffect(() => {
    const getcountriesdata = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          settableData(sortedData);
          setmapcountries(data);
          setcountries(countries);
        });
    };
    getcountriesdata();
  }, []);

  const onchangecountry = async (event) => {
    const countrycode = event.target.value;
    // console.log("yoooo >>>>>>", countrycode);

    const url = countrycode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countrycode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setcountry(countrycode);
      setcountryInfo(data);

      setmapcenter([data.countryInfo.lat, data.countryInfo.long]);
      setmapzoom(4);
    });
  };

  console.log('Country info >>>',countryInfo)

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>SUJAY's COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onchangecountry}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {/* Loop through all the countries and show a dropdown list of the countries */}

              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}

              {/* <MenuItem value="Worldwide">Worldwide</MenuItem>
            <MenuItem value="Worldwide">Option 1</MenuItem>
            <MenuItem value="Worldwide">Option 2</MenuItem>
            <MenuItem value="Worldwide">Option 3</MenuItem> */}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox isRed active={casestype === "cases"} onClick={(e) => setcasestype('cases')} title="Coronavirus Cases" cases={prettyprintstat(countryInfo.todayCases)} total={prettyprintstat(countryInfo.cases)} />

          <InfoBox active={casestype === "recovered"} onClick={(e) => setcasestype('recovered')} title="Recovered" cases={prettyprintstat(countryInfo.todayRecovered)} total={prettyprintstat(countryInfo.recovered)} />

          <InfoBox isRed active={casestype === "deaths"} onClick={(e) => setcasestype('deaths')} title="Deaths" cases={prettyprintstat(countryInfo.todayDeaths)} total={prettyprintstat(countryInfo.deaths)} />
        </div>

        <Map casestype={casestype} countries={mapcountries} center={mapcenter} zoom={mapzoom} />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
        <Table countries={tableData}/>
          <h3 className="app__graphtitle">Worldwide new {casestype}</h3>
        
        <LineGraph className="app__graph" casestype={casestype} />
        </CardContent>
      </Card>
      

    </div>
  );
}

export default App;
