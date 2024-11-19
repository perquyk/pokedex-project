import Header from "./components/Header.jsx";
import SideNav from "./components/SideNav.jsx";
import PokeCard from "./components/PokeCard.jsx";

import {useState} from "react";

function App() {
    const [selectedPokemon, setSelectedPokemon] = useState(0);
    const [showSideMenu, setShowSideMenu] = useState(false);

    function handleToggleMenu(){
        setShowSideMenu(!showSideMenu);
    }
    function handleCloseMenu(){
        setShowSideMenu(false)
    }

    return (
        <>
            <Header
                handleToggleMenu={handleToggleMenu}
            />
            <SideNav
                selectedPokemon={selectedPokemon}
                setSelectedPokemon={setSelectedPokemon}
                handleCloseMenu={handleCloseMenu}
                showSideMenu={showSideMenu}
            />
            <PokeCard
                selectedPokemon={selectedPokemon}
            />
         </>
    )
}

export default App
