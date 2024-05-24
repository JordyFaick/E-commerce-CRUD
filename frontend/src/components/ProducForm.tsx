import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';
import { Product } from '../types';

const ProductForm: React.FC = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newProduct: Product = { id: `${Date.now()}`, name };
    await axios.post('/api/products', newProduct);
    setName('');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', margin: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" component="div" gutterBottom>
        Add Product
      </Typography>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <TextField
          label="Product Name"
          variant="outlined"
          value={name}
          onChange={e => setName(e.target.value)}
          sx={{ marginBottom: '1rem' }}
        />
        <Button type="submit" variant="contained" color="primary">
          Add Product
        </Button>
      </form>
    </Box>
  );
};

export default ProductForm;
