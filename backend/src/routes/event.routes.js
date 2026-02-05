const express = require('express');
const {
  listPublicEvents,
  getPublicEventById
} = require('../controllers/event.controller');

const router = express.Router();

router.get('/', listPublicEvents);
router.get('/:id', getPublicEventById);

module.exports = router;
