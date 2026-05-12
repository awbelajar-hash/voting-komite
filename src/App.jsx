import { useState } from "react";

export default function App() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [validated, setValidated] = useState(false);

  const votingCodes = [
    {
      student: "AISYAH MA'RIFATUN MUMTAZA",
      code: "RIS-1-001-K8P2",
      used: false,
    },
    {
      student: "ALYA KYRAYUDISA",
      code: "RIS-1-002-M4L7",
      used: false,
    },
  ];

  const [results, setResults] = useState({
    1: 0,
    2: 0,
  });

  const candidates = [
    {
      id: 1,
      name: "Calon Ketua 1",
      description: "Visi membangun komunikasi sekolah.",
    },
    {
      id: 2,
      name: "Calon Ketua 2",
      description: "Visi meningkatkan program sekolah.",
    },
  ];

  function validateCode() {
    const found = votingCodes.find(
      (item) => item.code === code
    );

    if (!found) {
      setValidated(false);
      setMessage("Kode voting tidak ditemukan");
      return;
    }

    if (found.used) {
      setValidated(false);
      setMessage("Kode sudah digunakan");
      return;
    }

    setValidated(true);

    setMessage(
      `Kode valid untuk ${found.student}`
    );
  }

  function vote(candidateId) {
    if (!validated) {
      alert("Validasi kode terlebih dahulu");
      return;
    }

    setResults({
      ...results,
      [candidateId]: results[candidateId] + 1,
    });

    setMessage("Voting berhasil");

    setValidated(false);

    setCode("");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        Pemilihan Komite Sekolah
      </h1>

      <div
        style={{
          maxWidth: "500px",
          margin: "30px auto",
          background: "white",
          padding: "30px",
          borderRadius: "20px",
        }}
      >
        <h2>Validasi Kode Voting</h2>

        <input
          type="text"
          placeholder="Masukkan kode voting"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            marginTop: "15px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={validateCode}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "15px",
            border: "none",
            borderRadius: "10px",
            background: "#0f172a",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Validasi Kode
        </button>

        <p style={{ marginTop: "20px" }}>
          {message}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          maxWidth: "900px",
          margin: "auto",
        }}
      >
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "30px",
            }}
          >
            <h2>{candidate.name}</h2>

            <p>{candidate.description}</p>

            <p>
              Total Suara:
              {" "}
              <strong>
                {results[candidate.id]}
              </strong>
            </p>

            <button
              onClick={() => vote(candidate.id)}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "15px",
                border: "none",
                borderRadius: "10px",
                background: "#0f172a",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Pilih Kandidat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}