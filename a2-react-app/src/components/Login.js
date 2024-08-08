import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

import SecurityContext from "../services/contexts/SecurityContext";

const LOGIN_MUTATION = gql`
    mutation loginMutation($username: String!, $password: String!) {
        login(username: $username, password: $password)
  }
`;

function Login() {
    const [loadLogin, loginResult] = useMutation(LOGIN_MUTATION)
    const { setLoggedIn } = useContext(SecurityContext)
    const [formData, setFormData] = useState({ username: "", password: "" })
    const [isInvalid, setIsInvalid] = useState(false)
    const navigate = useNavigate()

    function chngFn(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    };

    async function submit(e) {
        e.preventDefault()
        if (e.target.checkValidity()) {
            try {
                let response = await loadLogin({ variables: formData })
                setIsInvalid(false)
                setLoggedIn(true)
                localStorage.setItem("loginToken", response.data.login)
                navigate("/", { replace: true })
            } catch (err) {
                setIsInvalid(true)
            }
        } else {
            setIsInvalid(true)
        }
    }

    return (<div class="container-fluid">
        <form onSubmit={submit} noValidate>
            <div class="row pt-4 justify-content-center">
                <div class="col-auto">
                    <h1 class="display-4">Login</h1>
                </div>
            </div>

            <div class="row pt-4 justify-content-center">
                <div class="col-4">
                    <div class="form-floating">
                        <input type="text" class="form-control" name="username" id="username" placeholder="Username"
                            value={formData.username} onChange={chngFn} required />
                        <label for="username" class="text-secondary">Username</label>
                    </div>
                </div>
            </div>

            <div class="row pt-4 justify-content-center">
                <div class="col-4">
                    <div class="form-floating">
                        <input type="password" class="form-control" name="password" id="password" placeholder="Password"
                            value={formData.password} onChange={chngFn} required />
                        <label for="password" class="text-secondary">Password</label>
                    </div>
                </div>
            </div>

            <div class="row justify-content-center pt-4">
                <button type="submit" class="btn btn-secondary col-auto">Login</button>
            </div>
        </form>

        {isInvalid &&
            <div class="row justify-content-center mt-4">
                <div class="col-auto alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Invalid credentials!</strong> Please enter valid username or password.
                    <button type="button" class="btn-close" onClick={() => setIsInvalid(false)}></button>
                </div>
            </div>
        }
    </div>)
}

export default Login