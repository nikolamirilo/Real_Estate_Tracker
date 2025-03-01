// index.js
import { sendMessageToDiscord } from './discordBot.js';

// Example message content
const messageContent =   {
    details: '52m² | 3 sobe | prizemlje/2 sprata',
    street: 'Vojvođanska',
    link: 'https://www.4zida.rs//prodaja-stanova/ledine-surcin-opstina-beograd/trosoban-stan/64b01945bfc96d8bc600a8f5',
    cityArea: 'Ledine, Surčin opština, Beograd',
    price: 96720,
    pricePerM2: 1860,
    image: ' https://resizer2.4zida.rs/xR_Wd79A3rsbwuUZvnX5e5BccnpnNWMzCrNRqzV8lf4/rs:fill:380:0:0/bG9jYWw6Ly8vNjRiMDJhNzNlMThhNWFhMTM5MDJmNzI4LzI5M2QxOWNhZTk.webp#32 32w'
  }

// Send the message
sendMessageToDiscord(messageContent);



