import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import "./DrugReactionsChart.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DrugReactionsChart = ({ drugName }) => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!drugName) return;

    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/api/drug-reactions/reactions?drug=${encodeURIComponent(drugName)}`
      )

      .then((response) => {
        if (response.data.success) {
          const labels = response.data.reactions.map((item) => item.term);
          const counts = response.data.reactions.map((item) => item.count);

          setChartData({
            labels,
            datasets: [
              {
                label: `Reported Reactions for ${drugName}`,
                data: counts,
                backgroundColor: "rgba(255, 99, 132, 0.5)",
              },
            ],
          });
        } else {
          setChartData(null);
          setError(response.data.message);
        }
      })
      .catch((err) => {
        console.error("Error fetching reactions:", err);
        setError("Failed to load reaction data.");
      });
  }, [drugName]);

  return (
    <div className="drug-reactions-chart">
      <h3>Reported Reactions for {drugName}</h3>
      {error && <p className="error-message">{error}</p>}
      {chartData ? <Bar data={chartData} /> : <p>Loading reactions...</p>}
    </div>
  );
};

export default DrugReactionsChart;
