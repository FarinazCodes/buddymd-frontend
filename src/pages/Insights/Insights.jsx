import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./Insights.scss";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Insights = () => {
  const [adherenceLogs, setAdherenceLogs] = useState([]);
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchMedicationsAndAdherence(user);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const fetchMedicationsAndAdherence = async (user) => {
    try {
      const token = await user.getIdToken();
      const apiUrl = import.meta.env.VITE_API_URL;

      const medResponse = await axios.get(`${apiUrl}/api/medications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const meds = medResponse.data;
      setMedications(meds);

      const logs = [];
      await Promise.all(
        meds.map(async (med) => {
          try {
            const adherenceResponse = await axios.get(
              `${apiUrl}/api/adherence/${med.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const medicationLogs = adherenceResponse.data.map((log) => ({
              ...log,
              medicationName: med.name,
              formattedDate: new Date(log.date).toLocaleDateString(),
              statusValue: statusToValue(log.status),
            }));

            logs.push(...medicationLogs);
          } catch (error) {
            console.error(
              `Error fetching adherence logs for medication ${med.id}:`,
              error
            );
          }
        })
      );

      setAdherenceLogs(logs);
    } catch (error) {
      console.error("Error fetching medications and adherence data:", error);
    }
  };

  const statusToValue = (status) => {
    const statusMap = { Taken: 3, Skipped: 2, Missed: 1 };
    return statusMap[status] || 0;
  };

  const valueToStatus = (value) => {
    const statusMap = { 3: "Taken", 2: "Skipped", 1: "Missed" };
    return statusMap[value] || "";
  };

  const processAdherenceData = () => {
    const medicationData = {};

    adherenceLogs.forEach((log) => {
      if (!medicationData[log.medicationName]) {
        medicationData[log.medicationName] = [];
      }
      medicationData[log.medicationName].push({
        date: log.formattedDate,
        status: log.statusValue,
      });
    });

    return medicationData;
  };

  const colorPalette = ["#8559A5", "#3B9AE1", "#FF80B0", "#006A71", "#7B66FF"];
  const medicationColorMap = {};

  let colorIndex = 0;
  medications.forEach((med) => {
    if (!medicationColorMap[med.name]) {
      medicationColorMap[med.name] =
        colorPalette[colorIndex % colorPalette.length];
      colorIndex++;
    }
  });

  const adherenceDataByMedication = processAdherenceData();

  return (
    <div className="insights">
      <h2 className="insights__title">Medication Adherence Trends</h2>

      {adherenceLogs.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              type="category"
              allowDuplicatedCategory={false}
            />
            <YAxis domain={[1, 3]} tickFormatter={valueToStatus} />
            <Tooltip />
            <Legend />

            {Object.keys(adherenceDataByMedication).map((medName) => (
              <Line
                key={medName}
                type="monotone"
                data={adherenceDataByMedication[medName]}
                dataKey="status"
                name={medName}
                stroke={medicationColorMap[medName]}
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="insights__loading">No adherence data available.</p>
      )}

      <div className="insights__table">
        <h3 className="insights__table-title">Adherence Log</h3>
        {adherenceLogs.length > 0 ? (
          <table className="insights__table-content">
            <thead>
              <tr className="insights__table-row insights__table-row--header">
                <th className="insights__table-header">Medication Name</th>
                <th className="insights__table-header">Status</th>
                <th className="insights__table-header">Date</th>
              </tr>
            </thead>
            <tbody>
              {adherenceLogs.map((log, index) => (
                <tr
                  key={index}
                  className={`insights__table-row insights__table-row--${log.status.toLowerCase()}`}
                >
                  <td className="insights__table-data">{log.medicationName}</td>
                  <td className="insights__table-data">{log.status}</td>
                  <td className="insights__table-data">{log.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="insights__loading">No adherence records available.</p>
        )}
      </div>
    </div>
  );
};

export default Insights;
