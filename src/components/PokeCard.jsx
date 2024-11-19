import React, {useEffect, useState} from 'react'
import {getFullPokedexNumber, getPokedexNumber} from "../utils/";
import TypeCard from "./TypeCard.jsx";

function PokeCard(props) {

    const {selectedPokemon} = props
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)

    const {name, height, abilities, stats, types, moves, sprites} = data || {}

    const imgList = Object.keys(sprites || {}).filter( val => {
        if(!sprites[val]) {return false}
        if(['versions', 'other'].includes(val)) {return false}
        return true
    })

    useEffect(() => {
        // if loading, exit logic
        if (loading || !localStorage) { return }
        // Check if selected Pokémon info is available in the cache
        // 1. Define cache.
        let cache = {}
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'))
        }
        // 2. Check if selected Pokémon is in the cache, otherwise fetch from API.
        if (selectedPokemon in cache ) {
            //read from cache
            setData(cache[selectedPokemon])
            return
        }
        //fetch from API
        async function fetchPokemonData(){
            setLoading(true)
            try {
                const baseUrl = "https://pokeapi.co/api/v2/"
                const suffix = "pokemon/" + getPokedexNumber(selectedPokemon)
                const finalUrl = baseUrl + suffix
                const res = await fetch(finalUrl)
                const pokemonData = await res.json()
                setData(pokemonData)
                console.log(pokemonData)

                cache[selectedPokemon] = pokemonData
                localStorage.setItem('pokedex', JSON.stringify(cache))
            } catch (err) {
                console.log(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchPokemonData();

        // if we fetch from api, save info to cache

    }, [selectedPokemon]);

    if(loading || !data){
        return (
            <div>
                <h4>Loading...</h4>
            </div>
        )
    }

    return (
        <>
            <div className="poke-card">
                <div>
                    <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                    <h2>{name}</h2>
                </div>
                <div className="type-container">
                    {types.map((typeObj, typeIndex) => {
                        return (
                            <TypeCard  key={typeIndex} type={typeObj?.type?.name} />
                        )
                    })}
                </div>
                <img className="default-img" src={'/pokemon/' + getFullPokedexNumber(selectedPokemon) + '.png'} alt={`${name}-large-image`}/>
                <div className="img-container">
                    {imgList.map((spriteUrl, spriteIndex) => {
                        const imgUrl = sprites[spriteUrl]
                        return (
                            <img key={spriteIndex} src={imgUrl} alt={`${name}-image-${spriteUrl}`}/>
                        )
                    })}
                </div>
                <h3>Stats</h3>
                <div className="stats-card">
                    {stats.map((statObj, index) => {
                        const {stat, base_stat} = statObj
                        return (
                            <div
                                key={index}
                                className='stat-item'
                            >
                                <p>{stat?.name.replaceAll('-', ' ')}</p>
                                <h4>{base_stat}</h4>
                            </div>

                        )
                    })}
                </div>
                <h3>Moves</h3>
                <div className="pokemon-move-grid">
                    {moves.map((moveObj, moveIndex) => {
                        return (
                            <button
                                className='button-card pokemon-move'
                                key={moveIndex}
                                onClick={() => {}}
                            >
                                <p>{moveObj?.move?.name.replaceAll('-', ' ')}</p>
                            </button>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default PokeCard
