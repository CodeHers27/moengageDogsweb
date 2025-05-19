const express = require('express');
const List = require('../models/list');
const auth = require('../middlewares/auth');
const router = express.Router();

//Save
router.post('/', auth, async (req, res) => {
  const { name, responseCodes, imageUrls } = req.body;

  try {
    //missing fields
    if (!name || !responseCodes || !imageUrls) {
      return res.status(400).json({ message: 'Missing required fields: name, responseCodes, imageUrls' });
    }

    const newList = new List({
      userId: req.user,
      name,
      responseCodes,
      imageUrls,
    });

    await newList.save();
    res.status(201).json(newList);
  } catch (err) {
    console.error('Error creating list:', err);
    res.status(500).json({ message: 'Server error while creating list' });
  }
});

//Getlist
router.get('/', auth, async (req, res) => {
  try {
    const lists = await List.find({ userId: req.user });
    if (!lists.length) {
      return res.status(404).json({ message: 'No lists found for this user' });
    }
    res.json(lists);
  } catch (err) {
    console.error('Error fetching lists:', err);
    res.status(500).json({ message: 'Server error while fetching lists' });
  }
});

//Getonelist
router.get('/:id', auth, async (req, res) => {
  try {
    const list = await List.findOne({ _id: req.params.id, userId: req.user });
    if (!list) {
      return res.status(404).json({ message: 'List not found or not owned by the user' });
    }
    res.json(list);
  } catch (err) {
    console.error('Error fetching list:', err);
    res.status(500).json({ message: 'Server error while fetching list' });
  }
});

//Editlist 
router.put('/:id', auth, async (req, res) => {
  const { name, responseCodes, imageUrls } = req.body;

  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (responseCodes !== undefined) updateFields.responseCodes = responseCodes;
  if (imageUrls !== undefined) updateFields.imageUrls = imageUrls;

  try {
    const updatedList = await List.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      updateFields,
      { new: true }
    );

    if (!updatedList) {
      return res.status(404).json({ message: 'List not found or not owned by user' });
    }

    res.json(updatedList);
  } catch (err) {
    console.error('Error updating list:', err);
    res.status(500).json({ message: 'Server error while updating list' });
  }
});

//Deletelist
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await List.findOneAndDelete({ _id: req.params.id, userId: req.user });
    if (!deleted) {
      return res.status(404).json({ message: 'List not found or already deleted' });
    }

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting list:', err);
    res.status(500).json({ message: 'Server error while deleting list' });
  }
});

module.exports = router;
