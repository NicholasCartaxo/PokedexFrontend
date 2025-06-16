import type { JSX } from "react";
import { Link, Outlet } from "react-router-dom";

function Layout() : JSX.Element{

    return <><Link to="/">Pokedex</Link>
    
    <Outlet />

    </>
    
}

export default Layout