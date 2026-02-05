const express = require("express");
const adminAuth = require("../middlewares/adminAuth");
const { upload } = require('../middlewares/upload');
const adminController = require("../controllers/admin.controller");

const router = express.Router();

// auth
router.post("/login", adminController.login);

// protected admin actions
router.post("/events", adminAuth, adminController.createEvent);
router.post('/activities', adminAuth, adminController.createActivity);
router.get('/activities', adminAuth, adminController.listActivities);
router.get('/events', adminAuth, adminController.listEvents); //admin lists all events draft and published//
router.patch('/events/:id', adminAuth, adminController.updateEvent);//admin updates events edits location etc
router.delete('/events/:id', adminAuth, adminController.deleteEvent);// admin permanently deletes event.


        //SCHEDULE CREATION & STATUS CONTRO
router.post('/events/:id/schedules', adminAuth, adminController.addSchedule);
router.patch('/schedules/:id/status', adminAuth, adminController.updateScheduleStatus);
router.get('/events/:id/schedules', adminAuth, adminController.listSchedules);// admin lists schedules for all events
router.get('/events/:id/images', adminAuth, adminController.listEventImages);//Admin: list event images (verification only)
router.patch("/schedules/:id", adminAuth, adminController.updateSchedule);//edits schedules that had already been created.




        //pricing
router.post('/events/:id/pricing', adminAuth, adminController.createPricing);
router.patch('/pricing/:id', adminAuth, adminController.updatePricing);
router.get('/events/:id/pricing', adminAuth, adminController.listPricing);



router.post(
  '/events/:id/images',
  adminAuth,
  upload.single('image'),
  adminController.uploadEventImage
);
router.patch(
  '/events/:id/publish',
  adminAuth,
  adminController.publishEvent
);
// Unpublish event
router.patch('/events/:id/unpublish',
  adminAuth, adminController.unpublishEvent
  
);




module.exports = router;
