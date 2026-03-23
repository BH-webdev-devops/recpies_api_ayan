import { Router } from "express";
import { getAllRecipes, getRandomRecipe, getRecipeById, createRecipe, deleteRecipe, updateRecipe } from "../controller/RecipesController.js";

const recipesRouter = Router();

function validateRecipeKeys(req, res, next) {
    const ALLOWED_KEYS = ["id", "name", "category", "area", "instructions", "ingredients"];
    const invalidKeys = Object.keys(req.body).filter(key => !ALLOWED_KEYS.includes(key));
    if (invalidKeys.length > 0) {
        return res.status(400).json({ message: `Invalid keys: ${invalidKeys.join(", ")}` });
    }
    next();
}

recipesRouter.get("/", getAllRecipes);
recipesRouter.get("/random-recipe", getRandomRecipe);
recipesRouter.get("/:id", getRecipeById);
recipesRouter.post("/", createRecipe);
recipesRouter.delete("/:id", deleteRecipe);
recipesRouter.put("/:id", validateRecipeKeys, updateRecipe);

export default recipesRouter;