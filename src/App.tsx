import { useEffect, useState, type Dispatch, type JSX, type SetStateAction } from 'react'
import { Button, Center, Collection, CollectionRow, Filter, Flex, Pagination, Search } from '@vtex/shoreline'
import { PokemonFetch, PokemonFull, PokemonLight } from './PokemonController';
import { PokeCard } from './PokemonComponents';


function FilterSearch({label} : {label : string}) : JSX.Element{

  return <Filter label={label}></Filter>
}


function Pokedex() : JSX.Element{
  return(
    <Collection>
      <CollectionRow>
        <Search></Search>
        <Pagination page={1} total={10}></Pagination>
      </CollectionRow>

      <CollectionRow>
        <FilterSearch label="type"></FilterSearch>
      </CollectionRow>
    
    </Collection>
  );
}

function App() {
  var pf = new PokemonFetch();

  var [pokesLight, setPokesLight] = useState([] as PokemonLight[]);
  var [pokesFull, setPokesFull] = useState([] as PokemonFull[]);
  var [id, setId] : any = useState(1)

  var [ready, setReady] = useState(false);


  useEffect(()=>{
    setReady(false)

    pf.fetchAll().then((pokemonList)=>{
      setPokesLight(pokemonList)
    });
    
  }, [id]);


  useEffect(()=>{
    if(pokesLight.length == 0) return;

    const promises = pokesLight.slice((id-1)*20,(id)*20).map((pokeLight, idx)=>{
      return pokeLight.fetchPokemonFull().then((pokeFull)=>{
        return pokeFull;
      });
    });

    Promise.all(promises).then((newPokesFull)=>setPokesFull(newPokesFull));
    
    //setPokesFull(newPokesFull);

    setReady(true);
    
  }, [pokesLight]);
  

  return (<>
    <input type='number' onChange={e => setId(e.target.value)} value={id} ></input>
    {ready ? <Flex>{pokesFull.map((poke)=><PokeCard key={poke.name} pokemon={poke}></PokeCard>)}</Flex> : null} 
    

  </>)
}

export default App
