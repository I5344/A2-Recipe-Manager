import { createBrowserRouter } from "react-router-dom";

import AddRecipe from "../components/AddRecipe";
import Dashboard from "../components/Dashboard";
import Recipes from "../components/Recipes";
import RecipeDetail from "../components/RecipeDetail";
import ProtectedLayout from "../layouts/ProtectedLayout";
import PublicLayout from "../layouts/PublicLayout";

const AppRoutes = createBrowserRouter([
    {
        path: '/login',
        element: <PublicLayout onBoard={"login"}/>
    },
    {
        path: '/register',
        element: <PublicLayout onBoard={"register"}/>
    },
    {
        path: '/',
        element: <ProtectedLayout/>,
        children: [
            {
                path: '/',
                element: <Dashboard/>,
            },
            {
                path: '/add',
                element: <AddRecipe/>,
            },
            {
                path: '/edit/:recipeId',
                element: <AddRecipe/>,
            },
            {
                path: '/recipes',
                element: <Recipes/>,
            },
            {
                path: '/recipe/:recipeId',
                element: <RecipeDetail/>,
            }
        ]
    }
])

export default AppRoutes