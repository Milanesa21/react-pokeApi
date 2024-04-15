import React, { useEffect, useState } from "react";

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [lastFetchedIndex, setLastFetchedIndex] = useState(0);

  const fetchPokemon = async () => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${lastFetchedIndex + 1}`);
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await response.json();
      setPokemonList((prevPokemonList) => [...prevPokemonList, { name: data.name, isHidden: false, details: null }]);
      setLastFetchedIndex((prevIndex) => prevIndex + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage(
        "An error occurred while fetching data. Please try again later."
      );
    }
  };

  const fetchPokemonDetails = async (index) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${index + 1}`);
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await response.json();
      const updatedPokemonList = [...pokemonList];
      updatedPokemonList[index].details = {
        id: data.id,
        types: data.types,
        sprite: data.sprites.front_default
      };
      setPokemonList(updatedPokemonList);
    } catch (error) {
      console.error("Error fetching details:", error);
      setErrorMessage(
        "An error occurred while fetching details. Please try again later."
      );
    }
  };

  const handleRemoveOrHide = (index) => {
    setPokemonList((prevPokemonList) => {
      const updatedPokemonList = [...prevPokemonList];
      updatedPokemonList[index].isHidden = true;
      return updatedPokemonList;
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pokémon List</h1>
        <button onClick={fetchPokemon}>Fetch Pokémon</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <ul>
          {pokemonList.map((pokemon, index) => (
            <div key={index}>
              {!pokemon.isHidden && (
                <li>
                  {pokemon.name}{" "}
                  <button onClick={() => handleRemoveOrHide(index)}>
                    Hide
                  </button>{" "}
                  <button onClick={() => fetchPokemonDetails(index)}>
                    More Details
                  </button>
                  {pokemon.details && (
                    <div>
                      <p>ID: {pokemon.details.id}</p>
                      <p>Types: {pokemon.details.types.map(type => type.type.name).join(", ")}</p>
                      <img src={pokemon.details.sprite} alt={pokemon.name} />
                    </div>
                  )}
                </li>
              )}
            </div>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
