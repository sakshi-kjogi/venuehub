import type { Request, Response, NextFunction } from 'express';
import * as usersService from './users.service';

export async function getProfileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await usersService.getProfile(req.user!.userId);
    res.status(200).json({ profile });
  } catch (err) {
    next(err);
  }
}

export async function updateProfileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await usersService.updateProfile(req.user!.userId, req.body);
    res.status(200).json({ profile });
  } catch (err) {
    next(err);
  }
}

export async function changePasswordHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await usersService.changePassword(req.user!.userId, req.body);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}