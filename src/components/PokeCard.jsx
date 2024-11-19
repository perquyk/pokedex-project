import React, {useEffect, useState} from 'react'
import {getFullPokedexNumber, getPokedexNumber} from "../utils/";
import TypeCard from "./TypeCard.jsx";
import Modal from "./Modal.jsx";

function PokeCard(props) {

    const {selectedPokemon} = props
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [skill, setSkill] = useState(null)
    const [loadingSkill, setLoadingSkill] = useState(false)



    const {name, height, abilities, stats, types, moves, sprites} = data || {}

    const imgList = Object.keys(sprites || {}).filter( val => {
        if(!sprites[val]) {return false}
        return !['versions', 'other'].includes(val);

    })

    async function fetchMoveData(move, moveUrl){
        if(loading || !localStorage || !moveUrl) {return}

        // check cache for move
        let c = {}
        if (localStorage.getItem('pokemon-moves')) {
            c = JSON.parse(localStorage.getItem('pokemon-moves'))
        }

        if (move in c) {
            setSkill(c[move])
            console.log('found move in cache.')
            return
        }

        try{
            setLoadingSkill(true)
            const res = await fetch(moveUrl)
            const moveData = await res.json()
            console.log('Fetched move from API: ', moveData);
            const description = moveData?.flavor_text_entries.filter(
                val => {
                    return val.version_group.name = 'firered-leafgreen'
                }
            )[0]?.flavor_text
            const skillData = {
                name: move,
                description
            }
            setSkill(skillData)
            c[move] = skillData
            localStorage.setItem('pokemon-moves', JSON.stringify(c))
        }
        catch(err){
            console.log(err)
        }
        finally{
            setLoadingSkill(false)
        }

    }

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
            console.log("found pokemon in cache.")
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
                console.log("Fetched pokemon data from API")

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
                {skill && (<Modal handleCloseModal={() => {
                    setSkill(null)
                }}>
                    <div>
                        <h6>Name</h6>
                        <h2 className='skill-name'>{skill.name.replaceAll('-', ' ')}</h2>
                    </div>
                    <div>
                        <h6>Description</h6>
                        <p>{skill.description}</p>
                    </div>
                </Modal>
                )}
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
                                onClick={() => {
                                    fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)
                                }}
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
