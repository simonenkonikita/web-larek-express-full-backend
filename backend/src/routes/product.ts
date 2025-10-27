import express from 'express';
import {
  createProduct, getProducts, getProductByID, removalProducts, updatedProduct,
} from '../controllers/product';
import auth from '../middlewares/auth';
import { productIdValidation, createProductValidation, updateProductValidation } from '../validations/productValidation';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', productIdValidation, getProductByID);
router.post('/', auth, createProductValidation, createProduct);
router.patch('/:id', auth, productIdValidation, updateProductValidation, updatedProduct);
router.delete('/:id', auth, productIdValidation, removalProducts);

export default router;
