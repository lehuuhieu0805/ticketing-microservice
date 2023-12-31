import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';
import { TicketCreatedListener } from './listeners/ticket-created.listener';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
  });

  new TicketCreatedListener(stan).listen();
});
