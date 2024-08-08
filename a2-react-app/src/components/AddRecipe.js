import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { gql, useQuery, useMutation } from "@apollo/client";

import moment from 'moment';
import CategoryContext from "../services/contexts/CategoryContext"
import RecipeContext from "../services/contexts/RecipeContext";

const RECIPE_QUERY = gql`
    query recipeQuery($itemId: ID!) {
        recipe(itemId: $itemId) {
            itemId
            title
            category
            ingredients
            instructions
            date
        }
    }
`;

const UPDATE_RECIPE_MUTATION = gql`
    mutation updateRecipeMutation ($itemId: ID!, $title: String!, $category: String!, $ingredients: [String!]!, $instructions: [String!]!, $date: String!) {
        updateRecipe(itemId: $itemId, title: $title, category: $category, ingredients: $ingredients, instructions: $instructions, date: $date)
    }
`;

const ADD_RECIPE_MUTATION = gql`
    mutation addRecipeMutation ($title: String!, $category: String!, $ingredients: [String!]!, $instructions: [String!]!, $date: String!) {
        addRecipe(title: $title, category: $category, ingredients: $ingredients, instructions: $instructions, date: $date)
    }
`;

function AddRecipe() {
    const { categories } = useContext(CategoryContext)
    const newRecipe = {
        title: "",
        category: "Breakfast",
        ingredients: [],
        instructions: [],
        date: moment().format('YYYY-MM-DD')
    }
    const [ingredient, setIngredient] = useState("")
    const [instruction, setInstruction] = useState("")

    const [updateRecipe, updateRecipeResult] = useMutation(UPDATE_RECIPE_MUTATION)
    const [addRecipe, addRecipeResult] = useMutation(ADD_RECIPE_MUTATION)

    const { allRecipesRefetch } = useContext(RecipeContext)
    const navigate = useNavigate()

    const { recipeId } = useParams()
    const [recipe, setRecipe] = useState({ ...newRecipe })
    const loadRecipeResult = useQuery(RECIPE_QUERY, { variables: { itemId: recipeId } })

    useEffect(() => {
        if (recipeId && loadRecipeResult.data && loadRecipeResult.data.recipe) {
            setRecipe({ ...loadRecipeResult.data.recipe, itemId: parseInt(loadRecipeResult.data.recipe.itemId) });
        }
    }, [loadRecipeResult.data])

    function chngFn(e) {
        const { name, value } = e.target;
        setRecipe({ ...recipe, [name]: value })
    }

    async function saveRecipe() {
        try {
            if (recipeId) { await updateRecipe({ variables: recipe }) }
            else { await addRecipe({ variables: recipe }) }
            allRecipesRefetch()
            loadRecipeResult.refetch()
            navigate("/", { replace: true })
        } catch (error) {
            throw error
        }
    }

    function ingredientAdded() {
        recipe.ingredients = [...recipe.ingredients, ingredient]
        setRecipe({ ...recipe })
    }

    function instructionAdded() {
        recipe.instructions = [...recipe.instructions, instruction]
        setRecipe({ ...recipe })
    }

    function ingredientDeleted(index) {
        recipe.ingredients = recipe.ingredients.filter((ele, ind) => ind !== index)
        setRecipe({ ...recipe })
    }

    function instructionDeleted(index) {
        recipe.instructions = recipe.instructions.filter((ele, ind) => ind !== index)
        setRecipe({ ...recipe })
    }

    return (<div class="container-fluid p-4">
        <div class="row mb-3">
            <label for="title" class="col-2 col-form-label">Title</label>
            <div class="col-6">
                <input type="text" class="form-control" id="title" name="title" onChange={chngFn} value={recipe.title} required />
            </div>
        </div>

        <div class="row mb-3">
            <label for="category" class="col-2 col-form-label">Category</label>
            <div class="col-6">
                <select class="form-select" id="category" name="category" onChange={chngFn} value={recipe.category} required>
                    {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
            </div>
        </div>

        <div class="row mb-3">
            <label for="ingredient" class="col-2 col-form-label">Ingredients</label>
            <div class="col-6">
                <div class="input-group">
                    <input type="text" class="form-control" id="ingredient" onChange={(e) => setIngredient(e.target.value)} />
                    <button class="btn btn-outline-dark" type="button" id="addIngredient" onClick={ingredientAdded} disabled={ingredient.trim().length < 1}>Add</button>
                </div>
                {recipe.ingredients.length > 0 &&
                    recipe.ingredients.map((item, index) =>
                        <div class="alert alert-light alert-dismissible fade show mt-2 mb-0 me-2" role="alert" style={{ display: "inline-block" }} key={item}>
                            {item}
                            <button type="button" class="btn-close" onClick={() => ingredientDeleted(index)}></button>
                        </div>
                    )
                }
            </div>
        </div>


        <div class="row mb-3">
            <label for="instruction" class="col-2 col-form-label">Instructions</label>
            <div class="col-6">
                <div class="input-group">
                    <input type="text" class="form-control" id="instruction" onChange={(e) => setInstruction(e.target.value)} />
                    <button class="btn btn-outline-dark" type="button" id="addInstruction" onClick={instructionAdded} disabled={instruction.trim().length < 1}>Add</button>
                </div>
                {recipe.instructions.length > 0 &&
                    recipe.instructions.map((item, index) =>
                        <div class="alert alert-light alert-dismissible fade show mt-2 mb-0 me-2" role="alert" style={{ display: "inline-block" }} key={item}>
                            {item}
                            <button type="button" class="btn-close" data-bs-dismiss="alert" onClick={() => instructionDeleted(index)}></button>
                        </div>
                    )
                }
            </div>
        </div>

        <div class="row mb-5">
            <label for="title" class="col-2 col-form-label">Date</label>
            <div class="col-6">
                <input type="date" id="date" name="date" class="form-control" value={recipe.date} onChange={chngFn} required />
            </div>
        </div>

        <div class="row d-flex justify-content-center">
            <button class="btn btn-primary col-auto" onClick={saveRecipe} disabled={recipe.ingredients.length < 1 || recipe.instructions.length < 1}>Save</button>
            <button type="reset" class="btn btn-outline-danger col-auto ms-3" onClick={() => {loadRecipeResult.refetch()}}>Cancel</button>
            <div class="col-4"></div>
        </div>
    </div>)
}

export default AddRecipe