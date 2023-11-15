// BoxDraw.js

import React, { useEffect, useRef, useState } from 'react';

const BoxDraw = ({ nameData, imgDataURL, canvasContextRef  }) => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !nameData || !imgDataURL) {
      return;
    }

    const ctx = canvas.getContext('2d');
    canvasContextRef.current = ctx;

    setContext(ctx);

    if (canvas && nameData) {
      const img = new Image();
      img.src = imgDataURL;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        nameData.forEach((data) => {
          const { re_x1, re_y1, re_x2, re_y2 } = data;

          ctx.strokeStyle = 'red';
          ctx.lineWidth = 2;
          
          ctx.strokeRect(re_x1, re_y1, re_y2 - re_y1, re_x2 - re_x1);
        });
      };
    }
  }, [nameData, imgDataURL, canvasContextRef ]);

  return <canvas ref={canvasRef} />;
};

export default BoxDraw;