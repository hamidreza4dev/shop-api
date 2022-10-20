import { Router } from 'express';

import * as productController from './product.controller.js';

import { isAuth } from '../../middlewares/isAuth.js';
import { isAdmin } from '../../middlewares/isAdmin.js';

const router = Router();

router.get('/', productController.getProducts);
router.post('/', isAuth, productController.postProduct);

export default router;
