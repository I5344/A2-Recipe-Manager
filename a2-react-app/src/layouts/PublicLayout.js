import Login from "../components/Login"
import Register from "../components/Register"
import PublicNavBar from "./PublicNavBar"

function PublicLayout({ onBoard }) {
    return (<div>
        <header>
            {onBoard === "login" && <PublicNavBar label={"Register"} link={"/register"} />}
            {onBoard === "register" && <PublicNavBar label={"Login"} link={"/login"} />}
        </header>
        <body>
            {onBoard === "login" && <Login />}
            {onBoard === "register" && <Register />}
        </body>
    </div>)
}

export default PublicLayout