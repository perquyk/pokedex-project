import Header from "./components/Header.jsx";
import SideNav from "./components/SideNav.jsx";
import PokeCard from "./components/PokeCard.jsx";

import {useState} from "react";

function App() {
    const [selectedPokemon, setSelectedPokemon] = useState(0);



    return (
        <>
            <Header />
            <SideNav
                selecedPokemon={selectedPokemon}
                setSelectedPokemon={setSelectedPokemon}
            />
            <PokeCard
                selectedPokemon={selectedPokemon}
            />
         </>
    )
}

export default App
