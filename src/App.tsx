import React, { useState, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

function App() {
  // React Hooks
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

  type Todo = {
    inputValue: string;
    id: string;
    checked: boolean;
  };

  useEffect(() => {
    //Load todos from localStorage
    const storedTodos = localStorage.getItem('storedTodos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // update local storage
  const updateLocalStorage = (newTodo: React.SetStateAction<{ inputValue: string; id: string; checked: boolean; }[]>) => {
    setTodos(newTodo);
    localStorage.setItem('storedTodos', JSON.stringify(newTodo));
  }

  // event handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.value);
    // console.log('change');
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(inputValue);

    if (!inputValue) return;

    // Add new todo to the list
    const newTodo: Todo = {
      inputValue: inputValue,
      id: uuidv4(), // generate a unique id for each todo
      checked: false,
    };

    setTodos([newTodo, ...todos]);
    updateLocalStorage([newTodo, ...todos]);
    setInputValue('');
  };

  const handleEdit = (id: string, inputValue: string) => {
    // change the input value of the todo copied from the original todo
    // protect the original todo from being mutated

    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.inputValue = inputValue;
      }
      return todo;
    });

    setTodos(newTodos);
    updateLocalStorage(newTodos);
  };

  const handleChecked = (id: string, checked: boolean) => {
    // console.log('checked');
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.checked = !checked;
      }
      return todo;
    });

    setTodos(newTodos);
    updateLocalStorage(newTodos);
  };

  const handleDelete = (id: string) => {
    // console.log('delete');
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    updateLocalStorage(newTodos);
  }

  const handleClear = () => {
    const newTodos = todos.filter((todo) => !todo.checked);
    setTodos(newTodos);
    updateLocalStorage(newTodos);
  }

  return (
    <div className="App">
      <section>
        <h1>Simple Todo List</h1>
        <h4>with React & Typescript</h4>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input 
            type="text" 
            placeholder="Add a new task"
            value={inputValue}
            onChange={(e) => handleChange(e)} 
            className='inputText'
          />
          <button type="submit" className='submitButton'>
            <i className="fa-solid fa-plus"></i>
            <span>ADD</span>
          </button>
        </form>

        <section className='taskRemain'>
          <div className='taskNum'>Remaining Tasks: {todos.filter((todo) => !todo.checked).length}</div>
          <button onClick={handleClear} className='delete-btn'>Delete Checked Tasks</button>
        </section>

        <ul className='todoList'>
          {todos.map((todo) => (
            <li key={todo.id}>
              <input 
                type="text"
                onChange={(e) => handleEdit(todo.id, e.target.value)} 
                value={todo.inputValue}
                disabled={todo.checked ? true : false}
                className='inputText'
              />
              <button className={`checkbox ${todo.checked ? 'checked' : ''}`} onClick={() => handleChecked(todo.id, todo.checked)}><i className="fa-solid fa-square-check"></i></button>
              <button className='delete-btn' onClick={() => handleDelete(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
