import logo from './logo.svg';
import { Link } from "react-router-dom";
import './App.css';
import Button from 'react-bootstrap/Button'
import Home from './routes/home';
import HomeNavBar from './components/HomeNavBar';
import CreateRecipe from './routes/create-recipe';
import EditRecipe from './routes/edit-recipe';
import Recipes from './routes/recipes';
import Recipe from './routes/recipe';
import {
  Routes,
  Route,
} from "react-router-dom";
import COLORS from './utils/colors';


function App() {
  return (
    <div className="App">
      <HomeNavBar />
      <div style={{ background: COLORS.neutral }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-recipe" element={<CreateRecipe />} />
          <Route path="/edit-recipe/:id" element={<EditRecipe />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:id" element={<Recipe />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
