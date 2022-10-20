import { Router } from 'express';

import * as categoryController from './categories.controller.js';

import { isAuth } from '../../middlewares/isAuth.js';
import { isAdmin } from '../../middlewares/isAdmin.js';

const router = Router();

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);
router.post('/', isAuth, isAdmin, categoryController.postCategory);

export default router;
