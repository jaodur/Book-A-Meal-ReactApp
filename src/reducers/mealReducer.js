import * as actionTypes from '../actions/ActionTypes';
import initialState from './initialState';

export default function mealReducer(state=initialState.meals, action) {
  switch(action.type){
    case actionTypes.LOAD_MEALS_SUCCESS:
      return action.data;

    case actionTypes.POINT_MEAL_SUCCESS:
      return state;

    default:
      return state;
  }
}
