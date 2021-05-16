import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
