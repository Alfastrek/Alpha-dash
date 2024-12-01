import React, { useEffect, useRef, useState } from "react";

const Canvas = ({
  draw,
  fps = 20,
  establishContext,
  establishCanvasWidth,
  width = "100%",
  height = "100%",
}) => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);

  // Resize the canvas based on window size
  const resizeCanvas = (context) => {
    const canvas = context.canvas;
    const { width, height } = canvas.getBoundingClientRect();

    if (canvas.width !== width || canvas.height !== height) {
      const { devicePixelRatio: ratio = 1 } = window;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      if (establishCanvasWidth) {
        establishCanvasWidth(canvas.width);
      }
      context.scale(ratio, ratio);
      return true;
    }
    return false;
  };

  // Set up the canvas context and resizing behavior
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      setContext(ctx);
      resizeCanvas(ctx);
      if (establishContext) {
        establishContext(ctx);
      }
    } else {
      setContext(null);
    }
  }, []);

  // Handle animation and drawing frames
  useEffect(() => {
    let frameCount = 0;
    let animationFrameId, fpsInterval, now, then, elapsed;

    if (context) {
      const render = () => {
        animationFrameId = window.requestAnimationFrame(render);
        now = Date.now();
        elapsed = now - then;
        if (elapsed > fpsInterval) {
          then = now - (elapsed % fpsInterval);
          frameCount++;
          draw();
        }
      };

      const startRendering = (fps) => {
        fpsInterval = 1000 / fps;
        then = Date.now();
        render();
      };
      startRendering(fps);
    }

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw, context]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "black", // Canvas background color
        zIndex: -1, // Ensure it stays behind other content
      }}
    />
  );
};

export default Canvas;
