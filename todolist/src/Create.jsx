import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS DatePicker

function Create({ onTaskAdded }) {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('low');
  const [category, setCategory] = useState('personal');
  const [location, setLocation] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(null); // Ganti ke null untuk kalender

  const handleAdd = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:3001/add', {
        task: task,
        priority: priority,
        category: category,
        location: location,
        estimatedTime: estimatedTime,
      });
      const newTask = response.data;

      // Trigger the callback to update the parent component's state
      onTaskAdded(newTask);

      // Clear the input fields
      setTask('');
      setPriority('low');
      setCategory('personal');
      setLocation('');
      setEstimatedTime(null); // Ganti ke null untuk kalender
    } catch (err) {
      console.log(err);
    }
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

  <button type="button" onClick={handleAdd}>Add</button>
</div>

  );
}

export default Create;
