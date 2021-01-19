import React, { useState, useEffect } from "react";
import './App.css';
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min.js";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [taskEditing, setTaskEditing] = useState(null);

  //**local storage
  // useEffect(() => {
  //   const temp = localStorage.getItem("todo");
  //   const localTasks = JSON.parse(temp);
  //   if (localTasks) {
  //     setTodos(localTasks);
  //   }
  // }, []);

  // useEffect(() => {
  //   const temp = JSON.stringify(todos);
  //   localStorage.setItem("todo", temp);
  // }, [todos]);

  //**get all todos
  const getAllTodos = async () => {
    const res = await fetch("http://localhost:5000/todos/");
    const todos = await res.json();
    setTodos(todos);
  };

  useEffect(() => {
    getAllTodos();
  }, [todo]);

  //** Edit task 
  useEffect(() => {
    if (taskEditing) {
      setTodo(taskEditing.text);
    } else {
      setTodo("");
    }
  }, [taskEditing]);

  //**  Add tasks
  const createTasks = (todo) => {
    const newTodo = {
      text: todo, id: uuidv4(), completed: false
    };

    axios.post('http://localhost:5000/todos/add', newTodo)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));

    setTodos([...todos, newTodo]);
  };

  //**create task
  const createTodo = (e) => {
    e.preventDefault();
    if (!taskEditing) {
      createTasks(todo);
      setTodo("");
    } else {
      editTask(todo, taskEditing._id);
    }
  };

  // Edit task
  const editTask = (todo, id) => {
    const updatedTodo = { text: todo, _id: id };
    setTodo(updatedTodo);

    const updatedTasks = todos.map(task => (task._id === id ? { text: todo.text, id: id } : task));
    setTodos(updatedTasks);

    axios.post(`http://localhost:5000/todos/update/${id}`, updatedTodo)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));

    setTaskEditing(null);
  };

  //** Remove tasks 
  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo._id !== id);
    setTodos(updatedTodos);

    axios.delete(`http://localhost:5000/todos/${id}`)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  };

  //** Find task
  const findItem = (id) => {
    const item = todos.find(task => task._id === id);
    setTaskEditing(item);
  };

  //** Toggle Complete
  const updateTodo = (id) => {
    const item = todos.find(task => task._id === id);
    const updatedTasks = [...todos].map((task) => {
      if (task._id === id) {
        task.completed = !task.completed;
      }
      return task;
    });
    setTodos(updatedTasks);

    axios.post(`http://localhost:5000/todos/update/${id}`, item)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  };

  return (

    <div className="container lime lighten-5">
      <h1 className="center-align">Todo List</h1>
      <div>
        <form onSubmit={createTodo} className="row">
          <div className="input-field inline col s12">
            <input
              type="text"
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
              placeholder="Enter your todo ..."
              required
              className="validate col s10"
            />
            <button type="submit" className="waves-effect waves-light btn col s2">
              {taskEditing ? 'Edit' : (<i className="material-icons">add_box</i>)}
            </button>
          </div>
        </form>
      </div>

      {todos.map((task) => <div key={task._id} className="row">

        <div className="col s8 ">
          <label >
            <input
              type="checkbox"
              onChange={() => updateTodo(task._id)}
              checked={task.completed}
              className="filled-in"
            />
            <span>
              <div className={`col s8 ${task.completed ? "completed" : ''}`}>{task.text}</div>
            </span>
          </label>
        </div>
        {/* delete btn */}
        <button className="waves-effect waves-light btn-small"
          onClick={() => deleteTodo(task._id)}>
          <i className="material-icons">delete_forever</i>
        </button>
        {/* edit btn */}
        <button className="waves-effect waves-light btn-small"
          onClick={() => findItem(task._id)}>
          <i className="material-icons">mode_edit</i>
        </button>
      </div>
      )
      }

    </div>
  );
}

export default App;
