import { useEffect, useState, type JSX } from 'react'
import { Collection, CollectionRow, CollectionView, Filter, Flex, Pagination, Search, Stack } from '@vtex/shoreline'
import { PokemonFetch, PokemonFull, PokemonLight } from './PokemonController';
import { PokeCard } from './PokemonComponents';

const POKES_PER_PAGE = 20;

function Pokedex() : JSX.Element{
  var pf = new PokemonFetch();

  var [pokesLight, setPokesLight] = useState([] as PokemonLight[]);
  var [pokesFull, setPokesFull] = useState([] as PokemonFull[]);
  
  var [page, setPage] = useState(1);
  var [search, setSearch] = useState('');

  useEffect(()=>{

    pf.fetchAll().then((pokemonList)=>{
      if(search.trim() == '') setPokesLight(pokemonList);

      else{
        const filteredList = pokemonList.filter((pokemon) => pokemon.name.includes(search));
        setPokesLight(filteredList);
      }
    });
    
  }, [search]);


  useEffect(()=>{
    if(pokesLight.length == 0) return;

    const promises = pokesLight.slice((page-1)*POKES_PER_PAGE,page*POKES_PER_PAGE).map((pokeLight)=>{
      return pokeLight.fetchPokemonFull().then((pokeFull)=>{
        return pokeFull;
      });
    });

    Promise.all(promises).then((newPokesFull)=>setPokesFull(newPokesFull));
    
  }, [page,pokesLight]);
  

  const handlePageChange = (newPage : number) => setPage(newPage);
  const handleSearchChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return(
    <Collection>

      <CollectionRow>
        <Stack horizontal>
          <Search value={search} onChange={handleSearchChange}/>
          <Filter label="type" />
        </Stack>
        <Pagination onPageChange={handlePageChange} page={page} total={pokesLight.length} size={POKES_PER_PAGE}/>

      </CollectionRow>

      <CollectionView status="ready">
        <Flex>{pokesFull.map((poke)=><PokeCard key={poke.name} pokemon={poke}></PokeCard>)}</Flex>
      </CollectionView>
    
    </Collection>
  );

}

export default Pokedex
