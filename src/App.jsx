import { importVotingCodes } from "./importVotingCodes";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

export default function App() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [validated, setValidated] = useState(false);
  const [validatedStudent, setValidatedStudent] =
    useState(null);

  const [results, setResults] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, "votes"),
    (snapshot) => {
      const counts = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      snapshot.forEach((doc) => {
        const data = doc.data();

        if (counts[data.candidate] !== undefined) {
          counts[data.candidate]++;
        }
      });

      setResults(counts);
    }
  );

  return () => unsubscribe();
}, []);
  const candidates = [
    {
      id: 1,
      name: "Muharani Sumy",
      subtitle: "Mama Ilea",
      grade: "Grade 1",
      image: "/Calon Komite Grade 1.jpeg",
      vision:
        "Bersama mewujudkan sekolah yang nyaman dan berkualitas bagi siswa.",
      mission:
        "Menjalin komunikasi yang baik antara sekolah dan wali murid serta mendukung program sekolah demi kemajuan siswa.",
    },

    {
      id: 2,
      name: "Rini Wulandari",
      subtitle: "Mama Kagumi",
      grade: "Grade 2",
      image: "/Calon Komite Grade 2.jpeg",
      vision:
        "Mendukung serta berperan aktif dalam setiap kegiatan sekolah.",
      mission:
        "Mendukung serta berperan aktif dalam setiap kegiatan sekolah.",
    },

    {
      id: 3,
      name: "Syarifah Aminah",
      subtitle: "Bunda Uno dan Emil",
      grade: "Grade 3",
      image: "/Calon Komite Grade 3.jpeg",
      vision:
        "Komite hadir sebagai mitra sekolah untuk mewujudkan SDI unggul dalam akhlak dan prestasi.",
      mission: [
        "Memperkuat pendidikan akhlak dan Al Quran",
        "Membangun sinergi dan komunikasi terbuka",
        "Meningkatkan kualitas akademik dan non akademik",
        "Mengoptimalkan peran komite",
        "Mewujudkan lingkungan sekolah aman dan nyaman",
      ],
    },

    {
      id: 4,
      name: "Kiky Rijky Andini",
      subtitle: "Bunda Risqi",
      grade: "Grade 4",
      image: "/Calon Komite Grade 4.jpeg",
      vision:
        "InsyaAllah melakukan yang terbaik bagi Rabbani.",
      mission:
        "InsyaAllah melakukan yang terbaik bagi Rabbani.",
    },

    {
      id: 5,
      name: "Zukhrufa",
      subtitle: "Mama Azhar",
      grade: "Grade 5",
      image: "/Calon Komite Grade 5.jpeg",
      vision:
        "Mewujudkan keharmonisan antara orang tua dan sekolah dalam mendukung mutu pendidikan.",
      mission:
        "Menjadi jembatan solusi dan aspirasi antara orang tua dan sekolah.",
    },
  ];

  async function validateCode() {
    const cleanCode = code.trim();

    if (!cleanCode) {
      setMessage("Masukkan kode voting.");
      return;
    }

    try {
      const codeRef = doc(
        db,
        "votingCodes",
        cleanCode
      );

      const codeSnap = await getDoc(codeRef);

      if (!codeSnap.exists()) {
        setValidated(false);
        setMessage(
          "Kode voting tidak ditemukan."
        );
        return;
      }

      const data = codeSnap.data();

      if (data.used === true) {
        setValidated(false);
        setMessage(
          "Kode voting sudah digunakan."
        );
        return;
      }

      setValidated(true);

      setValidatedStudent(data);

      setMessage(
        `Kode valid untuk ${data.student}`
      );
    } catch (error) {
      console.error(error);

      setMessage("Terjadi error.");
    }
  }

  async function vote(candidateId) {
  if (!validated || !validatedStudent) {
    alert("Validasi kode terlebih dahulu.");
    return;
  }

  try {
    const usedCode = code.trim();

    await addDoc(collection(db, "votes"), {
      candidate: candidateId,
      code: usedCode,
      student: validatedStudent.student,
      createdAt: new Date(),
    });

    await updateDoc(doc(db, "votingCodes", usedCode), {
      used: true,
    });

    setResults((prev) => ({
      ...prev,
      [candidateId]: prev[candidateId] + 1,
    }));

    setMessage("Voting berhasil. Kode ini sudah tidak dapat digunakan lagi.");
    setValidated(false);
    setValidatedStudent(null);
    setCode("");
  } catch (error) {
    console.error(error);
    alert("Gagal menyimpan voting.");
  }
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          marginBottom: "40px",
          flexWrap: "wrap",
        }}
      >
        <img
          src="/logo-rabbani.png"
          alt="Logo"
          style={{
            width: "120px",
          }}
        />

        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "42px",
            }}
          >
            Pemilihan Komite Sekolah
          </h1>

          <h2
            style={{
              margin: "10px 0",
              color: "#1e3a8a",
            }}
          >
            SD RABBANI ISLAMIC SCHOOL
          </h2>

          <h3
            style={{
              margin: 0,
              color: "#475569",
            }}
          >
            Tahun Ajaran 2026/2027
          </h3>
        </div>
      </div>

      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          marginBottom: "40px",
        }}
      >
        <button
  onClick={importVotingCodes}
  style={{
    marginBottom: "20px",
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    background: "green",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  Import Semua Kode Voting
</button>
        <h2>Validasi Kode Voting</h2>

        <input
          type="text"
          placeholder="Masukkan kode voting"
          value={code}
          onChange={(e) =>
            setCode(e.target.value)
          }
          style={{
            width: "100%",
            padding: "15px",
            marginTop: "15px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
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
    background: validated ? "#0f172a" : "#94a3b8",
    color: "white",
    fontWeight: "bold",
    cursor: validated ? "pointer" : "not-allowed",
  }}
>
  Validasi Kode
</button>

        <p
          style={{
            marginTop: "20px",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(5, 1fr)",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "18px",
            }}
          >
            <img
              src={candidate.image}
              alt={candidate.name}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />

            <h2>{candidate.name}</h2>

            <p
              style={{
                color: "#1e3a8a",
                fontWeight: "bold",
              }}
            >
              {candidate.grade}
            </p>

            <p
              style={{
                color: "#475569",
                fontWeight: "bold",
              }}
            >
              {candidate.subtitle}
            </p>

            <div
              style={{
                marginTop: "15px",
                lineHeight: "1.6",
              }}
            >
              <p>
                <strong>Visi:</strong>
              </p>

              <div
                style={{
                  color: "#334155",
                  fontSize: "14px",
                }}
              >
                {candidate.vision}
              </div>

              <p
                style={{
                  marginTop: "15px",
                }}
              >
                <strong>Misi:</strong>
              </p>

              {Array.isArray(
                candidate.mission
              ) ? (
                <ol
                  style={{
                    paddingLeft: "20px",
                    color: "#334155",
                    fontSize: "14px",
                  }}
                >
                  {candidate.mission.map(
                    (item, index) => (
                      <li
                        key={index}
                        style={{
                          marginBottom: "8px",
                        }}
                      >
                        {item}
                      </li>
                    )
                  )}
                </ol>
              ) : (
                <div
                  style={{
                    color: "#334155",
                    fontSize: "14px",
                  }}
                >
                  {candidate.mission}
                </div>
              )}
            </div>

            <p
              style={{
                marginTop: "20px",
              }}
            >
              Total Suara:
              {" "}
              <strong>
                {results[candidate.id]}
              </strong>
            </p>

            <button
              onClick={() => vote(candidate.id)}
              disabled={!validated}
              style={{
                marginTop: "15px",
                width: "100%",
                padding: "15px",
                border: "none",
                borderRadius: "10px",
                background: "#0f172a",
                color: "white",
                fontWeight: "bold",
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