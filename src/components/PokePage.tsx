import { useEffect, useState, type JSX } from "react";
import { PokemonFetch, PokemonFull, Stat } from "../PokemonController";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Center, Checkbox, Flex, Grid, Heading, IconArrowLeft, IconArrowRight, Label, Skeleton, Text, Tooltip } from "@vtex/shoreline";
import './pokepage.css';

const MAX_STAT = 255;

function formatId(id:number) : string{
    return (id+"").padStart(4,'0')
}

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

function PokemonSideButton({pokemon, left} : {pokemon:PokemonFull, left:boolean}) : JSX.Element{
    const navigate = useNavigate();
    return( 
        <Button asChild className={"SideButton "+(left?"left":"right")}  onClick={()=>navigate("../pokemon/"+pokemon?.id)}>
                <Label>
                {left ? 
                <IconArrowLeft style={{order:-1}}/>
                :
                <IconArrowRight style={{order:1}}/>}
                {pokemon.name}
                #{formatId(pokemon.id)}
            </Label>
        </Button>
    );
}

function PokePageSkeleton() : JSX.Element{
    return <Flex  style={{position:"sticky"}} direction="column" align="center" justify="space-around">
            <Heading>
            </Heading>

            <Grid columns={"1fr 1fr"}>

                <Skeleton className="content-card image-card" />

                <Flex direction="column" align="center" justify="center">
                    <Skeleton className="content-card" />

                    <Skeleton className="content-card"/>
                </Flex>

            </Grid>
                

        </Flex>
}

function PokePage() : JSX.Element{

    const pF = new PokemonFetch();

    const [animated, setAnimated] = useState(false);
    const [loading, setLoading] = useState(false);

    const [pokemon, setPokemon] = useState(null as null | PokemonFull);
    const [prev, setPrev] = useState(null as null | PokemonFull);
    const [next, setNext] = useState(null as null | PokemonFull);

    const id = useParams().pokeId;

    useEffect(()=>{
        setLoading(true);
        setAnimated(false);

        if(!isNaN(Number(id))){
            pF.fetchPokemon(Number(id)).then((pokemonNoType)=>{
                if(pokemonNoType !== null){
                    pokemonNoType.fetchFullTypes().then((pokemonFull)=>{
                        setPokemon(pokemonFull);
                        setLoading(false);
                    })
                }else setLoading(false);
            });

            pF.fetchPokemon(Number(id)-1).then((value)=>setPrev(value));
            pF.fetchPokemon(Number(id)+1).then((value)=>setNext(value));
        }else setLoading(false);

    },[id])

    if(loading) return <PokePageSkeleton/>;
    else if(pokemon === null) return <>ERRO TODO</>;
    else return (
        <Flex  style={{position:"sticky"}} direction="column" align="center" justify="space-around">
            <Heading>
                <Text variant="display1" >{pokemon.name} </Text>
                <Text variant="emphasis">#{formatId(pokemon.id)}</Text>
            </Heading>

            {prev?<PokemonSideButton pokemon={prev} left/>:<></>}
            {next?<PokemonSideButton pokemon={next} left={false}/>:<></>}

            <Grid columns={"1fr 1fr"}>

                <Flex className="content-card image-card" direction="column" align="center">

                    <Checkbox onChange={()=>setAnimated(!animated)} disabled={pokemon.imgUrlGif === null}>Animated</Checkbox>

                    <Center className="pokemon-img"><img src={animated? pokemon.imgUrlGif : pokemon.imgUrl} /></Center>

                    <Flex className="Types" direction="column" justify="center" align="center">
                        {pokemon.types.map((type)=><img src={type.imgUrl} key={type.name} />)}
                    </Flex>
                </Flex>

                <Flex direction="column" align="center" justify="center">
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