import { useState } from "react";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import doctor from "./assets/doctor.png";
export default function App() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    symptoms: "",
    duration: "",
    history: "",
    temperature: "",
    pulse: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const downloadPDF = () => {
  const doc = new jsPDF();

  let y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("RuralCare AI", 20, y);

  y += 8;
  doc.setFontSize(14);
  doc.text("Healthcare Triage Report", 20, y);

  y += 15;

  doc.setFont("helvetica", "bold");
  doc.text("Patient Information", 20, y);

  y += 10;
  doc.setFont("helvetica", "normal");

  doc.text(`Name: ${form.name}`, 20, y);
  y += 8;

  doc.text(`Age: ${form.age}`, 20, y);
  y += 8;

  doc.text(`Gender: ${form.gender}`, 20, y);
  y += 8;

  doc.text(`Symptoms: ${form.symptoms}`, 20, y);
  y += 8;

  doc.text(`Duration: ${form.duration}`, 20, y);
  y += 8;

  doc.text(`History: ${form.history}`, 20, y);
  y += 8;

  doc.text(`Temperature: ${form.temperature}`, 20, y);
  y += 8;

  doc.text(`Pulse: ${form.pulse}`, 20, y);

  y += 15;

  doc.setFont("helvetica", "bold");
  doc.text("AI Assessment", 20, y);

  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFont("helvetica", "bold");


y += 10;
doc.setFont("helvetica", "normal");
const inputStyle = {
  width: "100%",
  padding: "15px",
  marginTop: "15px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  background: "#ffffff",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  transition: "0.3s",
};

const cleanResult = result
  .replace(/^#+\s*/gm, "")
  .replace(/\*\*/g, "")
  .replace(/[`]/g, "")
  .replace(/[🚨🩺💊🏥⚠📚📄🔴🟠🟢]/g, "")
  .replace(/✅/g, "•")
  .trim();

const lines = doc.splitTextToSize(cleanResult, 170);
doc.text(lines, 20, y);


  y += lines.length * 7 + 10;

  doc.setFontSize(10);
  doc.text(
    "This report is AI-generated and is NOT a substitute for professional medical advice.",
    20,
    y
  );

  doc.save(`${form.name}_RuralCare_Report.pdf`);
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.age ||
      !form.gender ||
      !form.symptoms
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("https://ruralcare-ai-tzd9.onrender.com/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      setResult(data.result);
    } catch (err) {
      console.error(err);
      alert("Unable to connect to backend.");
    }

    setLoading(false);
  };


  // Detect Risk Level from AI Response
  const getRiskInfo = () => {
    if (!result) return null;

    const text = result.toLowerCase();

    if (text.includes("critical")) {
      return {
        label: "🔴 CRITICAL RISK",
        bg: "#fee2e2",
        color: "#b91c1c",
      };
    }

    if (text.includes("high")) {
      return {
        label: "🟠 HIGH RISK",
        bg: "#ffedd5",
        color: "#c2410c",
      };
    }

    if (text.includes("moderate")) {
      return {
        label: "🟡 MODERATE RISK",
        bg: "#fef9c3",
        color: "#854d0e",
      };
    }

    return {
      label: "🟢 LOW RISK",
      bg: "#dcfce7",
      color: "#166534",
    };
  };

  const risk = getRiskInfo();



  return (
    
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#dbeafe,#f0fdf4)",
        
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "850px",
          margin: "auto",
          background: "#fff",
          padding: "35px",
          borderRadius: "15px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
<div style={{ textAlign: "center", marginBottom: "30px" }}>

  <div
    style={{
      fontSize: "55px",
      marginBottom: "10px",
    }}
  >
    🏥
  </div>

  <h1
    style={{
      color: "#1d4ed8",
      fontSize: "44px",
      margin: "4px",
      padding: "15px",
      fontWeight: "800",
    }}
  >
    RuralCare AI
  </h1>

  <p
    style={{
      color: "#475569",
      fontSize: "18px",
      marginTop: "12px",
    }}
  >
    AI-Powered Rural Healthcare Triage System
  </p>

</div>
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
    gap: "18px",
    marginBottom: "35px",
  }}
>

  {[
    {
      icon: "🤖",
      title: "AI Powered",
      color: "#2563eb",
    },
    {
      icon: "📚",
      title: "RAG Enabled",
      color: "#059669",
    },
    {
      icon: "📄",
      title: "PDF Reports",
      color: "#ea580c",
    },
    {
      icon: "🔒",
      title: "Secure",
      color: "#7c3aed",
    },
  ].map((item) => (
    <div
      key={item.title}
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "20px",
        textAlign: "center",
        boxShadow: "0 8px 20px rgba(0,0,0,.08)",
        border: "1px solid #dbeafe",
      }}
    >
      <div
        style={{
          fontSize: "36px",
          marginBottom: "10px",
        }}
      >
        {item.icon}
      </div>

      <h3
        style={{
          color: item.color,
          margin: "0",
        }}
      >
        {item.title}
      </h3>

      <p
        style={{
          fontSize: "13px",
          color: "#64748b",
          marginTop: "8px",
        }}
      >
        Healthcare-grade capability
      </p>

    </div>
  ))}

</div>

        <form onSubmit={handleSubmit}>
<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
  }}
>

  {/* Name */}
  <input
    name="name"
    placeholder="👤 Patient Name"
    onChange={handleChange}
    style={inputStyle}
  />

  {/* Age */}
  <input
    name="age"
    placeholder="🎂 Age"
    onChange={handleChange}
    style={inputStyle}
  />

  {/* Gender */}
  <select
    name="gender"
    onChange={handleChange}
    style={inputStyle}
  >
    <option value="">🚻 Select Gender</option>
    <option>Male</option>
    <option>Female</option>
    <option>Other</option>
  </select>

  {/* Pulse */}
  <input
    name="pulse"
    placeholder="❤️ Pulse (BPM)"
    onChange={handleChange}
    style={inputStyle}
  />

  {/* Temperature */}
  <input
    name="temperature"
    placeholder="🌡 Temperature (°F)"
    onChange={handleChange}
    style={inputStyle}
  />

  {/* Duration */}
  <input
    name="duration"
    placeholder="📅 Duration"
    onChange={handleChange}
    style={inputStyle}
  />

</div>
<textarea
  name="symptoms"
  placeholder="🤒 Describe the patient's symptoms..."
  rows="4"
  onChange={handleChange}
  style={inputStyle}
/>
<textarea
  name="history"
  placeholder="📖 Medical History"
  rows="4"
  onChange={handleChange}
  style={inputStyle}
/>
          <button
            type="submit"
            style={{
                width: "100%",
                padding: "16px",
                marginTop: "25px",
                border: "none",
                borderRadius: "12px",
                background: "linear-gradient(90deg,#2563eb,#1d4ed8)",
                color: "white",
                fontWeight: "bold",
                fontSize: "18px",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(37,99,235,.3)",
              }}
          >
            🤖 Analyze Patient
          </button>
        </form>
       <div
  style={{
    marginTop: "35px",
    background: "linear-gradient(135deg,#eff6ff,#f0fdf4)",
    borderRadius: "20px",
    padding: "25px",
    display: "flex",
    alignItems: "center",
    gap: "25px",
    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
    border: "1px solid #dbeafe",
  }}
>
  <img
    src={doctor}
    alt="Doctor"
    style={{
      width: "220px",
      borderRadius: "15px",
    }}
  />

  <div style={{ flex: 1 }}>
    <h2
      style={{
        color: "#1d4ed8",
        marginBottom: "10px",
      }}
    >
      Empowering Rural Healthcare
    </h2>

    <p
      style={{
        color: "#475569",
        lineHeight: "1.8",
      }}
    >
      RuralCare AI helps community health workers make
      faster and more informed decisions using AI,
      RAG-powered medical knowledge, and automated
      patient reports.
    </p>

    <div
      style={{
        display: "flex",
        gap: "20px",
        marginTop: "15px",
        flexWrap: "wrap",
      }}
    >
      <span>✅ AI Analysis</span>
      <span>📚 Medical Knowledge</span>
      <span>📄 PDF Reports</span>
      <span>⚡ Fast Response</span>
    </div>
  </div>
</div>

        {loading && (
          <div
            style={{
              textAlign: "center",
              marginTop: "25px",
            }}
          >
            <h3>🤖 AI is analyzing the patient...</h3>
          </div>
        )}

        {result && (
          <div className="fade-in"
           style={{
                marginTop: "35px",
                background: "#ffffff",
                borderRadius: "20px",
                padding: "35px",
                border: "1px solid #dbeafe",
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              }}
          >
<h2
  style={{
    textAlign: "center",
    color: "#1d4ed8",
    fontSize: "32px",
    marginBottom: "25px",
    fontWeight: "700",
  }}
>
  🩺 AI Medical Assessment
</h2>

              {risk && (
                <div
                  style={{
                      background: risk.bg,
                      color: risk.color,
                      padding: "18px",
                      borderRadius: "15px",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "24px",
                      marginBottom: "30px",
                      border: `2px solid ${risk.color}`,
                      boxShadow: "0 8px 20px rgba(0,0,0,.08)",
                    }}
                >
                  {risk.label}
                </div>
              )}

              <div className="markdown-content">
                <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h2 className="report-heading">{children}</h2>,
                      ul: ({ children }) => <ul className="report-list">{children}</ul>,
                      ol: ({ children }) => <ol className="report-list">{children}</ol>,
                      li: ({ children }) => <li className="report-item">{children}</li>,
                    }}
                  >
                    {result}
                </ReactMarkdown>
              </div>
              {result && (
              <button
                onClick={downloadPDF}
                style={{
                  marginTop: "20px",
                  background: "#0f766e",
                  color: "white",
                  padding: "12px 20px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                📄 Download PDF Report
              </button>
            )}
          </div>
        )}

        <div
          style={{
            marginTop: "30px",
            background: "#fff3cd",
            padding: "18px",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <strong>⚠ Medical Disclaimer</strong>

          <p>
            This AI provides guidance only and does not replace a licensed
            medical professional. Always seek medical advice from qualified
            healthcare providers.
          </p>
        </div>

<footer
  style={{
    marginTop: "50px",
    padding: "30px",
    borderTop: "1px solid #cbd5e1",
    textAlign: "center",
    color: "#475569",
  }}
>
  <h3
    style={{
      color: "#1d4ed8",
      marginBottom: "10px",
    }}
  >
    🏥 RuralCare AI
  </h3>

  <p>
    AI-Powered Healthcare Triage Assistant
  </p>

  <div
    style={{
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      flexWrap: "wrap",
      margin: "20px 0",
    }}
  >
    <span>⚛ React</span>
    <span>⚡ FastAPI</span>
    <span>🤖 Groq</span>
    <span>📚 RAG</span>
    <span>📄 jsPDF</span>
  </div>



  <p
    style={{
      fontSize: "14px",
      color: "#64748b",
    }}
  >
    Empowering Community Healthcare Through Artificial Intelligence
  </p>
</footer>
      </div>
    </div>
  );
}


const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "15px",
  boxSizing: "border-box",
};