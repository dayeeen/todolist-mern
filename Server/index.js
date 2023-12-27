const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./Models/Todo');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/todolist')

app.get('/get', (req, res) => {
    TodoModel.find()
    .then((result) => res.json(result))
    .catch((err) => res.status(400).json('Error: ' + err));
})

app.put('/update/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const todo = await TodoModel.findById(id);

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        todo.done = !todo.done; // Toggle the 'done' property
        const updatedTodo = await todo.save();

        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ error: 'Error updating todo: ' + err.message });
    }
});

app.post('/add', async (req, res) => {
    const { task, priority, category, location, estimatedTime, dueDate, notes } = req.body;

    try {
        const result = await TodoModel.create({
            task: task,
            priority: priority,
            category: category,
            location: location,
            estimatedTime: estimatedTime,
            dueDate: dueDate,
            notes: notes,
        });

        res.json(result);
    } catch (err) {
        res.status(400).json({ error: 'Error creating todo: ' + err.message });
    }
});

app.delete('/delete/:id', (req, res) => {
    const {id} = req.params;
    TodoModel.findByIdAndDelete(id)
    .then(result => res.json(result))
    .catch(err => res.status(400).json('Error deleting todo: ' + err.message));
});

app.listen(3001, () => {
    console.log('Server is running...');
});
