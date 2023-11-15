export const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = () => {
        if (reader.result) {
          const image = new Image();
          image.src = reader.result;
  
          image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const orginalwidths = image.width;
            const orginalheights = image.height;
  
            const maxWidth = 700;
            const maxHeight = 700;
  
            let width = image.width;
            let height = image.height;
  
            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }
  
            canvas.width = width;
            canvas.height = height;
            const resizeheights = height;
            const resizewidths = width;
            
            ctx.drawImage(image, 0, 0, width, height);

            canvas.toBlob((blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve({
                  base64: reader.result,
                  orginalwidths,
                  orginalheights,
                  resizeheights,
                  resizewidths,
                });
              };
              reader.readAsDataURL(blob);
            }, 'image');
          };
        } else {
          reject(new Error("Failed to load the image."));
        }
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
  
      reader.readAsDataURL(file);
    });
  };