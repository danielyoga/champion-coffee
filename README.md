# Champion Coffee - Stacks Wallet Integration

**Smart Contract Address**: `ST1R6WTW58RQFZPMMFYHZA663838XZDW1RVXC58N9.umkm-alliance-1`

## Project: Champion Coffee - UMKM Alliance Platform

### 🎯 Problem Statement

**Masalah di Indonesia:**
- UMKM (Usaha Mikro, Kecil, dan Menengah) di Indonesia menghadapi kesulitan dalam mengakses modal, teknologi, dan pasar yang lebih luas
- Terbatasnya akses ke sistem pembayaran digital dan infrastruktur teknologi yang modern
- Kurangnya transparansi dan kepercayaan dalam transaksi bisnis antar UMKM
- Sulitnya tracking dan verifikasi produk dari hulu ke hilir

**Siapa yang terdampak?**
- UMKM di sektor makanan dan minuman, khususnya kopi
- Konsumen yang ingin mendapatkan produk berkualitas dengan transparansi
- Ekosistem UMKM yang membutuhkan kolaborasi dan dukungan

**Mengapa masalah ini penting?**
- UMKM merupakan tulang punggung perekonomian Indonesia (99.9% dari total usaha)
- Potensi pertumbuhan ekonomi yang besar jika UMKM dapat dioptimalkan
- Kebutuhan akan sistem yang adil dan transparan untuk semua pihak

**Current Solution & Limitations:**
- Sistem konvensional bergantung pada perantara dan lembaga keuangan tradisional
- Kurangnya transparansi dalam rantai pasok dan pembayaran
- Biaya transaksi yang tinggi dan waktu penyelesaian yang lama
- Sulitnya verifikasi keaslian produk dan kualitas

### 💡 Solution Overview

**Smart Contract Solution:**
- Menggunakan blockchain Stacks untuk menciptakan ekosistem UMKM yang terdesentralisasi
- Smart contract memastikan transparansi dan kepercayaan dalam setiap transaksi
- Sistem reward dan governance yang adil untuk semua partisipan
- Integrasi wallet untuk pembayaran yang aman dan cepat

**Mengapa lebih baik dari solusi konvensional?**
- Transparansi penuh dalam setiap transaksi
- Pengurangan biaya perantara dan transaksi
- Keamanan dan immutability data
- Akses global tanpa batasan geografis

**Value Proposition:**
- **Benefit untuk user**: Akses mudah ke produk berkualitas, pembayaran aman, dan transparansi penuh
- **Benefit untuk ecosystem**: Pertumbuhan UMKM yang berkelanjutan, kolaborasi antar pelaku usaha, dan inovasi teknologi

---

A modern coffee ordering platform built with Next.js and integrated with Stacks blockchain for seamless wallet connectivity.

## 🚀 Features

- **Stacks Wallet Integration**: Connect your Stacks wallet to access the platform
- **Role-Based Access**: Choose between Customer and Jagoan (Merchant) roles
- **Customer Dashboard**: Browse and order premium coffee with wallet-based payments
- **Jagoan Dashboard**: Merchant interface for managing coffee sales and transfers
- **Real-time Balance**: View your STX balance and transaction history
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Blockchain**: Stacks (@stacks/connect, @stacks/network, @stacks/transactions)
- **Package Manager**: npm

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/danielyoga/champion-coffee.git
cd champion-coffee
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔗 Wallet Integration

The platform integrates with Stacks wallets using the `@stacks/connect` library:

- **Connect Wallet**: Click "Connect Wallet to Order" or "Connect Wallet to Join" to connect your Stacks wallet
- **View Balance**: See your STX balance in real-time
- **Transaction History**: Track your coffee purchases and transfers
- **Secure Transactions**: All transactions are signed through your connected wallet

## 🎯 Usage

### For Customers:
1. Connect your Stacks wallet
2. Browse available coffee options
3. Top up your balance using STX
4. Place orders and track your purchases

### For Jagoans (Merchants):
1. Connect your Stacks wallet
2. Register as a Jagoan
3. Manage your coffee inventory
4. Process customer orders and transfers

## 🏗️ Project Structure

```
kopi-jago-website/
├── app/                    # Next.js app directory
│   ├── customer/          # Customer dashboard
│   ├── jagoan/           # Jagoan dashboard
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable UI components
│   └── ui/              # shadcn/ui components
├── hooks/               # Custom React hooks
│   └── use-stacks.ts    # Stacks wallet integration
├── lib/                 # Utility functions
│   └── stx-utils.ts     # Stacks blockchain utilities
├── public/              # Static assets
└── styles/              # Additional styles
```

## 🔧 Configuration

The Stacks integration is configured in `hooks/use-stacks.ts`:

- **App Name**: "Champion Coffee"
- **Network**: Testnet (configurable)
- **Permissions**: `store_write` for transaction signing

## 🚀 Deployment

The project can be deployed to Vercel, Netlify, or any other Next.js-compatible platform:

```bash
npm run build
npm start
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support or questions, please open an issue on GitHub or contact the development team.

---

Built with ❤️ for the Stacks community
