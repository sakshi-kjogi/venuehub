import type { Request, Response, NextFunction } from 'express';
import * as venuesService from './venues.service';

export async function listVenuesHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const venues = await venuesService.listVenues();
    res.status(200).json({ venues });
  } catch (err) {
    next(err);
  }
}

export async function listMyVenuesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const venues = await venuesService.listMyVenues(req.user!.userId);
    res.status(200).json({ venues });
  } catch (err) {
    next(err);
  }
}

export async function getVenueHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const venue = await venuesService.getVenueById(id, req.user?.userId, req.user?.role);
    res.status(200).json({ venue });
  } catch (err) {
    next(err);
  }
}

export async function createVenueHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const venue = await venuesService.createVenue(req.user!.userId, req.body);
    res.status(201).json({ venue });
  } catch (err) {
    next(err);
  }
}

export async function updateVenueHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const venue = await venuesService.updateVenue(id, req.user!.userId, req.user!.role, req.body);
    res.status(200).json({ venue });
  } catch (err) {
    next(err);
  }
}

export async function deleteVenueHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    await venuesService.deleteVenue(id, req.user!.userId, req.user!.role);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}