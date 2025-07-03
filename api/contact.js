// File: /api/contact.js (Versi Final dengan Sintaks ES Module)

import nodemailer from 'nodemailer'; // <-- PERUBAHAN UTAMA ADA DI SINI

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

async function handler(req, res) {
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
    console.error(error);
    return res.status(500).json({ status: 'FAIL', message: 'Gagal mengirim email dari server.' });
  }
}

export default allowCors(handler);
