# Recipe API

A simple Node.js/Express REST API serving meal data from TheMealDB.

## Routes
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/recipes` | Get all recipes |
| GET | `/recipes/:id` | Get recipe by ID |
| GET | `/random?area=&category=` | Get a random recipe, optionally filtered |
| POST | `/recipes` | Add a new recipe |

## Setup
```bash
npm install
npm run dev
```
