import type { JSX } from "react";
import type { PokemonFull } from "./PokemonController";
import { Flex, Text } from "@vtex/shoreline";


export function PokeCard({pokemon} : {pokemon : PokemonFull}) : JSX.Element{
  return (
    <Flex className="PokeCard" align="center" justify="space-around" direction="column">
      <img className="PokemonImg" src={pokemon.imgUrl} />
      <Text variant="display1">{pokemon.name} #{pokemon.id}</Text>
      <Flex className="Types" direction="column" gap="var(--sl-space-2)">
        {pokemon.types.map((type)=><img src={type.imgUrl} key={type.name} />)}
      </Flex>
    </Flex>
  ); 
}