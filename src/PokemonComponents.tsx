import type { JSX } from "react";
import type { PokemonFull } from "./PokemonController";



export function PokeCard({pokemon} : {pokemon : PokemonFull}) : JSX.Element{
  return (
  <div>
    <img src={pokemon.imgUrl} />
    <div>{pokemon.name} #{pokemon.id}</div>
    <div>{pokemon.types.map((type)=><img src={type.imgUrl} />)}</div>
  </div>
  ); 
}