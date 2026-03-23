# Recipe API

A Node.js/Express REST API serving meal data from TheMealDB, with full CRUD support.

## Stack
- **Runtime:** Node.js
- **Framework:** Express
- **Data:** JSON file (`recipes_db.json`)
- **Architecture:** Router → Controller pattern

## Setup
```bash
npm install
```

Create a `.env` file:
```
PORT=3000
HOST=localhost
DB_FILE=recipes_db.json
```

```bash
npm run dev   # development (nodemon)
npm start     # production
```

## Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/recipes` | Get all recipes |
| GET | `/recipes/:id` | Get recipe by MealDB ID |
| GET | `/recipes/random-recipe` | Get a random recipe |
| GET | `/recipes/random-recipe?area=Italian` | Filter random by area |
| GET | `/recipes/random-recipe?category=Seafood` | Filter random by category |
| POST | `/recipes` | Add a new recipe |
| PUT | `/recipes/:id` | Update a recipe (validates keys) |
| DELETE | `/recipes/:id` | Delete a recipe |

## Recipe Schema

```json
{
  "id": "53262",
  "name": "Adana Kebab",
  "category": "Lamb",
  "area": "Turkish",
  "ingredients": ["800g Lamb Mince", "3 tbsp Red Pepper Paste"],
  "instructions": ["Mix ingredients", "Grill for 10 mins"]
}
```