import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {createStore} from 'redux';
import {combineReducers} from 'redux';
// var redux = require('react-redux');


// todo reducer for carrying out an action for a single todo
const todo = (state, action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return {
        id: action.id, 
        text: action.text, 
        completed: false
      }
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

// const todoApp = (state = {}, action) => {
//   return {
//     todos: todos(state.todos, action),
//     visibilityFilter : visibilityFilter(state.visibilityFilter, action)
//   };
// };

// creating todoApp component with combineReducers
const todoApp = combineReducers({
  //state field: reducer to be called
  // todos: todos,
  // visibilityFilter: visibilityFilter

  // ES6 object literal shorthand notation
  todos, 
  visibilityFilter
});

const store = createStore(todoApp);

let nextTodoID = 0;
class TodoApp extends React.Component {
  render() {
    return (
      <div>
        {/* for taking input from user */}
        <input ref={node => {
          this.input = node;
        }} />
        {/* always dispatches ADD_TODO action */}
        <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoID++
          });
          this.input.value = '';
        }}>
          Add Todo
        </button>
        <ul>
          {this.props.todos.map(todo =>
          // each <li> should have a unique key for react to be able to uniquely identify it
            <li key={todo.id}
                onClick={() => {
                  store.dispatch({type: 'TOGGLE_TODO', id: todo.id});
                }} 
                // double curly braces because we are adding a JS logical expression
                style={{ textDecoration: todo.completed ? 'line-through' : 'none' }} >
              {todo.text}
            </li>  
          )}
        </ul>
      </div>
    );
  }
}

const render = () => {
  ReactDOM.render(
    <React.StrictMode>
      <TodoApp todos={store.getState().todos}/>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

store.subscribe(render);
render();
