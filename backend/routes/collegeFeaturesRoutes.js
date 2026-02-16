const express = require('express');
const router = express.Router();

const {
  getFaculties,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  addItem,
  updateItem,
  deleteItem,
} = require('../controllers/collegeFeaturesController');

router.get('/', getFaculties);
router.post('/', createFaculty);
router.put('/:id', updateFaculty);
router.delete('/:id', deleteFaculty);

router.post('/:id/item', addItem);
router.put('/:id/item/:type/:index', updateItem);
router.delete('/:id/item/:type/:index', deleteItem);

module.exports = router;
