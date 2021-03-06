import { useReducer, useCallback } from "react";

const httpReducer = (curHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return { loading: true, error: null, data: null };
        case 'RESPONSE':
            return { ...curHttpState, loading: false, data: action.responseData };
        case 'ERROR':
            return { loading: false, error: action.errorData };
        case 'CLEAR':
            return { ...curHttpState, error: null }
        default:
            throw new Error('Should not get there!')
    }
}

const useHttp = () => {
    const [httpState,dispatchHttp] = useReducer(httpReducer,{
        loading: false, 
        error: null,
        data: null
    })

    const sendRequest = useCallback((url, method, body) => {
        //`https://react-test-samples-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients/${ingredientId}.json`
        dispatchHttp({type: 'SEND'})
        fetch(url,{
          method: method,
          body: body,
          headers: {
              'Content-Type' : ' application/json'
          }
        }).then(response =>{
            return response
        }).then(responseData => {
            dispatchHttp({type: 'RESPONSE', responseData: responseData})
        }).catch(err =>{
          //setError('Something went wrong!')
          dispatchHttp({type:'ERROR', errorData: 'Something went wrong!'})
        })
    },[])

    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest: sendRequest
    };

}

export default useHttp;