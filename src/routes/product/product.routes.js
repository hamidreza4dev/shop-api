import { Router } from 'express';

import * as productController from './product.controller.js';

import { isAuth } from '../../middlewares/isAuth.js';
import { isAdmin } from '../../middlewares/isAdmin.js';

const router = Router();

router.get('/', productController.getProducts);
router.post('/', isAuth, isAdmin, productController.postProduct);
router.delete('/:id', isAuth, isAdmin, productController.deleteProduct);
router.put('/:id', isAuth, isAdmin, productController.putProduct);

export default router;
