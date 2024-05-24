import { Request, Response } from 'express';

let products: any[] = [];

export const getProducts = (req: Request, res: Response) => {
  res.json(products);
};

export const addProduct = (req: Request, res: Response) => {
  const product = req.body;
  products.push(product);
  res.status(201).json(product);
};
