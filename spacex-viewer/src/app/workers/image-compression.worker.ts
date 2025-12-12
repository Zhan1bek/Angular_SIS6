self.onmessage = async (event: MessageEvent) => {
  const { fileData, fileName, fileType, maxWidth, maxHeight, quality } = event.data;

  try {
    const inputBlob = new Blob([fileData], { type: fileType });
    const imageBitmap = await createImageBitmap(inputBlob);
    
    const canvas = new OffscreenCanvas(
      Math.min(imageBitmap.width, maxWidth),
      Math.min(imageBitmap.height, maxHeight)
    );
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context is not available');
    }

    const ratio = Math.min(
      maxWidth / imageBitmap.width,
      maxHeight / imageBitmap.height,
      1
    );

    const width = Math.round(imageBitmap.width * ratio);
    const height = Math.round(imageBitmap.height * ratio);

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(imageBitmap, 0, 0, width, height);
    imageBitmap.close();

    const outputBlob = await canvas.convertToBlob({
      type: 'image/jpeg',
      quality: quality
    });

    const reader = new FileReader();
    reader.onload = () => {
      self.postMessage({
        success: true,
        dataUrl: reader.result as string
      });
    };
    reader.onerror = () => {
      self.postMessage({
        success: false,
        error: 'Failed to read compressed image'
      });
    };
    reader.readAsDataURL(outputBlob);
  } catch (error: any) {
    self.postMessage({
      success: false,
      error: error?.message || 'Image compression failed'
    });
  }
};

