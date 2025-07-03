// Lokasi file: /api/contact.js di dalam proyek backend Anda

const nodemailer = require('nodemailer');

// Ini adalah "pembungkus" yang menambahkan header izin (CORS)
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ===================================================================
  // BAGIAN INI ADALAH KUNCI PERBAIKANNYA
  // Menangani 'surat izin' (pre-flight request) dari browser
  if (req.method === 'OPTIONS') {
    res.status(200).end(); // Jawab 'OK' dan hentikan proses
    return;
  }
  // ===================================================================

  return await fn(req, res);
};

// Handler utama Anda untuk mengirim email
async function handler(req, res) {
  // Pengecekan ini sekarang hanya akan berjalan untuk request selain OPTIONS
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Hanya metode POST yang diizinkan' });
  }

  try {
    const { name, email, message } = req.body;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: name,
        to: process.env.EMAIL_USER,
        subject: `Pesan Baru dari Landing Page MBC dari ${name}`,
        html: `<p>Nama: ${name}</p><p>Email: ${email}</p><p>Pesan: ${message}</p>`,
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ status: 'SUCCESS', message: 'Pesan berhasil dikirim!' });
  } catch (error) {
    console.error('Error di server Nodemailer:', error);
    return res.status(500).json({ status: 'FAIL', message: 'Gagal mengirim email dari server.' });
  }
}

// Export handler yang sudah dibungkus dengan allowCors
export default allowCors(handler);
