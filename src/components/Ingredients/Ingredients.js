import React, { useCallback, useReducer, useMemo, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList'
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredient, action) => {
  switch (action.type){
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredient, action.ingredient];
    case 'DELETE':
      return currentIngredient.filter(ing => ing.id !== action.id)
    default:
      throw new Error('Should not get there!')
  }
}


const Ingredients = () => {

  const [userIngredient, dispatch] = useReducer(ingredientReducer,[])
  const {isLoading, error, data, sendRequest} = useHttp()

  useEffect(()=>{
    dispatch({type:'DELETE'})
  },[data])

  const filteredIngredientsHandler = useCallback((filteredIngredients) =>{
    //setIngredients(filteredIngredients)
    dispatch({ type: 'SET', ingredients: filteredIngredients})
  },[])

  const addIngredientHandler = useCallback(ingredient => {
    //setIsLoading(true);
    // dispatchHttp({type: 'SEND'})
    // fetch('https://react-test-samples-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json',{
    //   method: 'POST',
    //   body: JSON.stringify({ingredient}),
    //   headers: {
    //       'Content-Type' : 'application/json'
    //   }
    // }).then(response => {
    //     //setIsLoading(false)
    //     dispatchHttp({type:'RESPONSE'})
    //     return response.json()
    // }).then(responseData => {
    //   dispatch({type: 'ADD', ingredient: {
    //       id: responseData.name,
    //       ...ingredient
    //     }
    //   })
    // })
  },[])

  const removeIngredientHandler = useCallback(ingredientId => {
    sendRequest(`https://react-test-samples-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients/${ingredientId}.json`, 'DELETE')
  },[sendRequest])

  const clearErrorHandler = useCallback(() => {
    /* setError(null)
    setIsLoading(false) */
    //dispatchHttp({type: 'CLEAR'})
  },[])

  const ingredientList = useMemo(()=> {
    return <IngredientList 
              ingredients={userIngredient} 
              onRemoveItem={removeIngredientHandler} 
            />
  },[userIngredient, removeIngredientHandler])

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearErrorHandler}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
