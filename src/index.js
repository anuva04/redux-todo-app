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

const FilterLink = ({filter, children, currentFilter, onClick}) => {
  // the visibility filter that is clicked is shown as a span instead of link, so that is can be rendered unclickable
  if(filter === currentFilter){
    return <span>{children}</span>;
  }

  return (
    <a href='#'
      onClick = {e => {
        e.preventDefault();
        onClick(filter);
      }}
    >
      {children}
    </a>
  );
}

// component for visibility filter buttons
const Footer = ({visibilityFilter, onFilterClick}) => (
  // buttons for setting visibility filter
  <p>
  {/* for adding space, use {' '} */}
    Show: {' '}
    <FilterLink filter='SHOW_ALL' currentFilter={visibilityFilter} onClick={onFilterClick}> All </FilterLink> {' '}
    <FilterLink filter='SHOW_ACTIVE' currentFilter={visibilityFilter} onClick={onFilterClick}> Active </FilterLink> {' '}
    <FilterLink filter='SHOW_COMPLETED' currentFilter={visibilityFilter} onClick={onFilterClick}> Completed </FilterLink>
  </p>
)

// separate component for each Todo
// making onClick handler a prop so that programmer can specify what to be done on clicking, instead of hardcoding TOGGLE_TODO
const Todo = ({onClick, completed, text}) => (
  <li onClick={onClick} 
      // double curly braces because we are adding a JS logical expression
      style={{ textDecoration: completed ? 'line-through' : 'none' }} >
    {text}
  </li>
);

// TodoList component for holding all Todo components
const TodoList = ({todos, onTodoClick}) => (
  <ul>
    {todos.map(todo =>
      <Todo 
        // each <li> should have a unique key for react to be able to uniquely identify it
        key={todo.id} 
        // spread over other props of todo
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
);

// separate component for add-todo button
const Addtodo = ({onAddClick}) => {
  let input;
  return (
    <div>
      {/* for taking input from user */}
      <input ref={node => {
        input = node;
      }} />
      {/* always dispatches ADD_TODO action */}
      <button onClick={() => {
        onAddClick(input.value)
        input.value = '';
      }}>
        Add Todo
      </button>
    </div>
  );
}

// method for setting visibility filter
const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed);
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed);
  }
}

let nextTodoID = 0;
// The main TodoApp component which holds all other components
const TodoApp = ({todos, visibilityFilter}) => (
  <div>
    <Addtodo 
      onAddClick={text => store.dispatch({
        type: 'ADD_TODO',
        id: nextTodoID++,
        text
      })}
    />
    {/* top level TodoList component which consists of each Todo component defined above */}
    <TodoList 
      todos={getVisibleTodos(todos, visibilityFilter)}
      onTodoClick={id => store.dispatch({type: 'TOGGLE_TODO', id})} 
    />
    <Footer 
      visibilityFilter={visibilityFilter}
      onFilterClick={filter => store.dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter
      })}
    />
  </div>
);

const render = () => {
  ReactDOM.render(
    <React.StrictMode>
      <TodoApp {...store.getState()}/>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

store.subscribe(render);
render();
