const blacklistMembers = [
  {
    nama: "Aldy",
    nickname: "dxhmm-X5",
    pelanggaran: "Out community",
    outDate: "2025-07-09",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Diah",
    nickname: "ImperfectX5",
    pelanggaran: "Out community",
    outDate: "2025-08-09",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Yuliana",
    nickname: "-HoliciaX5-",
    pelanggaran: "Out community",
    outDate: "2025-09-20",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Samuel",
    nickname: "Os-SilentX5",
    pelanggaran: "Out community",
    outDate: "2025-10-25",
    duration: 3 // Durasi dalam bulan
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
    pelanggaran: "Out community",
    outDate: "2025-09-24",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Firdan",
    nickname: "lucieneeX5-yX",
    pelanggaran: "Out Community",
    outDate: "2025-09-18",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Aini",
    nickname: "ImAvriellX5",
    pelanggaran: "Out Community",
    outDate: "2025-09-30",
    duration: 6 // Durasi dalam bulan
  },
  {
    nama: "Ghaffar",
    nickname: "TjxyfarX5-",
    pelanggaran: "Out Community",
    outDate: "2025-10-03",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Ivan",
    nickname: "Schatzvan-X5",
    pelanggaran: "Out Community",
    outDate: "2025-10-03",
    duration: 6 // Durasi dalam bulan
  },
  {
    nama: "Tasya",
    nickname: "SYASYA-X5",
    pelanggaran: "Out Community",
    outDate: "2025-10-05",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Bobby",
    nickname: "kwwgX5",
    pelanggaran: "Out community",
    outDate: "2025-09-29",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Andika",
    nickname: "Hxyuth1FcX5-DZ",
    pelanggaran: "Out community",
    outDate: "2025-10-06",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "icha",
    nickname: "xychaX5-",
    pelanggaran: "Out community",
    outDate: "2025-10-07",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Rizky",
    nickname: "SimpleFleuRF-X5",
    pelanggaran: "Out community",
    outDate: "2025-10-09",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Devin",
    nickname: "pynutzX5-xB",
    pelanggaran: "Out community",
    outDate: "2025-10-09",
    duration: 3 // Durasi dalam bulan
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
    pelanggaran: "Out community",
    outDate: "2025-10-11",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Ussy",
    nickname: "FTrust-X5",
    pelanggaran: "Out community",
    outDate: "2025-10-13",
    duration: 3 // Durasi dalam bulan
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
    pelanggaran: "Out community",
    outDate: "2025-10-14",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Deswin",
    nickname: "Wins-X5",
    pelanggaran: "Out community",
    outDate: "2025-10-15",
    duration: 6 // Durasi dalam bulan
  },
  {
    nama: "Fadil",
    nickname: "StarX51Fc-BTR",
    pelanggaran: "Out community",
    outDate: "2025-10-17",
    duration: 3 // Durasi dalam bulan
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
    pelanggaran: "Out community",
    outDate: "2025-10-25",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Cakra",
    nickname: "oxskyFv-X5",
    pelanggaran: "Out community",
    outDate: "2025-10-29",
    duration: 6 // Durasi dalam bulan
  },
  {
    nama: "Mbew",
    nickname: "MbeawsL-X5",
    pelanggaran: "Out community karena",
    outDate: "2025-10-31",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Renaldo",
    nickname: "asTDoqiw-X5",
    pelanggaran: "Out community",
    outDate: "2025-10-31",
    duration: 6 // Durasi dalam bulan
  },
  {
    nama: "Alfi",
    nickname: "YopiewX5-TD",
    pelanggaran: "Out Community",
    outDate: "2025-11-11",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Owen",
    nickname: "HohiX5",
    pelanggaran: "Out Community",
    outDate: "2025-11-12",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Ara",
    nickname: "LovemoreX5-666",
    pelanggaran: "Out Community putus cinta dengan Fasky",
    outDate: "2025-11-12",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Ira",
    nickname: "ScraperX5",
    pelanggaran: "Out Community",
    outDate: "2025-11-16",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Tere",
    nickname: "awTantrum-X5",
    pelanggaran: "Out Community",
    outDate: "2025-11-17",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Jov",
    nickname: "Maive-X5",
    pelanggaran: "Out Community",
    outDate: "2025-11-20",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Luki",
    nickname: "-K141-X5",
    pelanggaran: "Out Community",
    outDate: "2025-11-20",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Clay",
    nickname: "-Druig-X5",
    pelanggaran: "Out Community",
    outDate: "2025-11-21",
    duration: 3 // Durasi dalam bulan
  },
  {
    nama: "Maviss",
    nickname: "DunkinX5-FLz",
    pelanggaran: "Out Community",
    outDate: "2025-11-24",
    duration: 3 // Durasi dalam bulan
  }
];
