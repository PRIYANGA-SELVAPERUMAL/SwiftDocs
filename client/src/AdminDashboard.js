import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [tab, setTab] = useState("Pending");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [departments, setDepartments] = useState([]);

  // Fetch requests by status
  const fetchRequests = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/requests/status/${tab}`);
      setRequests(res.data);

      // Populate department list for filter
      const allDepts = [...new Set(res.data.map(r => r.department))];
      setDepartments(allDepts);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [tab]);

  // Update request (Approve/Reject)
  const handleUpdate = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/requests/admin/${id}`, { status });
      fetchRequests();
    } catch (err) {
      console.error("Error updating request:", err);
    }
  };

  // Apply department filter
  const filteredRequests = departmentFilter
    ? requests.filter(r => r.department === departmentFilter)
    : requests;

  // Stats
  const total = requests.length;
  const pending = requests.filter(r => r.status === "Pending").length;
  const approved = requests.filter(r => r.status === "Approved").length;
  const rejected = requests.filter(r => r.status === "Rejected").length;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      {/* Stats */}
      <div style={{ display: "flex", gap: "20px", margin: "20px 0" }}>
        <div>Total: {total}</div>
        <div>Pending: {pending}</div>
        <div>Approved: {approved}</div>
        <div>Rejected: {rejected}</div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["Pending", "Approved", "Rejected"].map(t => (
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
            {departments.map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Requests */}
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
                <button onClick={() => handleUpdate(r._id, "Approved")}>
                  Approve & Generate PDF
                </button>
                <button onClick={() => handleUpdate(r._id, "Rejected")}>Reject</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
