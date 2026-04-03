import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { createMember, deleteMember, getMembers, updateMember } from '../controllers/member.controller.js';
import { getViewById, getViews, postView } from '../controllers/view.controller.js';
import { apply, getDistribution, preview } from '../controllers/distribution.controller.js';
import { getDocument, uploadDocument } from '../controllers/document.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { upload } from '../../infrastructure/storage/cloudinary.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/members', authenticate, getMembers);
router.post('/members', authenticate, authorize('editor'), createMember);
router.put('/members/:id', authenticate, authorize('editor'), updateMember);
router.delete('/members/:id', authenticate, authorize('editor'), deleteMember);

router.post('/views', authenticate, authorize('editor'), postView);
router.get('/views', authenticate, getViews);
router.get('/views/:id', authenticate, getViewById);

router.get('/distribution/preview/:viewId', authenticate, preview);
router.post('/distribution/apply', authenticate, authorize('editor'), apply);
router.get('/distribution/:viewId', authenticate, getDistribution);

router.post('/upload', authenticate, authorize('editor'), upload.single('file'), uploadDocument);
router.get('/documents/:id', authenticate, getDocument);

export default router;
