import { useState, type JSX, type SetStateAction } from 'react'
import { Button, Center, Collection, CollectionRow, Filter, Pagination, Search } from '@vtex/shoreline'
import PokemonFetch from './PokemonFetch';

function PokeCard() : JSX.Element{
  return <></>; 
}

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

  var [value, setValue] = useState({results:[]});
  var [error, setError] : any = useState(null);

  function update(){
    pf.fetchAll().then(  (res)=>res.json().then((value)=>setValue(value), (error)=>setError(error)), (error)=>setError(error));
  }

  return (<>
    <Button onClick={update}>oiiiii</Button>
    
    {value.results.map((poke : any) => (
      <Center key={poke.name}>{poke.name} <br></br></Center>
    ))}

  </>)
}

export default App
