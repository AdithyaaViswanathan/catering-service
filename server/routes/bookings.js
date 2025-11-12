import express from 'express';
import { body, validationResult } from 'express-validator';
import Booking from '../models/Booking.js';
import MenuItem from '../models/MenuItem.js';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = express.Router();

// Create booking (client only)
router.post('/', [
  protect,
  requireRole('client'),
  body('menuItems').isArray({ min: 1 }),
  body('eventDate').isISO8601(),
  body('eventTime').notEmpty(),
  body('location').notEmpty().trim(),
  body('numberOfGuests').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { menuItems, eventDate, eventTime, location, numberOfGuests, specialRequests } = req.body;

    // Calculate total price
    let totalPrice = 0;
    const menuItemsWithDetails = [];

    for (const item of menuItems) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item ${item.menuItemId} not found` });
      }
      if (!menuItem.isAvailable) {
        return res.status(400).json({ message: `Menu item ${menuItem.name} is not available` });
      }

      const itemTotal = menuItem.price * item.quantity;
      totalPrice += itemTotal;

      menuItemsWithDetails.push({
        menuItemId: menuItem._id,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    const booking = await Booking.create({
      clientId: req.user._id,
      menuItems: menuItemsWithDetails,
      eventDate,
      eventTime,
      location,
      numberOfGuests,
      specialRequests: specialRequests || '',
      totalPrice,
      status: 'pending'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('clientId', 'name email phone')
      .populate('workerId', 'name email phone')
      .populate('menuItems.menuItemId', 'name description price');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bookings (client: own, admin: all, worker: assigned)
router.get('/', [protect], async (req, res) => {
  try {
    let bookings;

    if (req.user.role === 'admin') {
      bookings = await Booking.find()
        .populate('clientId', 'name email phone')
        .populate('workerId', 'name email phone')
        .populate('menuItems.menuItemId', 'name description price')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'client') {
      bookings = await Booking.find({ clientId: req.user._id })
        .populate('clientId', 'name email phone address')
        .populate('workerId', 'name email phone')
        .populate('menuItems.menuItemId', 'name description price')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'worker') {
      bookings = await Booking.find({ workerId: req.user._id })
        .populate('clientId', 'name email phone')
        .populate('workerId', 'name email phone')
        .populate('menuItems.menuItemId', 'name description price')
        .sort({ createdAt: -1 });
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available bookings (worker only)
router.get('/available', [protect, requireRole('worker')], async (req, res) => {
  try {
    const bookings = await Booking.find({
      status: 'pending',
      workerId: null
    })
      .populate('clientId', 'name email phone address')
      .populate('menuItems.menuItemId', 'name description price')
      .sort({ eventDate: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get worker's assigned bookings (worker only)
router.get('/my-jobs', [protect, requireRole('worker')], async (req, res) => {
  try {
    const bookings = await Booking.find({
      workerId: req.user._id
    })
      .populate('clientId', 'name email phone address')
      .populate('menuItems.menuItemId', 'name description price')
      .sort({ eventDate: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single booking
router.get('/:id', [protect], async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('clientId', 'name email phone address')
      .populate('workerId', 'name email phone')
      .populate('menuItems.menuItemId', 'name description price');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has access to this booking
    if (req.user.role === 'client' && booking.clientId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'worker' && booking.workerId && booking.workerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accept booking (worker only)
router.put('/:id/accept', [protect, requireRole('worker')], async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking is not available' });
    }

    if (booking.workerId) {
      return res.status(400).json({ message: 'Booking is already assigned' });
    }

    // Check if worker is available
    if (req.user.availabilityStatus === 'busy') {
      return res.status(400).json({ message: 'You are currently busy and cannot accept new bookings' });
    }

    booking.workerId = req.user._id;
    booking.status = 'assigned';
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('clientId', 'name email phone address')
      .populate('workerId', 'name email phone')
      .populate('menuItems.menuItemId', 'name description price');

    res.json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status (worker/admin)
router.put('/:id/status', [
  protect,
  requireRole('worker', 'admin'),
  body('status').isIn(['pending', 'assigned', 'in-progress', 'completed', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Worker can only update their own bookings
    if (req.user.role === 'worker' && booking.workerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    booking.status = req.body.status;
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('clientId', 'name email phone address')
      .populate('workerId', 'name email phone')
      .populate('menuItems.menuItemId', 'name description price');

    res.json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

