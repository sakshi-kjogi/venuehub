import { Router } from 'express';
import { authenticate } from '@/shared/middleware/authenticate';
import { authorize } from '@/shared/middleware/authorize';
import { validate } from '@/shared/middleware/validate';
import { venueImageUpload } from '@/shared/middleware/upload';
import { createVenueSchema, updateVenueSchema, venueQuerySchema } from './venues.validation';
import {
  listVenuesHandler,
  listMyVenuesHandler,
  getVenueHandler,
  createVenueHandler,
  updateVenueHandler,
  deleteVenueHandler,
  addVenueImageHandler,
  deleteVenueImageHandler,
  setCoverImageHandler,
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

// Images — ownership is enforced in the service layer (assertOwnerOrAdmin),
// same pattern as the venue writes above.
router.post('/:id/images', authenticate, authorize('VENUE_OWNER', 'ADMIN'), venueImageUpload, addVenueImageHandler);
router.delete('/:id/images/:imageId', authenticate, authorize('VENUE_OWNER', 'ADMIN'), deleteVenueImageHandler);
router.patch('/:id/images/:imageId/cover', authenticate, authorize('VENUE_OWNER', 'ADMIN'), setCoverImageHandler);

export default router;