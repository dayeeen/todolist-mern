import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BsFillCheckCircleFill, BsCircleFill, BsFillTrashFill } from 'react-icons/bs';
import './App.css';

function Create({ onTaskAdded }) {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('low');
  const [category, setCategory] = useState('personal');
  const [location, setLocation] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [notes, setNotes] = useState('');
  const [tasks, setTasks] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3001/get');
      setTasks(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [onTaskAdded]); // Tambahkan onTaskAdded ke dalam dependency array
  

  const handleAdd = async () => {
    try {
      // Persiapkan data untuk tugas baru
      const newTaskData = {
        task: task,
        priority: priority,
        category: category,
        location: location,
        estimatedTime: estimatedTime,
        dueDate: dueDate,
        notes: notes,
      };
  
      // Tambahkan tugas baru ke dalam daftar secara lokal
      setTasks((prevTasks) => [...prevTasks, newTaskData]);
  
      // Kirim permintaan ke server untuk menambahkan tugas
      const response = await axios.post('http://127.0.0.1:3001/add', newTaskData);
      
      // Dapatkan data tugas baru dari respons server
      const newTask = response.data;
  
      // Trigger callback untuk mengupdate state di komponen induk
      onTaskAdded(newTask);
  
      // Bersihkan input fields
      setTask('');
      setPriority('low');
      setCategory('personal');
      setLocation('');
      setEstimatedTime(null);
      setDueDate(null);
      setNotes('');
    } catch (err) {
      console.log(err);
  
      // Jika terjadi kesalahan, kembalikan daftar tugas ke kondisi sebelumnya
      setTasks((prevTasks) => prevTasks.slice(0, -1));
    }
  };
  

  const handleEdit = async (id) => {
    try {
      // Set status lokal terlebih dahulu
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, done: !task.done } : task
        )
      );
  
      // Kemudian, kirim permintaan ke server untuk memperbarui status
      await axios.put(`http://127.0.0.1:3001/update/${id}`);
    } catch (err) {
      console.log(err);
      // Jika terjadi kesalahan, kembalikan status seperti semula
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, done: !task.done } : task
        )
      );
    }
  };
  

  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:3001/delete/${id}`)
      .then(result => {
        setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
      })
      .catch(err => console.log(err));
  };


  // Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Fungsi untuk memformat waktu
  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  return (
    <div className='create_form'>
      <label>
        Task Name:
        <input
          type="text"
          placeholder='Enter Task'
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
      </label>

      <label>
        Priority:
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>

      <label>
        Category:
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="shopping">Shopping</option>
        </select>
      </label>

      <label>
        Location:
        <input
          type="text"
          placeholder='Enter Location'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </label>

      <label>
        Estimated Time:
        <DatePicker
          selected={estimatedTime}
          onChange={(date) => setEstimatedTime(date)}
          placeholderText='Select Estimated Time'
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
        />
      </label>

      {/* Tambahkan field Due Date */}
      <label>
        Due Date:
        <DatePicker
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          placeholderText='Select Due Date'
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
        />
      </label>

      {/* Tambahkan field Notes */}
      <label>
        Notes:
        <textarea
          placeholder='Enter Notes'
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>

      <button type="button" onClick={handleAdd}>Add</button>

      {/* Display the task list */}
        {tasks.length === 0 ? (
        <div>
            <h2>No Records</h2>
        </div>
        ) : (
            <div>
            <h2>Task List</h2>
            {tasks.map((todo) => (
              <div key={todo._id} className="task">
                <div className="checkbox">
                  {todo.done ? (
                    <BsFillCheckCircleFill className="icon" onClick={() => handleEdit(todo._id)} />
                  ) : (
                    <BsCircleFill className="icon" onClick={() => handleEdit(todo._id)} />
                  )}
                </div>
                <div className="task-details">
                    <p className={todo.done ? "line_through" : ""}>Task: {todo.task}</p>
                    <p className={todo.done ? "line_through" : ""}>Priority: {todo.priority}</p>
                    <p className={todo.done ? "line_through" : ""}>Category: {todo.category}</p>
                    <p className={todo.done ? "line_through" : ""}>Location: {todo.location}</p>
                    <p className={todo.done ? "line_through" : ""}>Estimated Time: {todo.estimatedTime && formatTime(todo.estimatedTime)}</p>
                    <p className={todo.done ? "line_through" : ""}>Due Date: {todo.dueDate && formatDate(todo.dueDate)}</p>
                    <p className={todo.done ? "line_through" : ""}>Notes: {todo.notes}</p>
                </div>
                <div className="delete">
                  <span>
                    <BsFillTrashFill className="icon" onClick={() => handleDelete(todo._id)} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default Create;
