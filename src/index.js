// for real-world apps, you might want to supply different stores for different requests
// the previous structure we had doesn't scale well for this use case
// if every component has to rely on a top-level component for store, it will create problems is that top-level component is removed


import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import './index.css';
import {combineReducers} from 'redux';
// from react version 15 and above PropTypes has been moved to a separate module
import PropTypes from 'prop-types';
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

// component for a single visibility filter
const Link = ({active, children, onClick}) => {
  // the visibility filter that is clicked is shown as a span instead of link, so that is can be rendered unclickable
  if(active){
    return <span>{children}</span>;
  }

  return (
    <a href='#'
      onClick = {e => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
}

class FilterLink extends React.Component {
  // this component subscribes to the store explicitly and calls forceUpdate any time the state is changed
  // otherwise if the parent is not updated, the component will return stale value
  componentDidMount(){
    const {store} = this.context;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }
  componentWillUnmount(){
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const {store} = this.context;
    const state = store.getState();

    return (
      <Link 
        active={props.filter === state.visibilityFilter}
        onClick={() => store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter: props.filter
        })}
      >
        {props.children}
      </Link>
    );
  }
}
FilterLink.contextTypes = {
  store: PropTypes.object
};

// component for visibility filter buttons
const Footer = () => (
  // buttons for setting visibility filter
  <p>
  {/* for adding space, use {' '} */}
    Show: {' '}
    <FilterLink filter='SHOW_ALL'> All </FilterLink> {' || '}
    <FilterLink filter='SHOW_ACTIVE'> Active </FilterLink> {' || '}
    <FilterLink filter='SHOW_COMPLETED'> Completed </FilterLink>
  </p>
)

// separate component for each Todo
// making onClick handler a prop so that programmer can specify what is to be done on clicking, instead of hardcoding TOGGLE_TODO
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

// global variable for individual todo unique ID
let nextTodoID = 0;

// function for extracting action creator so that multiple components can use ADD_TODO action and get hold of nextTodoID
const addTodo = (text) => {
  return {
    type: 'ADD_TODO',
    id: nextTodoID++,
    text
  };
};

// separate component for add-todo button
// functional components receive context as a second argument after props
// we are destructuring store from context
const Addtodo = (props, {store}) => {
  let input;
  return (
    <div>
      {/* for taking input from user */}
      <input ref={node => {
        input = node;
      }} />
      {/* always dispatches ADD_TODO action */}
      <button onClick={() => {
        store.dispatch(addTodo(input.value));
        input.value = '';
      }}>
        Add Todo
      </button>
    </div>
  );
}
Addtodo.contextTypes = {
  store: PropTypes.object
};

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

// uses getVisibleTodos to generate which todos to render visible
class VisibleTodoList extends React.Component {
  componentDidMount(){
    const {store} = this.context;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }
  componentWillUnmount(){
    this.unsubscribe();
  }

  render(){
    const props = this.context;
    const {store} = props;
    const state = store.getState();

    return (
      <TodoList
        todos={getVisibleTodos(state.todos, state.visibilityFilter)}
        onTodoClick={id => store.dispatch({
          type: 'TOGGLE_TODO',
          id
        })}
      />
    );
  }
}
VisibleTodoList.contextTypes = {
  store: PropTypes.object
};

// The main TodoApp component which holds all other components
const TodoApp = () => (
  <div>
    {/* Every component needs the store
    Not a good approach */}
    <Addtodo/>
    <VisibleTodoList/>
    <Footer/>
  </div>
);

// Advanced react concept called Context
// Provider just renders its child components
// So we can wrap any component in Provider to render it
// Any component inside Provider will receive the Context object with the Store inside it
class Provider extends React.Component {
  getChildContext() {
    return {
      store: this.props.store
    };
  }
  render(){
    return this.props.children;
  }
}
// to turn on Context for Provider
Provider.childContextTypes = {
  store: PropTypes.object
};

// calling React DOM
// now each component subscribes to the store themselves
ReactDOM.render(
  <React.StrictMode>
    {/* Provider component will make store available to any children and grandchildren */}
    <Provider store = {createStore(todoApp)}>
      {/* injecting store directly into the component */}
      <TodoApp/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);