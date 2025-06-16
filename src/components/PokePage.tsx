import type { JSX } from "react";
import type { PokemonFull } from "../PokemonController";
import { useLocation } from "react-router-dom";

function PokePage() : JSX.Element{
    const location = useLocation();
    const {pokemon} : {pokemon: PokemonFull} = location.state;

    return <div>
        aaaa {pokemon.name}
        </div>
    
}

export default PokePage