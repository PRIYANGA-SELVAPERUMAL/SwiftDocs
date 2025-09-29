import React, { useState } from "react";
import axios from "axios";

function RequestForm() {
  const [formData, setFormData] = useState({
    studentName: "",
    rollNumber: "",
    department: "",
    eventName: "",
    purpose: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const departments = ["CSE","AIE","CYS","CCE","ECE","MECH"];
  const eventOptions = ["Bonafide","TC","Migration","Conduct","Transcript","NOC","Internship"];

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    setErrors({...errors, [e.target.name]: ""});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation
    const newErrors = {};
    Object.keys(formData).forEach(k => {
      if (k !== "description" && !formData[k].trim()) newErrors[k] = "Required";
    });
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    try {
      setLoading(true);
      const email = localStorage.getItem("email") || "";
      await axios.post("http://localhost:5000/api/requests", {...formData, email});
      setSubmitted(true);
      setFormData({studentName:"",rollNumber:"",department:"",eventName:"",purpose:"",description:""});
    } catch (err) {
      alert(err.response?.data?.error || "Error submitting request");
    } finally { setLoading(false); }
  };

  return (
    <div className="container mt-5">
      <h3>📄 Document Request Form</h3>
      {submitted && <div className="alert alert-success">Submitted ✅</div>}
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map(k => 
          k==="description" ? (
            <div key={k} className="mb-3">
              <label>{k}</label>
              <textarea name={k} value={formData[k]} className="form-control" onChange={handleChange} />
            </div>
          ) : k==="department" ? (
            <div key={k} className="mb-3">
              <label>Department</label>
              <select name={k} value={formData[k]} className="form-select" onChange={handleChange}>
                <option value="">--Select--</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors[k] && <small className="text-danger">{errors[k]}</small>}
            </div>
          ) : k==="eventName" ? (
            <div key={k} className="mb-3">
              <label>Document/Event</label>
              <select name={k} value={formData[k]} className="form-select" onChange={handleChange}>
                <option value="">--Select--</option>
                {eventOptions.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              {errors[k] && <small className="text-danger">{errors[k]}</small>}
            </div>
          ) : (
            <div key={k} className="mb-3">
              <label>{k}</label>
              <input type="text" name={k} value={formData[k]} className="form-control" onChange={handleChange} />
              {errors[k] && <small className="text-danger">{errors[k]}</small>}
            </div>
          )
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}

export default RequestForm;
