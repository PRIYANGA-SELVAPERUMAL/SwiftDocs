import React, { useState, useEffect } from "react";
import axios from "axios";

const VerifierDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [tab, setTab] = useState("Pending");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [departments, setDepartments] = useState([]);

  // Fetch requests from backend
  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/requests", {
        params: { status: tab } // use query param instead of /status/:status
      });
      setRequests(res.data);

      // Get unique departments for filter dropdown
      const allDepts = [...new Set(res.data.map(r => r.department))];
      setDepartments(allDepts);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [tab]);

  // Approve / Reject request
  const handleUpdate = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/requests/verify/${id}`, { status });
      fetchRequests(); // refresh list
    } catch (err) {
      console.error("Error updating request:", err);
    }
  };

  // Filter requests by department
  const filteredRequests = departmentFilter
    ? requests.filter(r => r.department === departmentFilter)
    : requests;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Verifier Dashboard</h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["Pending", "Reviewed", "Rejected"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{ fontWeight: tab === t ? "bold" : "normal" }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Department Filter */}
      {departments.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <label>Filter by Department: </label>
          <select value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}>
            <option value="">All</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      )}

      {/* Requests List */}
      <ul>
        {filteredRequests.map(r => (
          <li key={r._id} style={{ marginBottom: "15px" }}>
            <strong>{r.studentName}</strong> - {r.documentType} - {r.purpose} ({r.department})<br />
            {r.proofFile && (
              <a
                href={`http://localhost:5000/uploads/${r.proofFile}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginRight: "10px" }}
              >
                View Proof
              </a>
            )}
            {tab === "Pending" && (
              <>
                <button onClick={() => handleUpdate(r._id, "Reviewed")}>Approve</button>
                <button onClick={() => handleUpdate(r._id, "Rejected")}>Reject</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VerifierDashboard;
