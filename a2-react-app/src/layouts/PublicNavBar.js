import { useNavigate } from "react-router-dom"

function PublicNavBar({ label, link }) {
    const navigate = useNavigate()
    
    return (
        <nav class="navbar bg-body-secondary">
            <div class="container-fluid">
                <span class="navbar-brand m-0 h1">Recipe Manager</span>
                <div class="navbar-nav flex-row">
                    <button class="nav-link pe-4" onClick={() => navigate(link)}>{label}</button>
                </div>
            </div>
        </nav>
    )
}

export default PublicNavBar