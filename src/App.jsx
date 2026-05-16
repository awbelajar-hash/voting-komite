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
  const now = new Date();

  const startVoting = new Date(
    "2025-05-01T08:00:00+07:00"
  );

  const endVoting = new Date(
    "2027-05-18T19:00:00+07:00"
  );

  const isVotingOpen =
    now >= startVoting && now <= endVoting;

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [showAdmin, setShowAdmin] =
    useState(false);
  const isMobile = window.innerWidth <= 768;

  const adminPassword = "RABBANI2026";

  const [validated, setValidated] =
    useState(false);

  const [validatedStudent, setValidatedStudent] =
    useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

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

        snapshot.forEach((docItem) => {
          const data = docItem.data();

          if (
            counts[data.candidate] !== undefined
          ) {
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
    if (!isVotingOpen) {
      setMessage(
        "Voting belum dibuka atau sudah ditutup."
      );
      return;
    }

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
    if (!isVotingOpen) {
      alert(
        "Voting belum dibuka atau sudah ditutup."
      );
      return;
    }

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

      await updateDoc(
        doc(db, "votingCodes", usedCode),
        {
          used: true,
        }
      );

      setMessage(
        "Voting berhasil. Kode ini sudah tidak dapat digunakan lagi."
      );
      setSelectedCandidate(candidateId);

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
            SDI RABBANI ISLAMIC SCHOOL
          </h2>

          <h3
            style={{
              margin: 0,
              color: "#475569",
            }}
          >
            Tahun Ajaran 2026/2027
          </h3>

          <button
            onClick={() => {
              if (!showAdmin) {
                const input = prompt(
                  "Masukkan password admin"
                );

                if (
                  input !== adminPassword
                ) {
                  alert("Password salah");
                  return;
                }
              }

              setShowAdmin(!showAdmin);
            }}
            style={{
              marginTop: "20px",
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              background: "#1e3a8a",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {showAdmin
              ? "Tutup Hasil Voting"
              : "Lihat Hasil Voting"}
          </button>
        </div>
      </div>

      {!isVotingOpen && (
        <div
          style={{
            textAlign: "center",
            background: "#fee2e2",
            color: "#991b1b",
            padding: "15px",
            borderRadius: "12px",
            margin: "20px auto",
            maxWidth: "700px",
            fontWeight: "bold",
          }}
        >
          Voting belum dibuka atau sudah
          ditutup.
        </div>
      )}

      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          marginBottom: "40px",
        }}
      >
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
            background: "#94a3b8",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
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
  gridTemplateColumns: isMobile
    ? "1fr"
    : "repeat(6, 1fr)",
  gap: "20px",
  alignItems: "start",
  maxWidth: "1600px",
  margin: "0 auto",
}}
      >
        {candidates.map((candidate) => (
  <div
    key={candidate.id}
style={{
  gridColumn: isMobile
    ? "auto"
    : candidate.id === 4
    ? "2 / 4"
    : candidate.id === 5
    ? "4 / 6"
    : "span 2",
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
                height: isMobile ? "320px" : "220px",
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

            {showAdmin && (
              <div
                style={{
                  marginTop: "20px",
                  background: "#eff6ff",
                  padding: "12px",
                  borderRadius: "10px",
                  textAlign: "center",
                  border:
                    "1px solid #bfdbfe",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    color: "#1e3a8a",
                    fontWeight: "bold",
                  }}
                >
                  Total Suara
                </div>

                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#0f172a",
                  }}
                >
                  {results[candidate.id]}
                </div>
              </div>
            )}

            <button
  onClick={() => vote(candidate.id)}
  disabled={!validated || selectedCandidate === candidate.id}
  style={{
    marginTop: "15px",
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "10px",
    background:
      selectedCandidate === candidate.id
        ? "#16a34a"
        : validated
        ? "#0f172a"
        : "#cbd5e1",
    color: "white",
    fontWeight: "bold",
    fontSize: "15px",
    cursor:
      validated && selectedCandidate !== candidate.id
        ? "pointer"
        : "not-allowed",
    transition: "0.3s",
  }}
>
  {selectedCandidate === candidate.id
    ? "✅ Suara Berhasil Dikirim"
    : "Pilih Kandidat"}
</button>
          </div>
        ))}
      </div>
      <div
  style={{
    marginTop: "60px",
    textAlign: "center",
    color: "#af4df5",
    fontSize: "14px",
    paddingBottom: "20px",
  }}
>
(c) AmbuPurple• Mei 2026
</div>
    </div>
  );
}