const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    title:        { type: String, required: true },
    type:         { type: [], required: true },
    ingredients:  { type: [], required: true },
    instructions: { type: String, required: true },
    imagePath:    {type: String, required: false}
});

module.exports = mongoose.model('Recipe', recipeSchema);