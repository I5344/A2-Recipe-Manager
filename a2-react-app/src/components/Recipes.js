import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { gql, useMutation } from "@apollo/client";

import CategoryContext from "../services/contexts/CategoryContext"
import RecipeContext from "../services/contexts/RecipeContext"

const DELETE_RECIPE_MUTATION = gql`
    mutation deleteRecipeMutation($itemId: ID!) {
        deleteRecipe(itemId: $itemId)
    }
`;

function Recipes() {
    const { recipes, allRecipesRefetch } = useContext(RecipeContext)
    const { categories } = useContext(CategoryContext)
    const [selectedCategory, setSelectedCategory] = useState("")
    const [searchKeyword, setSearchKeyword] = useState("")
    const [filteredRecipes, setFilteredRecipes] = useState([...recipes])
    const [searchFilteredRecipes, setSearchFilteredRecipes] = useState([...filteredRecipes])
    const navigate = useNavigate()

    const [loadDelete, DeleteResult] = useMutation(DELETE_RECIPE_MUTATION)

    async function deleteRecipe(id) {
        await loadDelete({ variables: { itemId: id } })
        allRecipesRefetch()
    }

    useEffect(() => {
        setFilteredRecipes([...recipes])
    }, [recipes])

    useEffect(() => {
        if (selectedCategory) {
            setFilteredRecipes(recipes.filter((item) => item.category === selectedCategory))
        } else {
            setFilteredRecipes([...recipes])
        }
        setSearchKeyword("")
    }, [selectedCategory])

    useEffect(() => {
        setSearchFilteredRecipes([...filteredRecipes])
    }, [filteredRecipes])

    useEffect(() => {
        setSearchFilteredRecipes(filteredRecipes.filter((item) =>
            item.title.toLowerCase().includes(searchKeyword.toLowerCase().trim())
        ))
    }, [searchKeyword])

    return (<div class="container-fluid p-4">
        <div class="row mb-4">
            <div class="col-6">
                <div class="input-group">
                    <span class="input-group-text">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                        </svg>
                    </span>
                    <input type="text" class="form-control" placeholder="Search" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
                </div>
            </div>
        </div>

        <div class="row mb-4">
            <div class="col-6">
                <div class="input-group">
                    <span class="input-group-text">Category</span>
                    <select class="form-select" id="category" onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory} required>
                        <option value="">All</option>
                        {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-6">
                <ul class="list-group">
                    {searchFilteredRecipes.map((item) =>
                        <li class="list-group-item d-flex justify-content-between align-items-center" key={item.itemId}>
                            <div>
                                <div class="fw-bold">{item.title}</div>
                                {item.category}
                            </div>
                            <div class="btn-group" role="group">
                                <button type="button" class="btn btn-outline-secondary" onClick={() => navigate(`/recipe/${item.itemId}`)}>View</button>
                                <button type="button" class="btn btn-secondary" onClick={() => navigate(`/edit/${item.itemId}`)}>Edit</button>
                                <button type="button" class="btn btn-danger" onClick={() => deleteRecipe(item.itemId)}>Delete</button>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    </div>)
}

export default Recipes