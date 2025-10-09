import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImages(
    files: Express.Multer.File[],
  ): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
    const uploadPromises = files.map(file => {
      const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      return cloudinary.uploader.upload(dataUri, {
        folder: 'feeds',
      });
    });
    return Promise.all(uploadPromises);
  }
}
