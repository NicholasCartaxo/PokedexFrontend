import type { JSX } from "react";
import type { PokemonFull } from "../PokemonController";
import { Flex, Text } from "@vtex/shoreline";
import { useNavigate } from "react-router-dom";


export function PokeCard({pokemon} : {pokemon : PokemonFull}) : JSX.Element{
  
  const navigate = useNavigate();

  return (
    <Flex className="PokeCard clickable" align="center" direction="column" onClick={()=>(navigate('PokePage',{state:{pokemon:pokemon}}))}>
      <img className="PokemonImg" src={pokemon.imgUrl} />

      <Flex direction="column" align="center" gap="var(--sl-space-0)">
        <Text variant="display1">{pokemon.name}</Text>
        <Text variant="emphasis">#{(pokemon.id+"").padStart(4,'0')}</Text>
      </Flex>

      <Flex className="Types" direction="column" justify="center" gap="var(--sl-space-2)">
        {pokemon.types.map((type)=><img src={type.imgUrl} key={type.name} />)}
      </Flex>
      
      
    </Flex>
  ); 
}