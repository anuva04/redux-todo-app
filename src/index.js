import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {createStore} from 'redux';
// var redux = require('react-redux');


// todo reducer for carrying out an action for a single todo
const todo = (state, action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {id: action.id, text: action.text, comleted: false}
      ];
    case 'TOGGLE_TODO':
      if(state.id !== action.id) return state;
        return {
          ...state,
          completed: !state.completed
      };
    default:
      return state;
  }
}

// todos reducer for carrying out an action on entire todo list
const todos = (state = [], action) => {
  // 2 actions for adding and toggling todos
  // state shouldn't be mutated directly
  switch (action.type){
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

// reducer for changing visibility of todos
// default state is SHOW_ALL
const visibilityFilter = (state='SHOW_ALL', action) => {
  switch(action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

const todoApp = (state = {}, action) => {
  return {
    todos: todos(state.todos, action),
    visibilityFilter : visibilityFilter(state.visibilityFilter, action)
  };
};

const store = createStore(todoApp);

class TodoApp extends React.Component {
  render() {
    return (
      <div>
        <button>
          Add Todo
        </button>
      </div>
    )
  }
}

const render = () => {
  ReactDOM.render(
    <React.StrictMode>
      <TodoApp />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

render();
