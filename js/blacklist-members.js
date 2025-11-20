const blacklistMembers = [
  {
    nama: "Aldy",
    nickname: "dxhmm-X5",
    pelanggaran: "Out community tidak ada alasan",
    outDate: "2025-07-09",
    duration: "permanent"
  },
  {
    nama: "Diah",
    nickname: "ImperfectX5",
    pelanggaran: "Out community tidak ada alasan",
    outDate: "2025-03-09",
    duration: "permanent"
  },
  {
    nama: "Yuliana",
    nickname: "-HoliciaX5-",
    pelanggaran: "Out community putus cinta dengan Sadam",
    outDate: "2025-07-20",
    duration: "permanent"
  },
  {
    nama: "Samuel",
    nickname: "Os-SilentX5",
    pelanggaran: "Out community tidak ada alasan",
    outDate: "-",
    duration: "permanent"
  },
  {
    nama: "Umam",
    nickname: "pecel-X5",
    pelanggaran: "Blacklist penipuan transaksi tidak bayar micash gift",
    outDate: "2025-06-09",
    duration: "permanent"
  },
  {
    nama: "Ryan",
    nickname: "AFK-X5",
    pelanggaran: "Out community merasa tidak cocok dengan dirinya",
    outDate: "2025-09-24",
    duration: "permanent"
  },
  {
    nama: "Rexel",
    nickname: "CliverX5-",
    pelanggaran: "Warning SP-1 program ilegal disaat club battle",
    outDate: "2025-08-27",
    duration: 1
  },
  {
    nama: "Firdan",
    nickname: "lucieneeX5-yX",
    pelanggaran: "Out Community karena tidak cocok",
    outDate: "2025-09-18",
    duration: "permanent"
  },
  {
    nama: "Aini",
    nickname: "ImAvriellX5",
    pelanggaran: "Out Community putus cinta dengan Ramsky",
    outDate: "2025-09-30",
    duration: "permanent"
  },
  {
    nama: "Ghaffar",
    nickname: "TjxyfarX5-",
    pelanggaran: "Out Community putus cinta dengan Icha",
    outDate: "2025-10-03",
    duration: "permanent"
  },
  {
    nama: "Ivan",
    nickname: "Schatzvan-X5",
    pelanggaran: "Out Community Pensi/Vakum",
    outDate: "2025-10-03",
    duration: "permanent"
  },
  {
    nama: "Tasya",
    nickname: "SYASYA-X5",
    pelanggaran: "Out Community Pensi/Vakum",
    outDate: "2025-10-05",
    duration: "permanent"
  },
  {
    nama: "Erwin",
    nickname: "nyxShiverX5",
    pelanggaran: "Warning SP-1 chat CPL orang di luar X5 membuat risih",
    outDate: "2025-10-05",
    duration: 1
  },
  {
    nama: "Bobby",
    nickname: "kwwgX5",
    pelanggaran: "Out community tidak ada alasan",
    outDate: "2025-09-29",
    duration: "permanent"
  },
  {
    nama: "Andika",
    nickname: "Hxyuth1FcX5-DZ",
    pelanggaran: "Out community tidak ada alasan",
    outDate: "2025-10-06",
    duration: "permanent"
  },
  {
    nama: "icha",
    nickname: "xychaX5-",
    pelanggaran: "Out community karena mau pindah divisi",
    outDate: "2025-10-07",
    duration: "permanent"
  },
  {
    nama: "Rizky",
    nickname: "SimpleFleuRF-X5",
    pelanggaran: "Out community tidak ada alasan",
    outDate: "2025-10-09",
    duration: "permanent"
  },
  {
    nama: "Devin",
    nickname: "pynutzX5-xB",
    pelanggaran: "Out community tidak ada alasan",
    outDate: "2025-10-09",
    duration: "permanent"
  },
  {
    nama: "Yulia",
    nickname: "yuppyAMC-X5 / Babyy-X5",
    pelanggaran: "Blacklist community karena problem matik",
    outDate: "2025-10-11",
    duration: "permanent"
  },
  {
    nama: "hens",
    nickname: "-hensX5",
    pelanggaran: "Out community tidak ada alasan",
    outDate: "2025-10-11",
    duration: "permanent"
  },
  {
    nama: "Ussy",
    nickname: "FTrust-X5",
    pelanggaran: "Out community karena vakum cukup lama",
    outDate: "2025-10-13",
    duration: "permanent"
  },
  {
    nama: "Chandra",
    nickname: "Chennn-X5",
    pelanggaran: "Blacklist community karena fake photo",
    outDate: "2025-10-14",
    duration: "permanent"
  },
  {
    nama: "Sanny",
    nickname: "aLx-MatchaX5",
    pelanggaran: "Out community karena vakum cukup lama",
    outDate: "2025-10-14",
    duration: "permanent"
  },
  {
    nama: "Deswin",
    nickname: "Wins-X5",
    pelanggaran: "Out community fokus real",
    outDate: "2025-10-15",
    duration: "permanent"
  },
  {
    nama: "Fadil",
    nickname: "StarX51Fc-BTR",
    pelanggaran: "Out community karena tidak bisa berbaur",
    outDate: "2025-10-17",
    duration: "permanent"
  },
  {
    nama: "Imary",
    nickname: "soheeFv-X5",
    pelanggaran: "Blacklist community (GA NERIMA GAY)",
    outDate: "2025-10-18",
    duration: "permanent"
  },
  {
    nama: "HanTan",
    nickname: "YoSEOBX5",
    pelanggaran: "Out community karena tidak bisa berbaur",
    outDate: "2025-10-25",
    duration: "permanent"
  },
  {
    nama: "Cakra",
    nickname: "oxskyFv-X5",
    pelanggaran: "Out community tidak ada alasan",
    outDate: "2025-10-29",
    duration: "permanent"
  },
  {
    nama: "Mbew",
    nickname: "MbeawsL-X5",
    pelanggaran: "Out community karena tidak bisa berbaur",
    outDate: "2025-10-31",
    duration: "permanent"
  },
  {
    nama: "Renaldo",
    nickname: "asTDoqiw-X5",
    pelanggaran: "Hanya ingin keluar",
    outDate: "2025-10-31",
    duration: "permanent"
  },
  {
    nama: "Alfi",
    nickname: "YopiewX5-TD",
    pelanggaran: "Out Community jarang main",
    outDate: "2025-11-11",
    duration: "permanent"
  },
  {
    nama: "Owen",
    nickname: "HohiX5",
    pelanggaran: "Out Community",
    outDate: "2025-11-12",
    duration: "permanent"
  },
  {
    nama: "Ara",
    nickname: "LovemoreX5-666",
    pelanggaran: "Out Community putus cinta dengan Fasky",
    outDate: "2025-11-12",
    duration: "permanent"
  },
  {
    nama: "Ira",
    nickname: "ScraperX5",
    pelanggaran: "Out Community",
    outDate: "2025-11-16",
    duration: "permanent"
  },
  {
    nama: "Tere",
    nickname: "awTantrum-X5",
    pelanggaran: "Out Community",
    outDate: "2025-11-17",
    duration: "permanent"
  }
];
