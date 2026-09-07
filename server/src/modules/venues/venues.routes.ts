import { Router } from 'express';
import { authenticate } from '@/shared/middleware/authenticate';
import { authorize } from '@/shared/middleware/authorize';
import { validate } from '@/shared/middleware/validate';
import { createVenueSchema, updateVenueSchema, venueQuerySchema } from './venues.validation';
import {
  listVenuesHandler,
  listMyVenuesHandler,
  getVenueHandler,
  createVenueHandler,
  updateVenueHandler,
  deleteVenueHandler,
} from './venues.controller';

const router = Router();

// Public reads
router.get('/', validate(venueQuerySchema, 'query'), listVenuesHandler);

// IMPORTANT: /mine must be registered BEFORE /:id, or Express will treat
// "mine" as a venue ID and route it to getVenueHandler instead.
router.get('/mine', authenticate, authorize('VENUE_OWNER', 'ADMIN'), listMyVenuesHandler);

router.get('/:id', getVenueHandler); // public, but service enforces publish/ownership rules

// Protected writes
router.post('/', authenticate, authorize('VENUE_OWNER', 'ADMIN'), validate(createVenueSchema), createVenueHandler);
router.patch('/:id', authenticate, authorize('VENUE_OWNER', 'ADMIN'), validate(updateVenueSchema), updateVenueHandler);
router.delete('/:id', authenticate, authorize('VENUE_OWNER', 'ADMIN'), deleteVenueHandler);

export default router;