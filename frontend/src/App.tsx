import React from 'react';
import { Container, CssBaseline } from '@mui/material';
import ProductList from './components/ProductList';
import ProductForm from './components/ProducForm';

const App: React.FC = () => {
  return (
    <Container>
      <CssBaseline />
      <ProductForm />
      <ProductList />
    </Container>
  );
};

export default App;
