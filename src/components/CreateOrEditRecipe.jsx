import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import InputGroup from 'react-bootstrap/InputGroup'
import BulkAddIngredientsModal from "../components/BulkAddIngredientsModal";
import { IoRemoveCircleOutline, IoAddOutline } from 'react-icons/io5';
import AutosizingTextArea from "../components/AutosizingTextArea/AutosizingTextArea";
import { useRef } from "react";
import { useEffect } from "react";
import SearchDropdown from "../components/SearchDropdown";
import COLORS from "../utils/colors";

const BASE_URL = 'http://localhost:3000'

// TODO: handle all logic here with reducer :)
export default function CreateOrEditRecipe({ recipe, onSave }) {
    const [ingredients, setIngredients] = useState(recipe?.ingredients || [{ sectionName: '', items: [''] }]);
    const [recipeName, setRecipeName] = useState(recipe?.recipeName || '');
    const [recipeDescription, setRecipeDescription] = useState(recipe?.recipeDescription || '');
    const [steps, setSteps] = useState(recipe?.steps || [{ sectionName: '', text: '' }]);
    const [showInputForFirstSection, setShowInputForFirstSection] = useState(false);
    const [showInputForFirstStepSection, setShowInputForFirstStepSection] = useState(false);
    const SECTIONS = {
        NAME: 'name',
        DESCRIPTION: 'description',
        INGREDIENT_SECTION: 'ingredient_section',
        INGREDIENTS: 'ingredients',
        STEP_SECTION: 'step_section',
        STEPS: 'steps',
    }
    const [sectionInFocus, setSectionInFocus] = useState(SECTIONS.NAME)
    const [sectionIdxInFocus, setSectionIdxInFocus] = useState(0)
    const [tags, setTags] = useState({});
    const [selectedTags, setSelectedTags] = useState(recipe?.selectedTags || {
        cuisine: '',
        category: '',
        course: '',
    });

    const [recipeYield, setRecipeYield] = useState(recipe?.recipeYield || {
        yield:  '',
        unit: ''
    });
    const ingredientRefs = useRef({});
    const stepRefs = useRef({});

    const recipeDataForSave = () => {
        return ({
            name: recipeName,
            description: recipeDescription,
            ingredients: ingredients,
            instructions: steps,
            selectedTags: selectedTags,
            yield: recipeYield.yield,
            yield_unit: recipeYield.unit
        })
    }

    useEffect(() => {
        if (sectionInFocus && sectionIdxInFocus != null) {
            switch (sectionInFocus) {
                case SECTIONS.INGREDIENT_SECTION:
                    ingredientRefs?.current[sectionIdxInFocus]?.section?.focus();
                    break;
                case SECTIONS.INGREDIENTS:
                    ingredientRefs?.current[sectionIdxInFocus]?.item?.focus();
                    break;
                case SECTIONS.STEP_SECTION:
                    stepRefs?.current[sectionIdxInFocus]?.section?.focus();
                    break;
            }
            setSectionInFocus(null);
            setSectionIdxInFocus(0);

        }
    }, [ingredients, steps, sectionInFocus, sectionIdxInFocus])

    useEffect(() => {
        axios.get(`${BASE_URL}/api/v1/tags`)
            .then(resp => setTags(resp.data))
    }, []);

    const addBulkIngredients = (sectionIdx, ingredientText) => {
        const ingredientList = ingredientText.split('\n');
        let existingItems = [...ingredients[sectionIdx].items];
        existingItems = existingItems.filter(ei => ei.length > 0);

        let newIngredients = [...ingredients];
        newIngredients.splice(sectionIdx, 1, { ...ingredients[sectionIdx], items: [...existingItems, ...ingredientList] });
        setIngredients(newIngredients);
    }

    const editIngredient = (sectionIdx, ingredientIdx, ingredient) => {
        let newSectionItems = [...ingredients[sectionIdx].items];
        newSectionItems[ingredientIdx] = ingredient;
        let newSection = { ...ingredients[sectionIdx], items: newSectionItems };

        let newIngredients = [...ingredients];
        newIngredients[sectionIdx] = newSection

        setIngredients(newIngredients);
    }

    const editStepSectionText = (stepSectionIdx, text) => {
        const newSteps = [...steps];
        newSteps[stepSectionIdx].text = text;
        setSteps(newSteps);
    }

    const editStepSectionName = (sectionIdx, sectionName) => {
        let newSteps = [...steps];
        newSteps[sectionIdx].sectionName = sectionName;
        setSteps(newSteps);
    }

    const addStepSection = () => {
        setSectionInFocus(SECTIONS.STEP_SECTION);
        if (steps.length === 1 && !showInputForFirstStepSection) {
            setShowInputForFirstStepSection(true);
            setSectionIdxInFocus(0);
        } else {
            setSteps([...steps, { sectionName: '', text: '' }])
            setSectionIdxInFocus(steps.length);
        }
    }

    const addIngredientSection = () => {
        setSectionInFocus(SECTIONS.INGREDIENT_SECTION);

        if (ingredients.length === 1 && !showInputForFirstSection) {
            setShowInputForFirstSection(true);
            setSectionIdxInFocus(0);
        } else {
            setIngredients([...ingredients, { sectionName: '', items: [''] }])
            setSectionIdxInFocus(ingredients.length);
        }
    }

    const editIngredientSectionName = (sectionIdx, sectionName) => {
        let newIngredients = [...ingredients];
        newIngredients[sectionIdx].sectionName = sectionName;
        setIngredients(newIngredients);
    }

    const removeIngredient = (sectionIdx, ingredientIdx) => {
        let newSectionItems = [...ingredients[sectionIdx].items];
        newSectionItems.splice(ingredientIdx, 1)

        let newSection = { ...ingredients[sectionIdx], items: newSectionItems };
        let newIngredients = [...ingredients];
        newIngredients[sectionIdx] = newSection

        // setSectionInFocus(SECTIONS.INGREDIENTS);
        // setSectionIdxInFocus(Math.max(sectionIdx - 1, 0));
        setIngredients(newIngredients);
    }

    const addIngredient = (sectionIdx) => {
        let newSectionItems = [...ingredients[sectionIdx].items, ''];
        let newSection = { ...ingredients[sectionIdx], items: newSectionItems };

        let newIngredients = [...ingredients];
        newIngredients[sectionIdx] = newSection
        setSectionInFocus(SECTIONS.INGREDIENTS);
        setSectionIdxInFocus(sectionIdx);
        setIngredients(newIngredients);
    }

    const removeIngredientSection = (sectionIdx, preserveChildren) => {
        let newSections = [...ingredients];
        if (preserveChildren) {
            newSections[sectionIdx].sectionName = '';
            setShowInputForFirstSection(false);
        } else {
            newSections.splice(sectionIdx, 1)

        }
        // setSectionInFocus(SECTIONS.INGREDIENT_SECTION);
        // setSectionIdxInFocus(Math.max(sectionIdx - 1, 0));
        setIngredients(newSections);
    }

    const removeStepSection = (sectionIdx, preserveChildren) => {
        let newSections = [...steps];
        if (preserveChildren) {
            newSections[sectionIdx].sectionName = '';
            setShowInputForFirstStepSection(false);
        } else {
            newSections.splice(sectionIdx, 1)
        }
        // setSectionInFocus(SECTIONS.STEP_SECTION);
        // setSectionIdxInFocus(Math.max(sectionIdx - 1, 0));
        setSteps(newSections);
    }

    const setTagId = ({ type, tagId }) => {
        setSelectedTags({ ...selectedTags, [type]: tagId });
    }


    const handleSetRecipeYield = ({ value, isUnit }) => {
        const key = isUnit ? 'unit' : 'yield';
        setRecipeYield({ ...recipeYield, [key]: value })
    }

    return (
        <div className="create-recipe-container" style={{ background: COLORS.neutral }}>
            <div>
                <h2>Create a Recipe</h2>
                {/* <Button size={"sm"} variant="outline-secondary" onClick={() => navigate(-1)}>Back To Recipes </Button> */}
            </div>



            <RecipeName
                value={recipeName}
                autoFocus={true}
                onChange={({ target }) => setRecipeName(target.value)} />

            <RecipeDescription
                value={recipeDescription}
                onChange={(text) => setRecipeDescription(text)} />

            <RecipeYield
                value={recipeYield}
                onChange={handleSetRecipeYield} />

            <CusineType options={tags['cuisine']} id={selectedTags['cuisine']} type={'cuisine'} onSelect={setTagId} />

            <CourseType options={tags['course']} id={selectedTags['course']} type={'course'} onSelect={setTagId} />

            <CategoryType options={tags['category']} id={selectedTags['category']} type={'category'} onSelect={setTagId} />

            {/* <RecipeImages /> */}

            <RecipeIngredients
                ingredients={ingredients}
                ingredientRefs={ingredientRefs}
                showInputForFirstSection={showInputForFirstSection}
                onAddSection={addIngredientSection}
                addBulkIngredients={({ sectionIdx, text }) => addBulkIngredients(sectionIdx, text)}
                onIngredientChange={({ sectionIdx, ingredientIdx, text }) => editIngredient(sectionIdx, ingredientIdx, text)}
                onIngredientAdd={({ sectionIdx }) => addIngredient(sectionIdx)}
                onIngredientRemove={({ sectionIdx, ingredientIdx }) => removeIngredient(sectionIdx, ingredientIdx)}
                onSectionNameChange={({ sectionIdx, text }) => editIngredientSectionName(sectionIdx, text)}
                onRemoveIngredientSection={({ sectionIdx, preserveChildren }) => removeIngredientSection(sectionIdx, preserveChildren)}
            />

            <RecipeSteps
                steps={steps}
                stepRefs={stepRefs}
                showInputForFirstStepSection={showInputForFirstStepSection}
                onAddSection={addStepSection}
                onStepSectionNameChange={({ sectionIdx, text }) => editStepSectionName(sectionIdx, text)}
                onStepTextChange={({ sectionIdx, text }) => editStepSectionText(sectionIdx, text)}
                onRemoveStepSection={({ sectionIdx, preserveChildren }) => removeStepSection(sectionIdx, preserveChildren)}
            />


            <div className="d-grid gap-2" style={{ marginTop: 40 }}>
                <Button size={"lg"} variant="success" onClick={() => onSave(recipeDataForSave())}>Save Recipe</Button>
            </div>
        </div>
    )
}

const RecipeName = ({ value, onChange, autoFocus }) => {
    return (
        <Row style={{ marginBottom: '10px' }}>
            <Form.Label className="create-recipe-label" column="lg" lg={2}>{'Name'}</Form.Label>
            <Col>
                <Form.Control
                    value={value}
                    autoFocus={autoFocus}
                    size="lg"
                    type="text"
                    placeholder={'Add name'}
                    onChange={onChange} />
            </Col>
        </Row>
    )
}

const RecipeDescription = ({ value, onChange }) => {
    return (
        <Row style={{ marginBottom: '10px' }}>
            <Form.Label column="lg" lg={2}>{'Description'}</Form.Label>
            <Col>
                <AutosizingTextArea
                    value={value}
                    placeholder={'Add description'}
                    onChange={onChange} />
            </Col>
        </Row>
    )
}

const RecipeYield = ({ value, onChange }) => {
    return (
        <Row style={{ marginBottom: '10px' }}>
            <Form.Label column="lg" lg={2}>{'Yield'}</Form.Label>
            <Col>
                <Row>
                    <Col>
                        <Form.Control
                            value={value.yield}
                            size="md"
                            type="number"
                            placeholder={'Add Yield (ex: 6)'}
                            onChange={e => onChange({ value: e.target.value, isUnit: false })} />
                    </Col>
                    <Col>
                        <Form.Control
                            value={value.unit}
                            size="md"
                            type="text"
                            placeholder={'Add unit (ex: people)'}
                            onChange={e => onChange({ value: e.target.value, isUnit: true })} />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

const RecipeImages = () => {
    return (
        <Row style={{ marginBottom: '10px' }}>
            <Form.Label column="lg" lg={2}>{"Add Images"}</Form.Label>
            <Col>
                <Form.Control type="file" multiple />
            </Col>
        </Row>
    )
}

const RecipeIngredients = ({
    ingredients,
    ingredientRefs,
    onSectionNameChange,
    onIngredientChange,
    onIngredientRemove,
    onIngredientAdd,
    addBulkIngredients,
    showInputForFirstSection,
    onRemoveIngredientSection,
    onAddSection }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleSave = (sectionIdx, text) => {
        addBulkIngredients({ sectionIdx, text });
        handleClose();
    }
    const handleShow = () => setShow(true);

    return (
        <Row style={{ marginBottom: '10px' }}>
            <Form.Label column="lg" lg={2}>{"Ingredients"}</Form.Label>
            <Col style={{ marginTop: 10 }}>
                {ingredients.map(({ sectionName, items }, sectionIdx) => {
                    const showSectionInput = ingredients.length === 1 ? showInputForFirstSection : true;
                    return (
                        <SectionWrapper
                            key={`ingredients-${sectionIdx}`}
                            sectionInputRef={el => (ingredientRefs.current[sectionIdx] = { ...ingredientRefs.current[sectionIdx], section: el })}
                            isIngredientSection
                            sectionIdx={sectionIdx}
                            numSections={ingredients.length}
                            showSectionInput={showSectionInput}
                            value={sectionName}
                            onRemoveSection={onRemoveIngredientSection}
                            onChange={e => onSectionNameChange(({ sectionIdx, text: e.target.value }))}
                        >
                            {items.map((item, ingredientIdx) => {
                                return (
                                    <RecipeIngredientInput
                                        key={`${sectionIdx}-${ingredientIdx}`}
                                        customRef={el => (ingredientRefs.current[sectionIdx] = { ...ingredientRefs.current[sectionIdx], item: el })}
                                        text={item}
                                        value={item}
                                        isFirstAndOnly={items.length === 1}
                                        onChange={e => onIngredientChange({ sectionIdx, ingredientIdx, text: e.target.value })}
                                        onRemove={e => onIngredientRemove({ sectionIdx, ingredientIdx })} />
                                )
                            })}
                            <Dropdown>
                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                    <IoAddOutline />
                                    Add
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => onIngredientAdd({ sectionIdx })}>Add Ingredient</Dropdown.Item>
                                    <Dropdown.Item onClick={handleShow}>Bulk Add Ingredients</Dropdown.Item>
                                    <Dropdown.Item onClick={onAddSection} >Add Section</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <BulkAddIngredientsModal sectionIdx={sectionIdx} show={show} handleClose={handleClose} handleSave={handleSave} />
                        </SectionWrapper>
                    )
                })}
            </Col>
        </Row>
    )
}


const RecipeIngredientInput = ({ value, onChange, onRemove, isFirstAndOnly, customRef }) => {
    return (
        <Row style={{ marginBottom: '10px' }}>
            <InputGroup>
                <Form.Control ref={customRef} type="text" value={value} onChange={onChange} placeholder="Add Ingredient" />
                {!isFirstAndOnly && (
                    <Button variant="outline-secondary" id="button-addon2" onClick={onRemove}>
                        <IoRemoveCircleOutline />
                    </Button>
                )}
            </InputGroup>
        </Row>
    )
}

const RecipeSteps = ({ steps, stepRefs, onStepSectionNameChange, onStepTextChange, onAddSection, showInputForFirstStepSection, onRemoveStepSection }) => {
    return (
        <Row style={{ marginBottom: '10px' }}>
            <Form.Label column="lg" lg={2}>{"Instructions"}</Form.Label>
            <Col>
                {steps.map(({ sectionName, text }, sectionIdx) => {
                    const showSectionInput = steps.length === 1 ? showInputForFirstStepSection : true;

                    return (
                        <SectionWrapper
                            key={sectionIdx}
                            sectionIdx={sectionIdx}
                            sectionInputRef={el => (stepRefs.current[sectionIdx] = { ...stepRefs.current[sectionIdx], section: el })}
                            numSections={steps.length}
                            showSectionInput={showSectionInput}
                            onRemoveSection={onRemoveStepSection}
                            value={sectionName}
                            onChange={e => onStepSectionNameChange({ sectionIdx, text: e.target.value })}>
                            <Row style={{ marginBottom: '10px' }}>
                                <AutosizingTextArea
                                    onChange={(newText) => onStepTextChange({ sectionIdx, text: newText })}
                                    placeholder={'Add Instruction'}
                                    value={text} />
                            </Row>
                        </SectionWrapper>
                    )
                })}
                <Button
                    variant="secondary"
                    onClick={onAddSection}
                >
                    <IoAddOutline />
                    Add Section
                </Button>
            </Col>
        </Row>
    )
}


let SectionWrapper = ({ children, showSectionInput, onChange, value, sectionIdx, numSections, onRemoveSection, isIngredientSection, sectionInputRef }) => {
    const ingredientsOrInstructionText = isIngredientSection ? 'ingredients' : 'instruction';
    const shouldShow = (value || showSectionInput);

    return (
        <div style={{ marginBottom: 20 }}>
            <Row style={{ display: shouldShow ? '' : 'none' }}>
                <InputGroup style={{ marginBottom: 10 }}>
                    <Form.Control ref={sectionInputRef} type="text" value={value} size="lg" onChange={onChange} placeholder="Add Section" />
                    <DropdownButton
                        title=""
                        variant="outline-secondary"
                        id="input-group-dropdown-2"
                        align="end"
                    >
                        {sectionIdx === 0 && numSections === 1 && <Dropdown.Item onClick={() => onRemoveSection({ sectionIdx, preserveChildren: true })}>Remove section but keep {ingredientsOrInstructionText}</Dropdown.Item>}
                        {numSections > 1 && <Dropdown.Item onClick={() => onRemoveSection({ sectionIdx, preserveChildren: false })}>Remove section and {ingredientsOrInstructionText}</Dropdown.Item>}
                    </DropdownButton>
                </InputGroup>
            </Row>
            <div style={{ marginLeft: shouldShow ? 40 : 0 }}>
                {children}
            </div>
        </div>

    )
}

const CusineType = ({ id, type, options, onSelect }) => {
    return (
        <OptionsSelect id={id} type={type} options={options} formLabel={'Cuisine'} optionPlaceholder={'Select a Cusine'} onSelect={onSelect} />
    )
}

const CourseType = ({ id, options, onSelect, type }) => {
    return (
        <OptionsSelect id={id} type={type} options={options} formLabel={'Course'} optionPlaceholder={'Select a Course Type'} onSelect={onSelect} />
    )
}

const CategoryType = ({ id, options, onSelect, type }) => {
    return (
        <OptionsSelect id={id} type={type} options={options} formLabel={'Category'} optionPlaceholder={'Select a Category'} onSelect={onSelect} />
    )
}

const OptionsSelect = ({ type, options, formLabel, optionPlaceholder, onSelect, id }) => {
    const existingOption = options?.find(t => t.id === id);
    const label = existingOption?.text || optionPlaceholder;    

    const handleSelect = (tagIdAsString) => {
        onSelect(({ type, tagId: parseInt(tagIdAsString) }));
    }

    return (
        <Row style={{ marginBottom: '10px' }}>
            <Form.Label column="lg" lg={2}>{formLabel}</Form.Label>
            <Col>
                <SearchDropdown drop={'end'} dropdownLabel={label} items={options} onSelect={handleSelect} selectedKey={existingOption?.id?.toString()} />
            </Col>
        </Row>
    )
}
