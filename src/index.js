import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const todos = (state = [], action) => {
  switch (action.type){
    case 'ADD_TODO':
      return [
        ...state,
        {id: action.id, text: action.text, comleted: false}
      ];
    case 'TOGGLE_TODO':
      return state.map(todo => {
        if(todo.id !== action.id) return todo;
        return {
          ...todo,
          completed: !todo.completed
        };
      });
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
