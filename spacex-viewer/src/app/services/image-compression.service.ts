import { Injectable } from '@angular/core';

export interface CompressionOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
}

@Injectable({
  providedIn: 'root'
})
export class ImageCompressionService {
  private worker: Worker | null = null;

  private getWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker(
        new URL('../workers/image-compression.worker.ts', import.meta.url),
        { type: 'module' }
      );
    }
    return this.worker;
  }

  async compressImage(
    file: File,
    options: CompressionOptions
  ): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    
    return new Promise((resolve, reject) => {
      const worker = this.getWorker();

      const handleMessage = (event: MessageEvent) => {
        worker.removeEventListener('message', handleMessage);
        worker.removeEventListener('error', handleError);

        if (event.data.success) {
          resolve(event.data.dataUrl);
        } else {
          reject(new Error(event.data.error || 'Compression failed'));
        }
      };

      const handleError = (error: ErrorEvent) => {
        worker.removeEventListener('message', handleMessage);
        worker.removeEventListener('error', handleError);
        reject(new Error(error.message || 'Worker error'));
      };

      worker.addEventListener('message', handleMessage);
      worker.addEventListener('error', handleError);

      worker.postMessage({
        fileData: arrayBuffer,
        fileName: file.name,
        fileType: file.type,
        maxWidth: options.maxWidth,
        maxHeight: options.maxHeight,
        quality: options.quality
      }, [arrayBuffer]);
    });
  }

  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

