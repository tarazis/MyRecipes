const express = require('express');
const bodyParser = require("body-parser");
const multer = require('multer');
const path = require("path");

const app = express();
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');

mongoose.connect("mongodb+srv://Sami:sJWlvIfsPdP3XOzi@cluster0-yxhgp.mongodb.net/recipe-db?retryWrites=true&w=majority")
.then(() => {
    console.log("connected!");
})
.catch(() => {
    console.log("failed.....");
}); 

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid file type!');
        if (isValid) {
            error = null;
        }

        cb(error, "images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + "-" + Date.now() + '.' + ext);
    }
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

    next();
});

app.use("/images", express.static(path.join("images")));
app.use("/api/recipies", (req, res, next) => {
    console.log('getting...');
    Recipe.find()
        .then((recipies) => {
            console.log(recipies);
            res.status(200).json({
                message: "All recipies!!!",
                recipies: recipies
            });
        });
});

app.get("/api/get-recipe/:id", (req, res, next) => {
    Recipe.findById(req.params.id)
    .then((result) => {
        res.status(200).json({
            message: 'Recipe fetched!',
            recipe: result
        });
    });
});

app.put("/api/update-recipe/:id", multer({storage: storage}).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    console.log(req.body._id);
    console.log(req.file);
    var recipe = null;
    if (req.file) {
        recipe = new Recipe({
            _id: req.body._id,
            title: req.body.title,
            type: JSON.parse(req.body.type),
            ingredients: JSON.parse(req.body.ingredients),
            instructions: req.body.instructions,
            imagePath: url + "/images/" + req.file.filename
        });
    } else {
        recipe = new Recipe({
            _id: req.body._id,
            title: req.body.title,
            type: JSON.parse(req.body.type),
            ingredients: JSON.parse(req.body.ingredients),
            instructions: req.body.instructions,
            imagePath: req.body.image
        });
    }


    console.log(recipe);
    
    Recipe.updateOne({_id: req.params.id}, recipe)
        .then(result => {
            res.status(200).json({
                message: 'Recipe updated successfully'
            });
        });
});

app.delete("/api/delete-recipe/:id", (req, res, next) => {
    Recipe.deleteOne({_id: req.params.id})
        .then((result) => {
            res.status(200).json({
                message: 'Recipe deleted successfuly!',
            });

        });
});

app.post("/api/save-recipe", multer({storage: storage}).single("image"), (req, res, next) => {
    console.log("saving...");
    const url = req.protocol + '://' + req.get("host");
    const recipe = new Recipe({
        title: req.body.title,
        type: JSON.parse(req.body.type),
        ingredients: JSON.parse(req.body.ingredients),
        instructions: req.body.instructions,
        imagePath: url + "/images/" + req.file.filename
    });

    console.log(recipe);


    recipe.save().then(recipe => {
        res.status(200).json({
            recipeID: recipe._id,
            message: 'Recipe added successfully!!'
        });
    });
});

app.post("/api/specific-recipes", (req, res, next) => {
    const type = [req.body.type];
    const ingredients = req.body.ingredients;
    console.log("Trying to match type: ", type);
    console.log("Trying to match ingredients: ", ingredients);

    Recipe.find({
        type: { $all: type},
        ingredients: { $all: ingredients }
    })
        .then((recipies) => {
            console.log(recipies);
            res.status(200).json({
                message: 'Specific recipies fetched!',
                recipies: recipies
            });

        });
});


module.exports = app;