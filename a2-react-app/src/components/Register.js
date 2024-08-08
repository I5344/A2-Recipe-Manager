import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

const REGISTER_MUTATION = gql`
    mutation registerMutation($username: String!, $password: String!, $email: String!) {
        register(username: $username, password: $password, email: $email)
  }
`;

function Register() {
    const [loadRegister, registerResult] = useMutation(REGISTER_MUTATION)
    const [formData, setFormData] = useState({ username: "", email: "", password: "" })
    const [wasValidated, setWasValidated] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        if (formData.username.length && formData.password.length && formData.email.length) {
            setWasValidated("was-validated")
        }
    }, [formData])

    function chngFn(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    };

    async function submit(e) {
        e.preventDefault()
        setWasValidated("was-validated")
        if (e.target.checkValidity()) {
            await loadRegister({ variables: formData })
            navigate("/login", { replace: true })
        }
    }

    return (<div class="container-fluid p-4">
        <form onSubmit={submit} noValidate class={wasValidated}>
            <div class="row mt-2 justify-content-center">
                <h1 class="display-5 col-sm-4 col-md-4 col-lg-4">Create an account</h1>
            </div>

            <div class="row mt-4 justify-content-center">
                <div class="col-sm-4 col-md-4 col-lg-4">
                    <label for="username" class="form-label lead">Username</label>
                    <input type="text" class="form-control" name="username" id="username"
                        value={formData.username} onChange={chngFn} pattern="^[a-zA-Z0-9]+$" minLength={3} required />
                    <div class="invalid-feedback">Username is too short</div>
                </div>
            </div>

            <div class="row mt-4 justify-content-center">
                <div class="col-sm-4 col-md-4 col-lg-4">
                    <label for="email" class="form-label lead">Email address</label>
                    <input type="email" class="form-control" name="email" id="email"
                        value={formData.email} onChange={chngFn} required />
                    <div class="invalid-feedback">Invalid Email</div>
                </div>
            </div>

            <div class="row mt-4 justify-content-center">
                <div class="col-sm-4 col-md-4 col-lg-4">
                    <label for="password" class="form-label lead">Password</label>
                    <input type="password" class="form-control" name="password" id="password"
                        value={formData.password} onChange={chngFn} minLength={6} required />
                    <div class="invalid-feedback">Password must contain atleast 6 characters</div>
                    <div class="valid-feedback">Password is strong enoough</div>
                </div>
            </div>

            <div class="row justify-content-center mt-4">
                <button type="submit" class="btn btn-primary col-auto">Register</button>
            </div>
        </form>
    </div>)
}

export default Register