import type { JSX } from "react";
import type { PokemonFull } from "../PokemonController";
import { useLocation } from "react-router-dom";
import { Center, Flex, Grid, Heading, Text } from "@vtex/shoreline";

function PokePage() : JSX.Element{
    const location = useLocation();
    const {pokemon} : {pokemon: PokemonFull} = location.state;


    return(
        <Flex direction="column" align="center" justify="space-around">
            <Heading>
                <Text variant="display1">{pokemon.name} </Text>
                <Text variant="emphasis">#{(pokemon.id+"").padStart(4,'0')}</Text>
            </Heading>
            
            <Grid columns={"1fr 1fr"}>

                <div>
                    <img src={pokemon.imgUrl} />

                    <Flex direction="column" gap="var(--sl-space-2)">
                        {pokemon.types.map((type)=><img src={type.imgUrl} key={type.name} />)}
                    </Flex>
                </div>

                <Center>
                    <Flex direction="column" >
                        {pokemon.stats.map((stat)=>{
                            return <div>
                                <Text variant="action">{stat.name}: </Text>
                                <Text variant="caption1">{stat.value}</Text>
                            </div>
                        })}
                    </Flex>

                    <Flex direction="column">
                        <div>
                            <Text variant="action">Weight: </Text>
                            <Text variant="caption1">{pokemon.weight/10} kg</Text>
                        </div>

                        <div>
                            <Text variant="action">Height: </Text>
                            <Text variant="caption1">{pokemon.height/10} m</Text>
                        </div>

                    </Flex>
                </Center>

            </Grid>

            
            
            

        </Flex>
    );
}

export default PokePage