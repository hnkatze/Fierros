import Resizer from 'react-image-file-resizer';
import { Tags } from './type';

export const compressImage = (file: File, maxWidth: number = 400, maxHeight: number = 400, quality: number = 40): Promise<File> => {
  return new Promise((resolve, reject) => {
    Resizer.imageFileResizer(
      file,
      maxWidth, 
      maxHeight, 
      'JPEG', 
      quality, 
      0, 
      (uri) => {
        if (typeof uri === 'string') {
          const byteString = atob(uri.split(',')[1]);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: 'image/jpeg' });
          const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
          resolve(compressedFile);
        } else {
          reject(new Error('Compression failed'));
        }
      },
      'base64'
    );
  });
};

export function parseTags(tagsString: string): Tags[] {
  return tagsString.split(',').map(tag => ({ tag: tag.trim() }));
}
export function convertStringToTagsArray(tagsString: string): string[] {
  return tagsString.split(',').map(tag => tag.trim());
}