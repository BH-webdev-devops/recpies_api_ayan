import fs from "fs/promises";

const DB_FILE = process.env.DB_FILE || "recipes_db.json";
let recipesCache = null;

async function getRecipes() {
    if (!recipesCache) {
        const data = await fs.readFile(DB_FILE);
        recipesCache = JSON.parse(data);
        console.log("Recipes loaded from disk");
    }
    return recipesCache;
}

export async function getAllRecipes(req, res) {
    const recipes = await getRecipes();
    res.json({ message: "List of recipes", data: recipes });
}

export async function getRandomRecipe(req, res) {
    const { area, category } = req.query;
    let recipes = await getRecipes();

    if (area)     recipes = recipes.filter(r => r.area?.toLowerCase().startsWith(area.toLowerCase()));
    if (category) recipes = recipes.filter(r => r.category?.toLowerCase().startsWith(category.toLowerCase()));

    if (recipes.length === 0) {
        return res.status(404).json({ message: "No recipes found with those filters" });
    }

    const random = recipes[Math.floor(Math.random() * recipes.length)];
    res.json({ message: "Random recipe", data: random });
}

export async function getRecipeById(req, res) {
    const { id } = req.params;
    const recipes = await getRecipes();
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
        res.json({ code: "FOUND", message: `Details of recipe ${id}`, data: recipe });
    } else {
        res.status(404).json({ code: "NOT_FOUND", message: "Recipe not found" });
    }
}

export async function createRecipe(req, res) {
    const newRecipe = req.body;
    if (!newRecipe?.id || !newRecipe?.name || !newRecipe?.area || !newRecipe?.category ||
        !Array.isArray(newRecipe?.instructions) || !Array.isArray(newRecipe?.ingredients)) {
        return res.status(400).json({ code: "INVALID_DATA", message: "Invalid recipe data" });
    }

    const recipes = await getRecipes();
    if (recipes.find(r => r.id === newRecipe.id)) {
        return res.status(400).json({ code: "DUPLICATE_ID", message: "Recipe with this ID already exists" });
    }

    recipes.unshift(newRecipe);
    await fs.writeFile(DB_FILE, JSON.stringify(recipes, null, 2));
    recipesCache = recipes;

    res.status(201).json({ code: "RECIPE_ADDED", message: "Recipe added", data: recipes });
}

export async function deleteRecipe(req, res) {
    const { id } = req.params;
    let recipes = await getRecipes();
    const index = recipes.findIndex(r => r.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Recipe not found" });
    }

    const deletedRecipe = recipes.splice(index, 1)[0];
    await fs.writeFile(DB_FILE, JSON.stringify(recipes, null, 2));
    recipesCache = recipes;

    res.json({ message: "Recipe deleted", data: deletedRecipe });
}

export async function updateRecipe(req, res) {
    const { id } = req.params;
    const updatedData = req.body;

    let recipes = await getRecipes();
    const index = recipes.findIndex(r => r.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Recipe not found" });
    }

    const existingRecipe = recipes[index];
    const updatedRecipe = { ...existingRecipe, ...updatedData, id: existingRecipe.id };
    recipes[index] = updatedRecipe;

    await fs.writeFile(DB_FILE, JSON.stringify(recipes, null, 2));
    recipesCache = recipes;

    res.json({ message: "Recipe updated", data: updatedRecipe });
}
