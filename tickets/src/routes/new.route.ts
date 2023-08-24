import { requireAuth, validateRequest } from '@hieulh-ticket/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket.model';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
    await ticket.save();

    res.status(200).json(ticket);
  }
);

export { router as createTicketRouter };