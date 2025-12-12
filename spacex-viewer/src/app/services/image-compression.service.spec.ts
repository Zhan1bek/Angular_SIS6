import { TestBed } from '@angular/core/testing';
import { ImageCompressionService } from './image-compression.service';

describe('ImageCompressionService', () => {
  let service: ImageCompressionService;
  let mockWorker: jasmine.SpyObj<Worker>;

  beforeEach(() => {
    mockWorker = jasmine.createSpyObj('Worker', ['postMessage', 'addEventListener', 'removeEventListener', 'terminate']);
    
    spyOn(window, 'Worker').and.returnValue(mockWorker as any);
    
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageCompressionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should terminate worker', () => {
    service.terminate();
    expect(mockWorker.terminate).toHaveBeenCalled();
  });

  it('should compress image', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockArrayBuffer = new ArrayBuffer(8);
    spyOn(mockFile, 'arrayBuffer').and.returnValue(Promise.resolve(mockArrayBuffer));
    
    let messageHandler: ((event: MessageEvent) => void) | null = null;
    mockWorker.addEventListener.and.callFake((event: string, handler: any) => {
      if (event === 'message') {
        messageHandler = handler as (event: MessageEvent) => void;
      }
    });
    
    const compressionPromise = service.compressImage(mockFile, {
      maxWidth: 512,
      maxHeight: 512,
      quality: 0.7
    });
    
    setTimeout(() => {
      if (messageHandler) {
        messageHandler({ data: { success: true, dataUrl: 'data:image/jpeg;base64,test' } } as MessageEvent);
      }
    }, 0);
    
    await expectAsync(compressionPromise).toBeResolved();
  });

  it('should handle compression error', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockArrayBuffer = new ArrayBuffer(8);
    spyOn(mockFile, 'arrayBuffer').and.returnValue(Promise.resolve(mockArrayBuffer));
    
    let messageHandler: ((event: MessageEvent) => void) | null = null;
    mockWorker.addEventListener.and.callFake((event: string, handler: any) => {
      if (event === 'message') {
        messageHandler = handler as (event: MessageEvent) => void;
      }
    });
    
    const compressionPromise = service.compressImage(mockFile, {
      maxWidth: 512,
      maxHeight: 512,
      quality: 0.7
    });
    
    setTimeout(() => {
      if (messageHandler) {
        messageHandler({ data: { success: false, error: 'Compression failed' } } as MessageEvent);
      }
    }, 0);
    
    await expectAsync(compressionPromise).toBeRejected();
  });

  it('should handle worker error', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockArrayBuffer = new ArrayBuffer(8);
    
    let errorHandler: ((event: ErrorEvent) => void) | null = null;
    mockWorker.addEventListener.and.callFake((event: string, handler: any) => {
      if (event === 'error') {
        errorHandler = handler as (event: ErrorEvent) => void;
      }
    });
    
    const compressionPromise = service.compressImage(mockFile, {
      maxWidth: 512,
      maxHeight: 512,
      quality: 0.7
    });
    
    setTimeout(() => {
      if (errorHandler) {
        errorHandler({ message: 'Worker error' } as ErrorEvent);
      }
    }, 0);
    
    await expectAsync(compressionPromise).toBeRejected();
  });

  it('should reuse existing worker', () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockArrayBuffer = new ArrayBuffer(8);
    
    service.compressImage(mockFile, {
      maxWidth: 512,
      maxHeight: 512,
      quality: 0.7
    });
    
    const firstWorker = (service as any).worker;
    
    service.compressImage(mockFile, {
      maxWidth: 512,
      maxHeight: 512,
      quality: 0.7
    });
    
    const secondWorker = (service as any).worker;
    
    expect(firstWorker).toBe(secondWorker);
  });
});

