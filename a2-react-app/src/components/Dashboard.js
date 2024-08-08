import { useContext, useEffect, useState } from "react"

import CategoryContext from "../services/contexts/CategoryContext"
import RecipeContext from "../services/contexts/RecipeContext"

function Dashboard() {
    const {recipes} = useContext(RecipeContext)
    const {categories} = useContext(CategoryContext)
    const [selectedCategory, setSelectedCategory] = useState("")
    const [searchKeyword, setSearchKeyword] = useState("")
    const [filteredRecipes, setFilteredRecipes] = useState([...recipes])
    const [searchFilteredRecipes, setSearchFilteredRecipes] = useState([...filteredRecipes])

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
        <div class="row">
            <div class="col-auto btn-group" role="group">
                {categories.map((ele, ind) =>
                    <>
                        <input type="radio" class="btn-check" name="btnradio" id={ind} autocomplete="off" onClick={() => setSelectedCategory(categories[ind])} checked={selectedCategory === ele} />
                        <label class="btn btn-secondary" for={ind}>{ele}</label>
                    </>
                )}
            </div>

            <div class="col-auto">
                <input class="col-3 form-control" type="text" placeholder="Search" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)}/>
            </div>
        </div>

        <div class="row mt-4 ms-1">
            <div class="card text-end me-4 col-auto">
                <div class="card-body">
                    <h5 class="card-title">Total Recipes</h5>
                    <p class="card-text h1">{searchFilteredRecipes.length}</p>
                </div>
            </div>

            <ul class="list-group col-auto">
                {searchFilteredRecipes.map((item) =>
                    <li class="list-group-item">{item.title}</li>
                )}
            </ul>
        </div>
    </div>)
}

export default Dashboard