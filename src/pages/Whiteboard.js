import React, { useEffect, useState } from "react";
import axios from "axios";
import DrawingCanvas from "../components/DrawingCanvas";

function Whiteboard() {
  const [drawingData, setDrawingData] = useState(null);

  useEffect(() => {
    const fetchDrawingData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/drawings/latest"
        );
        setDrawingData(response.data);
      } catch (error) {
        console.error("Failed to fetch drawing data:", error);
      }
    };

    fetchDrawingData();
  }, []);

  return (
    <div>
      <DrawingCanvas drawingData={drawingData} />
    </div>
  );
}

export default Whiteboard;
