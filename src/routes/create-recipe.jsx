import CreateOrEditRecipe from "../components/CreateOrEditRecipe";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function CreateRecipe() {
    const navigate = useNavigate();

    const handleSave = (recipeDataForApi) => {
        const saveRecipe = async () => {
            axios.post(`${process.env.REACT_APP_API_URL}/recipes`, recipeDataForApi)
                .then(resp => navigate(`/recipes/${resp.data.id}`))
                .catch(resp => 'Error')
        }

        saveRecipe();
    }

    return (
        <CreateOrEditRecipe onSave={handleSave} />
    )
}