const express = require('express');
const router = express.Router();
const { FoodIntake } = require('../models');

// Route to create or update a food intake record
router.get("/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const foodIntakes = await FoodIntake.findOne({ where: { userId } }); // Fetch food intake records for a specific user
        if (foodIntakes.length === 0) {
            return res.status(404).json({ error: 'No food intake records found for this user' });
        }
        res.status(200).json(foodIntakes); // Return the food intake records as JSON
    } catch (error) {
        console.error('Error fetching food intake records for user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.post("/", async (req, res) => {
    const { userId, Calories, Protein, Fat, Carb } = req.body;

    try {
        // Check if a record with the given userId already exists
        const existingRecord = await FoodIntake.findOne({ where: { userId } });

        if (existingRecord) {
            // Update the existing record
            existingRecord.Calories = Calories;
            existingRecord.Protein = Protein;
            existingRecord.Fat = Fat;
            existingRecord.Carb = Carb;
            await existingRecord.save(); // Save the updated record
            return res.status(200).json(existingRecord); // Return the updated record
        } else {
            // Create a new record
            const newFoodIntake = await FoodIntake.create({
                userId,
                Calories,
                Protein,
                Fat,
                Carb
            });
            return res.status(201).json(newFoodIntake); // Return the new record
        }
    } catch (error) {
        console.error('Error creating or updating food intake record:', error);
        res.status(500).json({ error: 'Server error' });
    }
});



module.exports = router;