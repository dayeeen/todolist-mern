const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    done: {
        type: Boolean,
        default: false,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low',
    },
    category: {
        type: String,
        enum: ['work', 'personal', 'shopping'],
        default: 'personal',
    },
    location: {
        type: String,
    },
    estimatedTime: {
        type: Date,
    },
    dueDate: {
        type: Date,
    },
    notes: {
        type: String,
    },
});

const TodoModel = mongoose.model('tasks', TodoSchema);
module.exports = TodoModel;
