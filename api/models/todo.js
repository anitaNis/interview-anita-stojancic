const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    text: { type: String, required: true, trim: true, minlength: 3 },
    completed: { type: Boolean, default: false },

}, {
    // timestamps: true,
});

const Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;