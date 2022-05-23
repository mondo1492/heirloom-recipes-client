import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carousel from "react-bootstrap/Carousel";
import { IoChevronBackOutline } from 'react-icons/io5';

export default function Recipe() {
    const { state } = useLocation() || {};
    const navigate = useNavigate();
    let { id } = useParams();

    // const [recipe, setRecipe] = useState(state.recipe);
    const [recipe, setRecipe] = useState();
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/recipes/${id}`)
            .then(resp => setRecipe(resp.data))
    }, []);

    if (!recipe) {
        return (<div>no recipe</div>)
    }

    const {
        name,
        description,
        ryield,
        yield_unit,
        ingredientSections,
        instructions,
        tags,
        images
    } = recipe;

    const showImages = images || true;

    return (
        <Container style={{ padding: 40}}>
            <Row style={{minHeight: 100}}>
                <Col xs={4} md={4} lg={4}>
                    <div style={{ display: 'flex', flexDirection: 'column'}}>
                        <Button size={"sm"} variant="outline-secondary" onClick={() => navigate('/recipes')}><IoChevronBackOutline />Back to Recipes</Button>
                        <span><b>Yield:</b> {ryield} {yield_unit}</span>
                    </div>
                </Col>
                <Col>
                    <h1 style={{ marginBottom: 16 }}>{name}</h1>
                </Col>
            </Row>
            <Row>
                <Col xs={4} md={4} lg={4}>
                    <Ingredients ingredientSections={ingredientSections} />
                    <b>Tags</b>
                    <ul style={{display: 'flex', flexDirection: 'column'}}>
                        {tags.map(({ tag_type, text }) => <li key={tag_type}>{tag_type.charAt(0).toUpperCase() + tag_type.slice(1)}: {text}</li>)}
                    </ul>
                </Col>
                <Col>
                    <Description text={description} />
                    <HorizontalLine />
                    {showImages && <Images /> }
                    {showImages && <HorizontalLine /> }
                    <Instructions instructions={instructions} />
                </Col>
            </Row>
        </Container>
    )
}

const Description = ({ text }) => {
    return (
        <div style={{ fontStyle: 'italic' }}>
            {text}
        </div>
    )
}

const HorizontalLine = ({ }) => {
    return <div className='line1' />
}


const Ingredients = ({ ingredientSections }) => {
    return (
        <div>
            {ingredientSections.map(({ name, ingredients }, idx) => {
                return (
                    <div key={`section-${idx}`}>
                        {name && <b>{name}</b>}
                        <ul>
                            {ingredients.map(({ text }, idx) => <li key={idx} style={{ fontSize: 14 }}>{text}</li>)}
                        </ul>
                    </div>
                )
            })}
        </div>
    )
}

const Instructions = ({ instructions }) => {
    return (
        <div>
            {instructions.map(({ name, text }, idx) => {
                const isSection = name != '';
                return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', paddingBottom: '20px' }}>
                        {name && <b>{name}</b>}
                        {text && <div style={{ whiteSpace: 'pre-line', marginLeft: isSection ? 20 : 0 }}>{text}</div>}
                    </div>
                )
            })}
        </div>
    )
}

const Images = () => {
    const images = [
        {
            text: '21',
            url: 'https://s3.amazonaws.com/finecooking.s3.tauntonclud.com/app/uploads/2019/12/08105502/chicken_guacmole_tacos_wide-1080x607.jpg'
        },
        {
            text: '2',
            url: 'https://s3.amazonaws.com/finecooking.s3.tauntonclud.com/app/uploads/2017/04/18234624/brioche-a-tete-main.jpg',
        }
    ]
    if (images.length === 1) {
        return (
            <div className="img-container">
                <img
                    className="d-block w-100"
                    src={images[0].url}
                    alt={`Image ${1}`}
                />
            </div>
        )
        
    } else {
        return (
            <div>
                <Carousel >
                    {images.map(({ text, url }, idx) => {
                        return (
                            <Carousel.Item key={url}>
                                <div className="img-container">
                                    <img
                                        className="d-block w-100"
                                        src={url}
                                        alt={`Slide ${idx}`}
                                    />
                                </div>
                                {/* <Carousel.Caption>
                                <h3>First slide label</h3>
                                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                            </Carousel.Caption> */}
                            </Carousel.Item>
                        )
                    })}
                </Carousel>
            </div>
        )
    }
}