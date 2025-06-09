export default class PokemonFetch{

    private static readonly POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon/";

    public async fetchAll() : Promise<Response> {
        const response = await fetch(PokemonFetch.POKEAPI_URL+'?limit=2000');
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return response;
    }

}