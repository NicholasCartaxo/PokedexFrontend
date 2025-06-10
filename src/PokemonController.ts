export class PokemonFetch{

    private static readonly POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon/";

    public async fetchAll() : Promise<PokemonLight[]> {
        const response = await fetch(PokemonFetch.POKEAPI_URL+'?limit=2000');
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        var pokemonLightList = response.json().then((value)=> value.results.map((value : PokemonLightJson)=>new PokemonLight(value)));
        return pokemonLightList;
    }

}


type PokemonLightJson = {name : string, url : string};

export class PokemonLight{

    public readonly name : string;
    private readonly url : string;

    public constructor(json : PokemonLightJson){
        this.name = json.name;
        this.url = json.url;
    }

    public async fetchPokemonFull() : Promise<PokemonFull>{
        const response = await fetch(this.url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        var pokemonFull = response.json().then((value)=> new PokemonFull(value));
        return pokemonFull;
    }



}

type PokemonFullJson = {name : string, 
                        sprites : {other:{showdown: {front_default : string}}}, 
                        height : number, 
                        weight : number, 
                        id : number, 
                        types : {type : {name : string}}[]
                    }

export class PokemonFull{
    
    public readonly name : string;
    public readonly imgUrl : string;
    public readonly height : number;
    public readonly weight : number;
    public readonly id : number;
    public readonly types : string[];
    
    public constructor(json : PokemonFullJson){
        this.name = json.name;
        this.imgUrl = json.sprites.other.showdown.front_default;
        this.height = json.height;
        this.weight = json.weight;
        this.id = json.id;
        this.types = json.types.map((typeJson) => typeJson.type.name);
    }

}