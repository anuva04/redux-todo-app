import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
