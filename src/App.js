
import React, { useState } from "react";
import './App.css';
import axios from "axios";
import data from './data/data.json';

var fs = require('browserify-fs');

const App = () => {

  const [pokemonData, setPokemonData] = useState([]);

  const [pokemonImg, setPokemonImg] = useState("");
  const [pokemonID, setPokemonID] = useState(0);
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonType, setPokemonType] = useState([]);
  const [pokemonLocation, setPokemonLocation] = useState([]);
  const [pokemonStats, setPokemonStats] = useState([]);

  const handleChange = (e) => {
    setPokemonName(e.target.value.toLowerCase());
  };
  const handleSubmit = (e) => {
    e.preventDefault(); // so page doesn't get refreshed
    getPokemon();
  };

  const getPokemon = async () => {
    const pokemonDataToArray = [];
    const pokemonTypes = [];
    const pokemonLocationToArray = [];
    const pokemonLocations = [];

    const data_array = data;
    let contains = false;
    let pokemonIndex = null;

    for (let i = 0; i < data_array.length; i++) {
      if (data_array[i].name === pokemonName){
        contains = true;
        pokemonIndex = i;
      }
      
    }

    if (contains === true){
      setPokemonStats(data_array[pokemonIndex].stats); 
      setPokemonID(data_array[pokemonIndex].id);
      setPokemonType(data_array[pokemonIndex].type);
      setPokemonLocation(data_array[pokemonIndex].location);
      setPokemonImg(data_array[pokemonIndex].img_url);
    }else{

      let pokemonItem = {};

      try {
        const pokemonDataURL = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
        const pokemonDataRes = await axios.get(pokemonDataURL);
        
        pokemonDataToArray.push(pokemonDataRes.data);
  
        const tempPokemontypes = pokemonDataRes.data.types;
        tempPokemontypes.forEach((tempPokemontype) => {
          pokemonTypes.push(tempPokemontype.type.name)
        })
        
        setPokemonStats(pokemonDataRes.data.stats); 
        setPokemonImg(pokemonDataRes.data.sprites["front_default"]);
        setPokemonData(pokemonDataToArray);
        setPokemonID(pokemonDataRes.data.id);
        setPokemonType(pokemonTypes);
        
      
        try{
          const pokemonLocationURL = pokemonDataRes.data.location_area_encounters;
          const pokemonLocationsRes = await axios.get(pokemonLocationURL);
          pokemonLocationToArray.push(pokemonLocationsRes.data)
          pokemonLocationToArray[0].forEach((pokemonLocation) => {
            let locationName = pokemonLocation.location_area.name;
            if (locationName.includes('kanto')){
              pokemonLocations.push(locationName)
            }
          })
          if (pokemonLocations.length === 0){
            setPokemonLocation(['-']);
            pokemonItem['location'] = ['-'];
          }else{
            setPokemonLocation(pokemonLocations);
            pokemonItem['location'] = pokemonLocations
          }
          
          
        }catch (e){
          alert("Invalid location URL.");
          console.log(e)
        }
        pokemonItem['id'] = pokemonDataRes.data.id;
        pokemonItem['name'] = pokemonName;
        pokemonItem['type'] = pokemonTypes;
        pokemonItem['stats'] = pokemonDataRes.data.stats;
        pokemonItem['img_url'] = pokemonDataRes.data.sprites["front_default"];
        data_array.push(pokemonItem);

        let json_data = JSON.stringify(data_array);
        
        // fs.writeFile('data.json', json_data, function() {
        //     fs.readFile('data.json', 'utf-8', function(err, data) {
        //       console.log(data);
        //     });
        // });


      } catch (e) {
        alert("Resource not found.");
        console.log(e);
      }
      
      

    }
  };

  

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            onChange={handleChange}
            placeholder="Enter pokemon name"
          />
        </label>
      </form>
      
      {pokemonData.map((data) => {
        return (
          <div className="container">
            <img src={pokemonImg} />
            <div className="divTable">
              <div className="divTableBody">
              <div className="divTableRow">
                  <div className="divTableCell">Pokemon ID</div>
                  <div className="divTableCell">{pokemonID}</div>
                </div>
              <div className="divTableRow">
                  <div className="divTableCell">Pokemon Name</div>
                  <div className="divTableCell">{pokemonName}</div>
                </div>
                <div className="divTableRow">
                  <div className="divTableCell">Pokemon Type</div>
                  <div className="divTableCell">{pokemonType.toString()}</div>
                </div>
                <div className="divTableRow">
                  <div className="divTableCell">Pokemon Encounter Location(s)</div>
                  <div className="divTableCell">{pokemonLocation.toString()}</div>
                </div>
                <div className="divTableRow">
                  <div className="divTableCell">Pokemon HP</div>
                  <div className="divTableCell">{pokemonStats[0].base_stat}</div>
                </div>
                <div className="divTableRow">
                  <div className="divTableCell">Pokemon Attack</div>
                  <div className="divTableCell">{pokemonStats[1].base_stat}</div>
                </div>
                <div className="divTableRow">
                  <div className="divTableCell">Pokemon Defense</div>
                  <div className="divTableCell">{pokemonStats[2].base_stat}</div>
                </div>
                <div className="divTableRow">
                  <div className="divTableCell">Pokemon Special Attack</div>
                  <div className="divTableCell">{pokemonStats[3].base_stat}</div>
                </div>
                <div className="divTableRow">
                  <div className="divTableCell">Pokemon Special Defense</div>
                  <div className="divTableCell">{pokemonStats[4].base_stat}</div>
                </div>
                <div className="divTableRow">
                  <div className="divTableCell">Pokemon Speed</div>
                  <div className="divTableCell">{pokemonStats[5].base_stat}</div>
                </div>
               
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default App;
