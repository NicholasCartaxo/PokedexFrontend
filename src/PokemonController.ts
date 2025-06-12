export class PokemonFetch{

    private static readonly POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon/?limit=2000";
    private static readonly TYPEAPI_URL = "https://pokeapi.co/api/v2/type/";

    public async fetchAllPokemon() : Promise<PokemonLight[]> {
        const response = await fetch(PokemonFetch.POKEAPI_URL);
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
                        sprites : {front_default: string,other:{showdown: {front_default : string}}}, 
                        height : number, 
                        weight : number, 
                        id : number, 
                        types : {type : TypeLightJson}[]
                    }

export class PokemonFull{
    
    public readonly name : string;
    public readonly imgUrl : string;
    public readonly height : number;
    public readonly weight : number;
    public readonly id : number;
    private readonly typesLight : TypeLight[];
    private _types : TypeFull[];
    
    public constructor(json : PokemonFullJson){
        this.name = json.name;
        this.imgUrl = json.sprites.other.showdown.front_default != null ? json.sprites.other.showdown.front_default : json.sprites.front_default;
        this.height = json.height;
        this.weight = json.weight;
        this.id = json.id;
        this._types = [];

        this.typesLight =  json.types.map((typeJson) =>{return new TypeLight(typeJson.type);})
    }

    public get types(){
        return this._types;
    }

    public async fetchFullTypes() : Promise<PokemonFull>{
        const promises = this.typesLight.map((typeLight) =>{
            return typeLight.fetchTypeFull().then((typeFull)=>{return typeFull;});
        });

        return Promise.all(promises).then((typesFull)=>{
            this._types = typesFull
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