import CreateOrEditRecipe from "../components/CreateOrEditRecipe";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:3000'

export default function CreateRecipe() {
    const navigate = useNavigate();

    const handleSave = (recipeDataForApi) => {
        const saveRecipe = async () => {
            axios.post(`${BASE_URL}/api/v1/recipes`, recipeDataForApi)
                .then(resp => navigate(`/recipes/${resp.data.id}`))
                .catch(resp => 'Error')
        }

        saveRecipe();
    }

    return (
        <CreateOrEditRecipe onSave={handleSave} />
    )
}