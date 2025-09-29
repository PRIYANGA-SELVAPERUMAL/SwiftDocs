import React, { useEffect, useState } from "react";
import axios from "axios";

function ReviewerDashboard() {
  const [requests, setRequests] = useState([]);
  const [comment, setComment] = useState({});
  const [status, setStatus] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/api/reviewer-requests")
      .then((res) => setRequests(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleReview = (id) => {
    axios.put(`http://localhost:5000/api/review/${id}`, {
      status: status[id],
      comment: comment[id]
    })
    .then(() => {
      alert("Request reviewed successfully");
      setRequests(prev => prev.filter(req => req._id !== id)); // Remove reviewed one
    })
    .catch((err) => {
      alert("Review failed");
      console.error(err);
    });
  };

  return (
    <div className="container mt-5">
      <h2>📋 Reviewer Dashboard</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        requests.map((req) => (
          <div key={req._id} className="card my-3 p-3">
            <h5>{req.name} ({req.regNo})</h5>
            <p><strong>Document:</strong> {req.documentType}</p>
            <p><strong>Purpose:</strong> {req.purpose}</p>
            <div className="form-group">
              <label>Status:</label>
              <select className="form-control" onChange={(e) => setStatus({ ...status, [req._id]: e.target.value })}>
                <option value="">Select</option>
                <option value="Reviewed">Approve</option>
                <option value="Rejected by Reviewer">Reject</option>
              </select>
            </div>
            <div className="form-group mt-2">
              <label>Comment:</label>
              <textarea className="form-control" onChange={(e) => setComment({ ...comment, [req._id]: e.target.value })}></textarea>
            </div>
            <button className="btn btn-primary mt-2" onClick={() => handleReview(req._id)}>
              Submit Review
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default ReviewerDashboard;
