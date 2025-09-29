import React, { useEffect, useState } from "react";
import axios from "axios";

const Reviewer = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/reviewer");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching pending requests:", error.response?.data || error.message);
    }
  };

  const handleReview = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/reviewer/${id}`, { status });
      alert(`Request ${status === "Approved" ? "approved" : "rejected"} successfully`);
      fetchRequests(); // Refresh list
    } catch (error) {
      console.error("Error updating review status:", error.response?.data || error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reviewer Dashboard</h2>
      {requests.length === 0 ? (
        <p>No pending requests to review.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Document Type / Event</th>
              <th>Purpose</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.studentName}</td>
                <td>{request.eventName || '-'}</td>
                <td>{request.purpose}</td>
                <td>{request.description || '-'}</td>
                <td>
                  <button onClick={() => handleReview(request._id, "Approved")}>Approve</button>{" "}
                  <button onClick={() => handleReview(request._id, "Rejected")}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reviewer;
