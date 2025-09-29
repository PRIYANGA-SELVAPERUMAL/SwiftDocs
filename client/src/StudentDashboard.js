import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaClock, FaCheckCircle, FaTimesCircle, FaGraduationCap, FaFileAlt, FaFileDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const StudentDashboard = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [form, setForm] = useState({
    regNo: "",
    department: "CSE",
    documentType: "NOC",
    purpose: ""
  });
  const [file, setFile] = useState(null);

  const departments = {
    CSE: "Computer Science Engineering",
    AIE: "Artificial Intelligence Engineering",
    CYS: "Cyber Security",
    CCE: "Computer and Communication Engineering",
    ECE: "Electronics and Communication Engineering",
    MECH: "Mechanical Engineering"
  };

  const documents = {
    NOC: "No Objection Certificate",
    TC: "Transfer Certificate",
    Migration: "Migration Certificate",
    Bonafide: "Bonafide Certificate",
    "Academic Transcript": "Academic Transcript",
    Conduct: "Conduct Certificate"
  };

  // ---------- Fetch requests ----------
  const fetchRequests = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/requests/myrequests/${user.username}`);
      setRequests(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setRequests([]);
      } else {
        console.error("Error fetching requests:", err);
      }
    }
  }, [user.username]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // ---------- Submit new request ----------
  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("studentName", user.username);
      data.append("regNo", form.regNo);
      data.append("department", form.department);
      data.append("documentType", form.documentType);
      data.append("purpose", form.purpose);
      if (file) data.append("proofFile", file);

      await axios.post("http://localhost:5000/api/requests", data);
      setForm({ regNo: "", department: "CSE", documentType: "NOC", purpose: "" });
      setFile(null);
      fetchRequests();
      setActiveTab("myRequests");
    } catch (err) {
      console.error("Error submitting request:", err);
    }
  };

  // ---------- Preview & Download PDF ----------
  const handlePreviewPDF = (r) => {
    if (!r.pdfFile) return alert("PDF not available yet");
    // open preview page in a new tab
    window.open(`http://localhost:5000/api/requests/preview/${r._id}`, "_blank");
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  // ---------- Stats ----------
  const totalRequests = requests.length;
  const pending = requests.filter(r => r.status === "Pending").length;
  const approved = requests.filter(r => r.status === "Approved").length;
  const rejected = requests.filter(r => r.status === "Rejected").length;

  // ---------- Styles ----------
  const sidebarStyle = { width: "220px", backgroundColor: "#16203b", padding: "20px", display: "flex", flexDirection: "column" };
  const sidebarLinkStyle = { padding: "10px 15px", marginBottom: "10px", color: "#f0f0f0", backgroundColor: "#16203b", border: "none", cursor: "pointer", textAlign: "left", fontSize: "16px" };
  const logoutButtonStyle = { ...sidebarLinkStyle, backgroundColor: "#FF6347", color: "#fff", marginTop: "auto" };
  const mainStyle = { flex: 1, padding: "30px", overflowY: "auto" };
  const dashboardCardStyle = { backgroundColor: "#2a3b5c", padding: "20px", borderRadius: "12px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" };
  const dashboardGridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px" };
  const formContainerStyle = { backgroundColor: "#2a3b5c", padding: "20px", borderRadius: "12px", maxWidth: "600px", margin: "0 auto" };
  const inputStyle = { padding: "8px 12px", borderRadius: "8px", border: "none", backgroundColor: "#1f2c4d", color: "#fff", fontSize: "0.95rem", marginTop: "5px" };
  const formGroupStyle = { display: "flex", flexDirection: "column", marginBottom: "15px" };
  const buttonStyle = { padding: "10px 20px", border: "none", borderRadius: "8px", backgroundColor: "#00FF7F", cursor: "pointer", fontWeight: "bold" };
  const requestsGridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" };
  const requestCardStyle = { backgroundColor: "#2a3b5c", padding: "15px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" };

  // ---------- JSX ----------
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#1b2a49", color: "#f0f0f0", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "40px" }}>
          <FaGraduationCap size={28} />
          <h2 style={{ fontSize: "1.5rem", margin: 0 }}>SwiftDocs</h2>
        </div>
        <button style={sidebarLinkStyle} onClick={() => setActiveTab("dashboard")}>Student Dashboard</button>
        <button style={sidebarLinkStyle} onClick={() => setActiveTab("newRequest")}>Request Something New</button>
        <button style={sidebarLinkStyle} onClick={() => setActiveTab("myRequests")}>Track My Requests</button>
        <button style={logoutButtonStyle} onClick={handleLogout}>Logout</button>
      </div>

      {/* Main Content */}
      <div style={mainStyle}>
        {activeTab === "dashboard" && (
          <>
            <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>Student Dashboard</h1>
            <div style={dashboardGridStyle}>
              <div style={dashboardCardStyle}><FaFileAlt size={30} /><h2>{totalRequests}</h2><p>Total Requests</p></div>
              <div style={dashboardCardStyle}><FaClock size={30} color="#FFD700" /><h2>{pending}</h2><p>Pending</p></div>
              <div style={dashboardCardStyle}><FaCheckCircle size={30} color="#00FF7F" /><h2>{approved}</h2><p>Approved</p></div>
              <div style={dashboardCardStyle}><FaTimesCircle size={30} color="#FF6347" /><h2>{rejected}</h2><p>Rejected</p></div>
            </div>
          </>
        )}

        {activeTab === "newRequest" && (
          <div style={formContainerStyle}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "20px", textAlign: "center" }}>Request Something New</h2>
            <div style={formGroupStyle}>
              <label>Reg No</label>
              <input style={inputStyle} value={form.regNo} onChange={e => setForm({ ...form, regNo: e.target.value })} placeholder="Enter registration number" />
            </div>
            <div style={formGroupStyle}>
              <label>Department</label>
              <select style={inputStyle} value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                {Object.keys(departments).map(k => <option key={k} value={k}>{k} - {departments[k]}</option>)}
              </select>
            </div>
            <div style={formGroupStyle}>
              <label>Document Type</label>
              <select style={inputStyle} value={form.documentType} onChange={e => setForm({ ...form, documentType: e.target.value })}>
                {Object.keys(documents).map(k => <option key={k} value={k}>{k} - {documents[k]}</option>)}
              </select>
            </div>
            <div style={formGroupStyle}>
              <label>Purpose</label>
              <input style={inputStyle} value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} placeholder="Enter purpose" />
            </div>
            <div style={formGroupStyle}>
              <label>Upload File</label>
              <input type="file" style={{ ...inputStyle, padding: "6px 12px" }} onChange={e => setFile(e.target.files[0])} />
            </div>
            <button style={buttonStyle} onClick={handleSubmit}>Submit Request</button>
          </div>
        )}

        {activeTab === "myRequests" && (
          <div>
            <h2 style={{ marginBottom: "15px" }}>Track My Requests</h2>
            {requests.length === 0 ? (
              <p>No requests submitted yet.</p>
            ) : (
              <div style={requestsGridStyle}>
                {requests.map(r => (
                  <div key={r._id} style={requestCardStyle}>
                    <h3>{documents[r.documentType]} - {r.purpose}</h3>
                    <p>Status: {r.status}</p>
                    {r.pdfFile && (
                      <button style={{ ...buttonStyle, marginTop: "10px" }} onClick={() => handlePreviewPDF(r)}>
                        <FaFileDownload style={{ marginRight: "5px" }} /> Preview / Download
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
