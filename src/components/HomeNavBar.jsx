import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container"
import { GiTomato } from 'react-icons/gi';
import { useNavigate, Link } from 'react-router-dom';
import COLORS from "../utils/colors";


function HomeNavBar() {
    const navigate = useNavigate
    return (
        <Navbar style={{ background: COLORS.green }}>
            <Container>
                <Link to="/" className="nav-link">
                    <Navbar.Brand style={{ color: COLORS.neutral }}>
                        <GiTomato />
                        {' '}
                        Heirloom Recipes
                    </Navbar.Brand>

                </Link>
   
                <Nav className="me-auto" >
                    <Link to="/recipes" className="nav-link" style={{ color: COLORS.neutral }}>
                        All Recipes
                    </Link>
                    <Link to="/create-recipe" className="nav-link" style={{ color: COLORS.neutral }}>
                        Add Recipe
                    </Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default HomeNavBar;
