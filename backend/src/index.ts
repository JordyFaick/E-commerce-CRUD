import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001", // Asegúrate de que esto coincida con el puerto del frontend
    methods: ["GET", "POST"]
  }
});

const PORT = 3000;

app.use(express.json());

interface Product {
  id: string;
  name: string;
}

let products: Product[] = [];

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const product: Product = { id: `${Date.now()}`, name: req.body.name };
  products.push(product);
  io.emit('product_added', product);
  res.status(201).json(product);
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  products = products.filter(product => product.id !== id);
  io.emit('product_deleted', id);
  res.status(200).json({ id });
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const productIndex = products.findIndex(product => product.id === id);

  if (productIndex !== -1) {
    products[productIndex].name = name;
    io.emit('product_updated', { id, name });
    res.status(200).json({ id, name });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
