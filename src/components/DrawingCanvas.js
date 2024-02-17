import React, { useEffect, useRef, useState } from "react"; // Ensure useState is imported
import paper from "paper";
import { io } from "socket.io-client";

function DrawingCanvas({ drawingData }) {
  // Assuming drawingData is passed as a prop
  const canvasRef = useRef(null);

  useEffect(() => {
    // Establish a WebSocket connection to the backend
    const socket = io("http://localhost:3001");

    paper.setup(canvasRef.current);

    // Function to draw the existing drawing data
    const drawExistingData = () => {
      if (drawingData) {
        drawingData.forEach((line) => {
          const path = new paper.Path({
            segments: line.segments,
            strokeColor: line.color,
            // Add more attributes based on your data structure
          });
          path.simplify(10);
        });
      }
    };

    drawExistingData();

    // Function to draw grid
    const drawGrid = () => {
      const gridSize = 25;
      const dotSize = 1;
      const bounds = paper.view.bounds.clone().expand(100); // Example expansion

      paper.project.activeLayer.children.forEach((child) => {
        if (child.data && child.data.isGrid) {
          child.remove();
        }
      });

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

    const tool = new paper.Tool();
    tool.minDistance = 10;

    tool.onMouseDown = (event) => {
      if (!event.modifiers.space) {
        path = new paper.Path();
        path.strokeColor = "black";
        path.add(event.point);
      }
    };

    tool.onMouseDrag = (event) => {
      if (!event.modifiers.space && path) {
        path.add(event.point);
        socket.emit("draw", { point: event.point, color: path.strokeColor });
      }
    };

    tool.onMouseUp = () => {
      if (path) {
        path.simplify(10);
      }
    };

    socket.on("draw", (data) => {
      const newPath = new paper.Path();
      newPath.strokeColor = data.color;
      newPath.add(new paper.Point(data.point.x, data.point.y));
      newPath.simplify(10);
    });

    paper.view.onMouseDrag = (event) => {
      if (event.modifiers.space) {
        paper.view.translate(event.delta);
        drawGrid();
      }
    };

    paper.view.onMouseWheel = (event) => {
      event.preventDefault();
      const zoomCenter = event.point;
      const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
      paper.view.scale(zoomFactor, zoomCenter);
      drawGrid();
    };

    // Cleanup on component unmount
    return () => {
      socket.off("draw");
    };
  }, [drawingData]); // Dependency array to trigger re-render

  return (
    <canvas
      ref={canvasRef}
      resize="true"
      style={{ width: "100%", height: "100vh" }}
    />
  );
}

export default DrawingCanvas;
