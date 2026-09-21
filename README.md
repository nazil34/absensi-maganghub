# Absen Maganghub

Generator laporan harian magang berbasis AI. Cukup tulis catatan kegiatan secara singkat dan informal, lalu aplikasi akan menyusunnya menjadi tiga bagian laporan: **Uraian Aktivitas**, **Pembelajaran yang Diperoleh**, dan **Kendala yang Dialami**.

Hasil laporan dapat langsung diedit, disalin, dan ditempelkan ke form logbook Maganghub.

## 📌 Latar Belakang

Peserta magang di Maganghub perlu mengisi logbook harian yang terdiri dari uraian kegiatan, pembelajaran yang diperoleh, dan kendala yang dialami. Setiap bagian memiliki ketentuan minimal 100 karakter.

Menulis laporan dengan format tersebut setiap hari dapat memakan waktu, terutama ketika catatan kegiatan yang tersedia masih berupa poin-poin singkat. Mengandalkan prompting manual ke AI juga kurang efisien karena pengguna perlu menuliskan instruksi yang sama berulang kali.

**Absen Maganghub** dibuat untuk mengotomatisasi proses tersebut. Pengguna cukup memasukkan catatan kegiatan sehari-hari, baik dalam bentuk singkat maupun informal. AI kemudian mengolahnya menjadi laporan yang lebih terstruktur dan memenuhi ketentuan minimal karakter.

## ⚙️ Cara Kerja

1. Isi kolom **Aktivitas** dengan catatan kegiatan hari ini. Catatan dapat ditulis secara singkat dan informal.
2. Isi kolom **Pembelajaran** dan **Kendala** jika ada. Kedua kolom ini bersifat opsional.
3. Klik **Buat Laporan**. Data akan dikirim ke endpoint `POST /api/generate`, kemudian diproses menggunakan Groq dengan model yang ditentukan melalui environment variable.
4. AI menghasilkan tiga bagian laporan: **Uraian Aktivitas**, **Pembelajaran yang Diperoleh**, dan **Kendala yang Dialami**.
5. Jika salah satu bagian belum memenuhi batas minimal 100 karakter, sistem akan menjalankan proses **repair** satu kali untuk memperbaiki hasil tersebut.
6. Hasil laporan dapat diedit secara langsung, dibuat ulang menggunakan fitur **Regenerate**, atau disalin untuk digunakan pada form logbook Maganghub.

## ✨ Fitur

- ✍️ Mengubah catatan kegiatan informal menjadi laporan yang lebih terstruktur
- 🤖 Generasi laporan menggunakan AI melalui Groq API
- 📋 Menghasilkan tiga bagian laporan secara otomatis
- 🔄 Regenerate laporan
- ✏️ Mengedit hasil laporan secara langsung
- 📏 Validasi minimal 100 karakter untuk setiap bagian
- 🛡️ Validasi input dan output menggunakan Zod
- 🚦 Rate limiting sederhana berdasarkan IP
- 🔒 Tidak memerlukan login atau database
- 💾 Tidak menyimpan riwayat laporan

## 🛠️ Stack

- **Next.js 16** dengan App Router
- **TypeScript**
- **Tailwind CSS 4**
- **Groq API** (`chat/completions` dengan JSON mode)
- **Zod** untuk validasi input dan output
- **In-memory rate limiting** berdasarkan IP untuk membatasi request pada single-instance deployment

## 📁 Struktur Proyek

```text
app/
  page.tsx                 # Halaman utama: form dan hasil laporan
  api/
    generate/
      route.ts             # Endpoint untuk memproses request dan memanggil Groq

components/                # Komponen UI: form, hasil laporan, tombol, counter, alert

lib/
  groq/                    # Groq client serta logic generate dan repair laporan
  prompt/                  # System prompt dan prompt builder
  validation/              # Skema Zod untuk request dan output model

types/
  report.ts                # Tipe data request dan response
