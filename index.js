import "dotenv/config";
import express from "express";
import fs from "fs/promises";

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";
const DB_FILE = process.env.DB_FILE || "recipes_db.json";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let recipesCache = null;

async function getRecipes() {
    if (!recipesCache) {
        const data = await fs.readFile(DB_FILE);
        recipesCache = JSON.parse(data);
        console.log("Recipes loaded from disk");
    }
    return recipesCache;
}

app.get("/recipes", async (req, res) => {
    const recipes = await getRecipes();
    res.json({ message: "List of recipes", data: recipes });
});

app.get("/recipes/:id", async (req, res) => {
    const { id } = req.params;
    const recipes = await getRecipes();
    const recipe = recipes.find(r => r.idMeal === id);
    if (recipe) {
        res.json({ message: `Details of recipe ${id}`, data: recipe });
    } else {
        res.status(404).json({ message: "Recipe not found" });
    }
});

app.get("/random-recipe", async (req, res) => {
    const { area, category } = req.query;
    let recipes = await getRecipes();

    if (area)       recipes = recipes.filter(r => r.strArea?.toLowerCase().startsWith(area.toLowerCase()));
    if (category)   recipes = recipes.filter(r => r.strCategory?.toLowerCase().startsWith(category.toLowerCase()));

    if (recipes.length === 0) {
        return res.status(404).json({ message: "No recipes found with those filters" });
    }

    const random = recipes[Math.floor(Math.random() * recipes.length)];
    res.json({ message: "Random recipe", data: random });
});


app.post("/recipes", async (req, res) => {
    const newRecipe = req.body;
    if (!newRecipe || !newRecipe.id || !newRecipe.name || !newRecipe.area || !newRecipe.category || !newRecipe.instructions || !newRecipe.ingredients || !Array.isArray(newRecipe.ingredients) || !Array.isArray(newRecipe.instructions)) {
        return res.status(400).json({ message: "Invalid recipe data" });
    }

    const recipes = await getRecipes();
    if (recipes.find(r => r.id === parseInt(newRecipe.id))) {
        return res.status(400).json({ message: "Recipe with this ID already exists" });
    }

    recipes.push(newRecipe);
    await fs.writeFile(DB_FILE, JSON.stringify(recipes, null));
    recipesCache = recipes;

    res.status(201).json({ message: "Recipe added", data: newRecipe });
});

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});