import { useEffect, useState, type JSX } from "react";
import type { PokemonFull, Stat } from "../PokemonController";
import { useLocation } from "react-router-dom";
import { Center, Checkbox, Flex, Grid, Heading, Text, Tooltip } from "@vtex/shoreline";
import './pokepage.css';

const MAX_STAT = 255;

function StatBar({stat} : {stat:Stat}) : JSX.Element{

    return <Tooltip label={stat.name+": "+stat.value}>
                <Flex className="StatBar" justify="space-between">
                    <Text variant="display3">{stat.name}: </Text>
                    <div className="FullBar">
                        <div className="Bar" style={{width:stat.value*100/MAX_STAT+"%"}}></div>
                    </div>
                </Flex>
            </Tooltip>

}


function PokePage() : JSX.Element{
    const location = useLocation();
    const {pokemon} : {pokemon: PokemonFull} = location.state;

    const [animated, setAnimated] = useState(false);

    return(
        <Flex direction="column" align="center" justify="space-around">
            <Heading>
                <Text variant="display1" >{pokemon.name} </Text>
                <Text variant="emphasis">#{(pokemon.id+"").padStart(4,'0')}</Text>
            </Heading>

            <Grid columns={"1fr 1fr"}>

                <Flex className="content-card image-card" direction="column" align="center">

                    <Checkbox onChange={()=>setAnimated(!animated)} disabled={pokemon.imgUrlGif === null}>Animated</Checkbox>

                    <Center className="pokemon-img"><img src={animated? pokemon.imgUrlGif : pokemon.imgUrl} /></Center>

                    <Flex className="Types" direction="column" justify="center" align="center">
                        {pokemon.types.map((type)=><img src={type.imgUrl} key={type.name} />)}
                    </Flex>
                </Flex>

                <Flex className="Info" direction="column" align="center" justify="center">
                    <Flex direction="column" className="content-card" >
                        {pokemon.stats.map((stat)=>{
                            return <StatBar key={stat.name} stat={stat}></StatBar>
                        })}
                    </Flex>

                    <Flex direction="column" className="content-card">
                        <div>
                            <Text variant="display3">Weight: </Text>
                            <Text variant="emphasis">{pokemon.weight/10} kg</Text>
                        </div>

                        <div>
                            <Text variant="display3">Height: </Text>
                            <Text variant="emphasis">{pokemon.height/10} m</Text>
                        </div>

                    </Flex>
                </Flex>

            </Grid>

            
            
            

        </Flex>
    );
}

export default PokePage