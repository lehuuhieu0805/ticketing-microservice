import { OrderStatus } from '@hieulh-ticket/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order.model';
import { Ticket } from '../../models/ticket.model';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();

  const token = global.signin();

  await request(app)
    .post('/api/orders')
    .set('Cookie', token)
    .send({ ticketId })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const token = global.signin();

  const ticket = Ticket.build({ title: 'concert', price: 20 });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: 'sahdhsahd',
    status: OrderStatus.CREATED,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', token)
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserved a ticket', async () => {
  const token = global.signin();

  const ticket = Ticket.build({ title: 'concert', price: 20 });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', token)
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order created event', async () => {
  const token = global.signin();

  const ticket = Ticket.build({ title: 'concert', price: 20 });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', token)
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});