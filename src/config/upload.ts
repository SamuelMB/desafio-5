import multer from 'multer';
import crypto from 'crypto';

export default {
  directory: '/tmp',
  storage: multer.diskStorage({
    destination: '/tmp',
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
