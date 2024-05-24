import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Button, TextField, Box, Typography } from '@mui/material';
import { io } from 'socket.io-client';
import { Product } from '../types';

const socket = io('http://localhost:3000');

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
    socket.on('product_added', (product: Product) => {
      setProducts(prevProducts => [...prevProducts, product]);
    });
    socket.on('product_deleted', (id: string) => {
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    });
    socket.on('product_updated', (updatedProduct: Product) => {
      setProducts(prevProducts => prevProducts.map(product => product.id === updatedProduct.id ? updatedProduct : product));
    });

    return () => {
      socket.off('product_added');
      socket.off('product_deleted');
      socket.off('product_updated');
    };
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get('/api/products');
    setProducts(response.data);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/products/${id}`);
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdate = async () => {
    if (editingProduct) {
      await axios.put(`/api/products/${editingProduct.id}`, { name: editingProduct.name });
      setEditingProduct(null);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', margin: 'auto' }}>
      <Typography variant="h4" component="div" gutterBottom>
        Product List
      </Typography>
      <List>
        {products.map((product) => (
          <ListItem key={product.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {editingProduct && editingProduct.id === product.id ? (
              <TextField 
                value={editingProduct.name} 
                onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} 
              />
            ) : (
              <ListItemText primary={product.name} />
            )}
            <Button variant="contained" color="secondary" onClick={() => handleDelete(product.id)}>
              Delete
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleEdit(product)}>
              Edit
            </Button>
            {editingProduct && editingProduct.id === product.id && (
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Save
              </Button>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ProductList;
