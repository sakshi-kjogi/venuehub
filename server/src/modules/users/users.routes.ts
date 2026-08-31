import { Router } from 'express';
import { authenticate } from '@/shared/middleware/authenticate';
import { validate } from '@/shared/middleware/validate';
import { updateProfileSchema, changePasswordSchema } from './users.validation';
import {
  getProfileHandler,
  updateProfileHandler,
  changePasswordHandler,
} from './users.controller';

const router = Router();

router.use(authenticate); // every route below requires a valid access token

router.get('/me', getProfileHandler);
router.patch('/me', validate(updateProfileSchema), updateProfileHandler);
router.patch('/me/password', validate(changePasswordSchema), changePasswordHandler);

export default router;