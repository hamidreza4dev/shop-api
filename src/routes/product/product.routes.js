import { Router } from 'express';

import * as productController from './product.controller.js';

import { isAuth } from '../../middlewares/isAuth.js';
import { isAdmin } from '../../middlewares/isAdmin.js';

const router = Router();

router.get('/:id', productController.getProduct);
router.get('/', productController.getProducts);
router.post('/', isAuth, productController.postProduct);
router.delete('/:id', isAuth, productController.deleteProduct);
router.put('/:id', isAuth, productController.putProduct);

export default router;
