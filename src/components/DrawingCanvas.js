import React, { useEffect, useRef } from "react";
import paper from "paper";

function DrawingCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    paper.setup(canvasRef.current);

    // Draw grid
    const drawGrid = () => {
      // Define grid properties
      const gridSize = 25;
      const dotSize = 1;

      // Manually inflate bounds by a certain amount (e.g., to expand the view bounds)
      const padding = 100; // Amount to inflate the bounds by
      const bounds = new paper.Rectangle(paper.view.bounds);
      bounds.expand(padding * 2); // Expanding bounds

      // Remove previous grid to prevent redraw overlap
      paper.project.activeLayer.children.forEach((child) => {
        if (child.data && child.data.isGrid) {
          child.remove();
        }
      });

      // Generate grid
      for (
        let x = bounds.left - (bounds.left % gridSize);
        x < bounds.right;
        x += gridSize
      ) {
        for (
          let y = bounds.top - (bounds.top % gridSize);
          y < bounds.bottom;
          y += gridSize
        ) {
          new paper.Path.Circle({
            center: [x, y],
            radius: dotSize,
            fillColor: "lightgray",
            data: { isGrid: true },
          });
        }
      }
    };

    drawGrid();

    let path;

    // Setup tool for drawing
    const tool = new paper.Tool();
    tool.minDistance = 10; // Minimum distance between path points

    tool.onMouseDown = (event) => {
      if (!event.modifiers.space) {
        // Start a new path
        path = new paper.Path();
        path.strokeColor = "black";
        path.add(event.point);
      }
    };

    tool.onMouseDrag = (event) => {
      if (!event.modifiers.space && path) {
        // Add points to the path
        path.add(event.point);
      }
    };

    tool.onMouseUp = () => {
      if (path) {
        path.simplify(10); // Simplify the path to smooth curves
      }
    };

    // Pan and zoom
    let lastPoint = null;
    paper.view.onMouseDrag = (event) => {
      if (event.modifiers.space) {
        if (lastPoint) {
          paper.view.translate(event.point.subtract(lastPoint));
          drawGrid(); // Redraw grid to fill new areas
        }
        lastPoint = event.point;
      }
    };

    paper.view.onMouseDown = (event) => {
      if (event.modifiers.space) {
        lastPoint = event.point;
      }
    };

    paper.view.onMouseUp = () => {
      lastPoint = null;
    };

    paper.view.onMouseWheel = (event) => {
      event.preventDefault();
      const zoomCenter = event.point;
      const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
      paper.view.scale(zoomFactor, zoomCenter);
      drawGrid(); // Redraw grid to adjust to new zoom level
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      resize="true"
      style={{ width: "100%", height: "100vh" }}
    />
  );
}

export default DrawingCanvas;
