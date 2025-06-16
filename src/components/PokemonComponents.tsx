import type { JSX } from "react";
import type { PokemonFull } from "../PokemonController";
import { Flex, Text } from "@vtex/shoreline";
import { useNavigate, useNavigation, type Navigation } from "react-router-dom";


export function PokeCard({pokemon} : {pokemon : PokemonFull}) : JSX.Element{
  
  const navigate = useNavigate();

  return (
    <Flex className="PokeCard" align="center" justify="space-around" direction="column" onClick={()=>(navigate('PokePage',{state:{pokemon:pokemon}}))}>
      <img className="PokemonImg" src={pokemon.imgUrl} />
      <Text variant="display1">{pokemon.name} #{pokemon.id}</Text>
      <Flex className="Types" direction="column" gap="var(--sl-space-2)">
        {pokemon.types.map((type)=><img src={type.imgUrl} key={type.name} />)}
      </Flex>
    </Flex>
  ); 
}