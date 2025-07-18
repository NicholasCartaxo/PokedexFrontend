function formatName(name : string) : string{
    return name.replace(/-/g,' ').replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
}

export class PokemonFetch{

    private static readonly POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon/";
    private static readonly TYPEAPI_URL = "https://pokeapi.co/api/v2/type/";

    public async fetchAllPokemon() : Promise<PokemonLight[]> {
        const response = await fetch(PokemonFetch.POKEAPI_URL+"?limit=2000");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        var pokemonLightList = response.json().then((value)=> value.results.map((value : PokemonLightJson)=>new PokemonLight(value)));
        return pokemonLightList;
    }

    public async fetchAllType() : Promise<TypeLight[]> {
        const response = await fetch(PokemonFetch.TYPEAPI_URL);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        var typeLightList = response.json().then((value)=> value.results.map((value : TypeLightJson)=>new TypeLight(value)));
        return typeLightList;
    }

    public async fetchPokemon(id:number) : Promise<PokemonFull | null> {
        const response = await fetch(PokemonFetch.POKEAPI_URL+id);
        if (!response.ok) {
            return null;
        }
        return response.json().then((value)=> new PokemonFull(value));
    }
}

type PokemonLightJson = {name : string, url : string};

export class PokemonLight{

    public readonly name : string;
    private readonly url : string;

    public constructor(json : PokemonLightJson){
        this.name = formatName(json.name);
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
                        sprites : {front_default: string,other:
                            {showdown: {front_default : string},
                             "official-artwork": {front_default : string}}}, 
                        height : number, 
                        weight : number, 
                        id : number, 
                        types : {type : TypeLightJson}[],
                        stats : StatJson[]
                    }

export class PokemonFull{

    public readonly name : string;
    public readonly imgUrl : string;
    public readonly imgUrlGif : string;
    public readonly height : number;
    public readonly weight : number;
    public readonly id : number;
    private readonly typesLight : TypeLight[];
    public types : TypeFull[];
    public readonly stats : Stat[];
    
    public constructor(json : PokemonFullJson){
        this.name = formatName(json.name)
        this.imgUrl = json.sprites.other["official-artwork"].front_default
        this.imgUrlGif = json.sprites.other.showdown.front_default;
        this.height = json.height;
        this.weight = json.weight;
        this.id = json.id;
        this.types = [];

        this.typesLight =  json.types.map((typeJson) =>{return new TypeLight(typeJson.type);})

        this.stats = json.stats.map((statJson) => {return new Stat(statJson);});
    }

    public async fetchFullTypes() : Promise<PokemonFull>{
        const promises = this.typesLight.map((typeLight) =>{
            return typeLight.fetchTypeFull().then((typeFull)=>{return typeFull;});
        });

        return Promise.all(promises).then((typesFull)=>{
            this.types = typesFull
            return this;
        });
    }

}


type TypeLightJson = {name : string, url : string};

export class TypeLight{

    public readonly name : string;
    private readonly url : string;

    public constructor(json : PokemonLightJson){
        this.name = json.name;
        this.url = json.url;
    }

    public async fetchTypeFull() : Promise<TypeFull>{
        const response = await fetch(this.url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        var typeFull = response.json().then((value)=> new TypeFull(value));
        return typeFull;
    }
}

type TypeFullJson = {name : string,
                     pokemon : {pokemon : PokemonLightJson}[],
                     sprites : {"generation-ix" : {"scarlet-violet" : {name_icon : string}},
                                "generation-iv" : {"diamond-pearl" : {name_icon : string}}}};

export class TypeFull{
    
    public readonly name : string;
    public readonly imgUrl : string;
    public readonly pokemons : PokemonLight[];
    
    public constructor(json : TypeFullJson){
        this.name = json.name;
        this.imgUrl = json.sprites["generation-ix"]["scarlet-violet"].name_icon != null ? 
        json.sprites["generation-ix"]["scarlet-violet"].name_icon : json.sprites["generation-iv"]["diamond-pearl"].name_icon;
        
        this.pokemons = json.pokemon.map((pokemonJson) => new PokemonLight(pokemonJson.pokemon));
    }

}



type StatJson = {base_stat : number,
                 stat : {name : string}
                }

export class Stat{
    public readonly name : string;
    public readonly value : number;

    public constructor(json : StatJson){
        this.name = formatName(json.stat.name);
        this.value = json.base_stat;
    }
}