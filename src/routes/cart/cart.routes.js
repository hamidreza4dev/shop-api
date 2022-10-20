import { Router } from 'express';

import * as cartController from './cart.controller.js';

import { isAuth } from '../../middlewares/isAuth.js';
import { isAdmin } from '../../middlewares/isAdmin.js';

const router = Router();

router.get('/', isAuth, cartController.getCart);
router.post('/', isAuth, cartController.postCart);
router.put('/:id', isAuth, cartController.putCart);
// NOTE: keep delete order otherwise does't work
router.delete('/clear', isAuth, cartController.clearCart);
router.delete('/:id', isAuth, cartController.deleteCart);

export default router;
