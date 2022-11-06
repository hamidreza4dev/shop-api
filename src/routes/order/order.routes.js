import { Router } from 'express';

import * as orderController from './order.controller.js';

import { isAuth } from '../../middlewares/isAuth.js';
import { isAdmin } from '../../middlewares/isAdmin.js';

const router = Router();

router.get('/:id', isAuth, orderController.getOrder);
router.get('/', isAuth, orderController.getOrders);
router.post('/', isAuth, orderController.postOrders);
router.delete('/:id', isAuth, orderController.deleteOrder);

export default router;
