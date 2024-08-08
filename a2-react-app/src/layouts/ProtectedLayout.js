import { useContext, useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { gql, useQuery } from "@apollo/client";

import ProtectedNavBar from "./ProtectedNavbar"

import SecurityContext from "../services/contexts/SecurityContext"
import CategoryContext from "../services/contexts/CategoryContext"
import RecipeContext from "../services/contexts/RecipeContext"

const ALL_RECIPES_QUERY = gql`
    query allRecipesQuery {
        allRecipes {
            itemId
            title
            category
        }
    }
`;

function ProtectedLayout() {
    const { loggedIn } = useContext(SecurityContext)

    const loadAllRecipesResult = useQuery(ALL_RECIPES_QUERY)
    const allRecipesRefetch = loadAllRecipesResult.refetch
    const [recipes, setRecipes] = useState([])

    const [categories] = useState(["Breakfast", "Lunch", "Dinner", "Dessert"])

    useEffect(() => {
        if (loadAllRecipesResult.data && loadAllRecipesResult.data.allRecipes) {
            setRecipes(loadAllRecipesResult.data.allRecipes.map((item) => ({ ...item, itemId: parseInt(item.itemId) })))
        }
    }, [loadAllRecipesResult.data])

    if (!loggedIn) return <Navigate to="/login" replace />
    return (<div>
        <header>
            <ProtectedNavBar />
        </header>
        <main>
            <CategoryContext.Provider value={{ categories }}>
                <RecipeContext.Provider value={{ recipes, allRecipesRefetch }}>
                    <Outlet />
                </RecipeContext.Provider>
            </CategoryContext.Provider>
        </main>
    </div>)
}

export default ProtectedLayout