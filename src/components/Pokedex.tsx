import { useEffect, useState, type JSX } from 'react'
import { Collection, CollectionRow, CollectionView, Filter, FilterItem, Grid, Pagination, Search, Skeleton, Stack } from '@vtex/shoreline'
import { PokemonFetch, PokemonFull, PokemonLight, TypeFull } from '../PokemonController';
import { PokeCard } from './PokemonComponents';
import './pokedex.css';


const POKES_PER_PAGE = 20;
const TYPE_FILTER_NAME = "Types";
const GRID_ROWS = 4;
const GRID_COLUMNS = 5;

function getIntersectionPokeLight(arr1 : PokemonLight[], arr2 : PokemonLight[]) : PokemonLight[] {
  return [arr1, arr2]?.reduce((acc, currentValue) => {
    return acc?.filter(res =>
      currentValue?.find(value => value.name === res.name)
    )
  })
}


function Pokedex() : JSX.Element{
  var pf = new PokemonFetch();

  var [pokesLight, setPokesLight] = useState([] as PokemonLight[]);
  var [pokesFull, setPokesFull] = useState([] as PokemonFull[]);
  
  var [page, setPage] = useState(1);
  var [search, setSearch] = useState('');

  var [typesFiltered, setTypesFiltered] = useState([] as string[]);

  var [searchType, setSearchType] = useState('');
  var [typesFull, setTypesFull] = useState([] as TypeFull[]);
  
  var [loading, setLoading] = useState(false);

  function filterPokesLight(rawPokesLight : PokemonLight[]) : void {
    if(search.trim() != '') {
        rawPokesLight = rawPokesLight.filter((pokemon) => pokemon.name.toLowerCase().includes(search.trim().toLowerCase()));
    }
    setPokesLight(rawPokesLight);
    setPage(1);
  }


  useEffect(()=>{
    
    if(typesFiltered.length != 0){

      pf.fetchAllType().then((typesLight)=>{
        typesLight = typesLight.filter((typeLight)=> typesFiltered.includes(typeLight.name));
        const promises = typesLight.map((typeLight)=>{
          return typeLight.fetchTypeFull();
        });

        Promise.all(promises).then((typesFull)=>{
          var pokesLightTypeFiltered = typesFull[0].pokemons;
          for(var i=1;i<typesFull.length;i++){
            pokesLightTypeFiltered = getIntersectionPokeLight(pokesLightTypeFiltered,typesFull[i].pokemons);
          }
          filterPokesLight(pokesLightTypeFiltered);

        });

      });

    }
    else{
      pf.fetchAllPokemon().then((pokemonList)=>filterPokesLight(pokemonList));
    }

  }, [search, typesFiltered]);


  useEffect(()=>{
    
    setLoading(true);

    const promises = pokesLight.slice((page-1)*POKES_PER_PAGE,page*POKES_PER_PAGE).map((pokeLight)=>{
      return pokeLight.fetchPokemonFull().then((pokeFull)=>{
        return pokeFull.fetchFullTypes().then((pokeFullTyped)=>{return pokeFullTyped;});
      });
    });
    
    Promise.all(promises).then((newPokesFull)=>{
      setPokesFull(newPokesFull)
      setLoading(false);
    });
    
  }, [page,pokesLight]);
  

  useEffect(()=>{

    pf.fetchAllType().then((typeList)=>{

      if(searchType.trim() != ''){
        typeList = typeList.filter((type) => type.name.includes(searchType.trim()));
      }

      const promises = typeList.map((typeLight)=>{
        return typeLight.fetchTypeFull().then((typeFull)=>{return typeFull;})
      });

      Promise.all(promises).then((newTypesFull)=>setTypesFull(newTypesFull));

    });

  }, [searchType])


  return(
    <Collection id='Pokedex'>

      <CollectionRow>
        <Stack horizontal>
          <Search value={search} onChange={(e)=>setSearch(e.target.value)}/>
          
          <Filter label={TYPE_FILTER_NAME} searchValue={searchType} setSearchValue={(newVal)=>setSearchType(newVal)} 
                  value={typesFiltered} setValue={setTypesFiltered}>
              {typesFull.map((type)=><FilterItem key={type.name} value={type.name}  ><img src={type.imgUrl}/></FilterItem>)}
          </Filter>

        </Stack>
        <Pagination onPageChange={(newPage)=>setPage(newPage)} page={page} total={pokesLight.length} size={POKES_PER_PAGE}/>

      </CollectionRow>

        <CollectionView status={pokesFull.length||loading ? "ready" : "not-found"}>

          <Grid id='PokedexGrid' columns={`repeat(${GRID_COLUMNS},1fr)`} rows={`repeat(${GRID_ROWS},1fr)`}>
            
            {loading ? 
              Array(20).fill(-1,0,POKES_PER_PAGE).map((_,i)=><Skeleton key={i} className='PokeCard'/>)
              :
              pokesFull.map((poke)=><PokeCard key={poke.name} pokemon={poke}/>)}
          </Grid>

        </CollectionView>
      

      <CollectionRow>
        <Pagination onPageChange={(newPage)=>setPage(newPage)} page={page} total={pokesLight.length} size={POKES_PER_PAGE}/>
      </CollectionRow>

    </Collection>
  );

}


export default Pokedex
