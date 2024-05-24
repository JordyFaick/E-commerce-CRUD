import { Router } from 'express';
import { getProducts, addProduct } from './controllers';

const router = Router();

router.get('/products', getProducts);
router.post('/products', addProduct);

export default router;
