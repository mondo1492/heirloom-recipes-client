import { useState, useCallback, useEffect } from "react";
import { useModal } from '@ebay/nice-modal-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { IoChevronBackOutline } from 'react-icons/io5';


const BASE_URL = 'http://localhost:3000'

export default function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {

        // declare the async data fetching function
        const fetchData = async () => {
            const res = await axios.get(`${BASE_URL}/api/v1/recipes`)
            setRecipes(res.data);
        }

        // call the function
        fetchData().catch(console.error);;
    }, []);

    const handleDeleteRecipe = (recipeId, idx) => {
        const deleteRecipe = async () => {
            const res = await axios.delete(`${BASE_URL}/api/v1/recipes/${recipeId}`)
            let newRecipes = [...recipes]
            newRecipes.splice(idx, 1)
            setRecipes(newRecipes);
        }
        deleteRecipe();
    }


    return (
        <div style={{padding: '60px'}}>
            <Button size={"sm"} variant="outline-secondary" onClick={() => navigate('/')}><IoChevronBackOutline />Back to Home</Button>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Recipe Name</th>
                        <th>Recipe Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {recipes.map((recipe, idx) => (
                        <tr key={recipe.id} onClick={() => navigate(`/recipes/${recipe.id}`)}>
                            <td>{idx}</td>
                            <td>{recipe.name}</td>
                            <td>{recipe.descriptin}</td>
                            <td>
                                <div onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    navigate(`/edit-recipe/${recipe.id}`);
                                }}>Edit</div>
                                <div onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDeleteRecipe(recipe.id, idx);
                                }}>Delete</div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}