import { startTransition, useEffect, useState, type JSX, type SetStateAction } from 'react'
import './App.css'
import { Center, Collection, CollectionRow, Filter, FilterListSkeleton, Pagination, Search } from '@vtex/shoreline'


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
  return (
    <Center>
      <Pokedex />
    </Center>
  )
}

export default App
