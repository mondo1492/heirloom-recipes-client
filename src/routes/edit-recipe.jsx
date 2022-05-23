import CreateOrEditRecipe from "../components/CreateOrEditRecipe";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function EditRecipe() {
    const [recipe, setRecipe] = useState();
    let { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/recipes/${id}`)
            .then(({ data }) => {
                let selectedTags = {}
                data.tags.forEach((tag) => {
                    selectedTags[tag.tag_type] = tag.id;
                })

                let formattedRecipe = {
                    ingredients: data.ingredientSections
                        .map(({ name, ingredients }) => ({
                            sectionName: name,
                            items: ingredients.map(({ text }) => text)
                        })),
                    recipeName: data.name,
                    recipeDescription: data.description,
                    steps: data.instructions.map(({name, text})=> ({ sectionName: name, text: text})),
                    recipeYield: {
                        yield: data.ryield,
                        unit: data.yield_unit
                    },
                    selectedTags: selectedTags // TODO
                };
                setRecipe(formattedRecipe)
            })
    }, []);


    const handleSave = (recipeDataForApi) => {
        const saveRecipe = async () => {
            axios.put(`${process.env.REACT_APP_API_URL}/recipes/${id}`, recipeDataForApi)
                .then(resp => navigate(`/recipes/${resp.data.id}`))
                .catch(resp => 'Error')
        }

        saveRecipe();
    }

    if (recipe == null) {
        return (
            <div>Getting Recipe</div>
        )
    } else {
        return (
            <CreateOrEditRecipe recipe={recipe} onSave={handleSave} />
        )
    }
}