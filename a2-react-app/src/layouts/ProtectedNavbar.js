import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import SecurityContext from "../services/contexts/SecurityContext"

function ProtectedNavBar() {
    const {setLoggedIn} = useContext(SecurityContext)
    const navigate = useNavigate()

    return (
        <nav class="navbar bg-body-secondary">
            <div class="container-fluid">
                <span class="navbar-brand m-0 h1">Recipe Manager</span>
                <div class="navbar-nav flex-row">
                    <button class="nav-link pe-4" onClick={() => navigate("/")}>Dashboard</button>
                    <button class="nav-link pe-4" onClick={() => navigate("/recipes")}>Recipes</button>
                    <button class="nav-link pe-4" onClick={() => navigate("/add")}>Add</button>
                    <button class="nav-link pe-2" onClick={() => {setLoggedIn(false); localStorage.removeItem("loginToken")}}>Logout</button>
                </div>
            </div>
        </nav>
    )
}

export default ProtectedNavBar