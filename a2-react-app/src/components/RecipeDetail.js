import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { gql, useQuery } from "@apollo/client";

import moment from "moment"

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

function RecipeDetail() {

    const newRecipe = {
        title: "",
        category: "",
        ingredients: [],
        instructions: [],
        date: moment().format('YYYY-MM-DD')
    }

    const { recipeId } = useParams()
    const [recipe, setRecipe] = useState({ ...newRecipe })
    const loadRecipeResult = useQuery(RECIPE_QUERY, { variables: { itemId: recipeId } })

    useEffect(() => {
        if (recipeId && loadRecipeResult.data && loadRecipeResult.data.recipe) {
            setRecipe({ ...loadRecipeResult.data.recipe, itemId: parseInt(loadRecipeResult.data.recipe.itemId) });
        }
    }, [loadRecipeResult.data])

    return (<div class="container-fluid p-4">
        <div class="card text-center">
            <div class="card-header h6">{recipe.category}</div>
            <div class="card-body">
                <h4 class="card-title">{recipe.title}</h4>
                <div class="row justify-content-center">
                    <div className="col-sm-4 col-md-4 col-lg-4 m-3">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item h6">Ingredients</li>
                            {recipe.ingredients.map((item) => <li class="list-group-item" key={item}>{item}</li>)}
                        </ul>
                    </div>
                    <div className="col-sm-5 col-md-5 col-lg-5 m-3">
                        <li class="list-group-item h6">Instructions</li>
                        <ul class="list-group list-group-flush">
                            {recipe.instructions.map((item) => <li class="list-group-item" key={item}>{item}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="card-footer text-body-secondary">{moment(recipe.date).format('MMMM Do YYYY')}</div>
        </div>
    </div>)
}

export default RecipeDetail