import express from 'express';
const router = express.Router();

// Dummy recipe data
const dummyRecipes = [
  {
    id: 1,
    name: 'Quick Chicken Stir-Fry',
    description: 'A fast and tasty weeknight meal',
    cook_time: '20 mins',
    ingredients: ['chicken', 'vegetables', 'soy sauce'],
    score: 0.92
  },
  {
    id: 2,
    name: 'Vegetable Lasagna',
    description: 'Healthy vegetarian option',
    cook_time: '45 mins',
    ingredients: ['zucchini', 'eggplant', 'tomato sauce'],
    score: 0.88
  }
];

router.post('/', async (req, res) => {
  const { userId } = req.body;
  res.status(200).json({
    success: true,
    data: dummyRecipes
  });
});

export default router;