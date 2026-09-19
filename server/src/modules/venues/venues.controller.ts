import type { Request, Response, NextFunction } from 'express';
import * as venuesService from './venues.service';
import type { VenueQueryInput } from './venues.validation';

export async function listVenuesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query as unknown as VenueQueryInput;
    const result = await venuesService.listVenues(query);
    res.status(200).json(result);
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

export async function addVenueImageHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No image file provided' });
      return;
    }
    const venue = await venuesService.addVenueImage(id, req.user!.userId, req.user!.role, req.file.buffer);
    res.status(201).json({ venue });
  } catch (err) {
    next(err);
  }
}

export async function deleteVenueImageHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const imageId = req.params.imageId as string;
    const venue = await venuesService.deleteVenueImage(id, imageId, req.user!.userId, req.user!.role);
    res.status(200).json({ venue });
  } catch (err) {
    next(err);
  }
}

export async function setCoverImageHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const imageId = req.params.imageId as string;
    const venue = await venuesService.setCoverImage(id, imageId, req.user!.userId, req.user!.role);
    res.status(200).json({ venue });
  } catch (err) {
    next(err);
  }
}