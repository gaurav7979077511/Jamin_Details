import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { env } from '../../config/env.js';

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({ folder: 'vanshawali', resource_type: 'auto' })
});

export const upload = multer({ storage });
