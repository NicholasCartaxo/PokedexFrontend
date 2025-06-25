import { Heading } from "@vtex/shoreline";
import type { JSX } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./layout.css";

function Layout() : JSX.Element{

     const navigate = useNavigate();

    return <>
        <div style={{display:"inline-block"}}><Heading className="clickable" level={1} onClick={()=>navigate("/")}>Pokedex</Heading></div>
        <Outlet />
    </>
    
}

export default Layout