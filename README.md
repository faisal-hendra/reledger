<div align="center">
  <img width=10% alt="Image" src="https://github.com/user-attachments/assets/70df47ef-b16c-43be-b9ec-246d07089683" />
  <h1>Reledger</h1>
  <p>A personal ledger and financial journaling desktop application built with Electron, React, and TypeScript.</p>
    <p>
    <img src="https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=electron&logoColor=white" alt="Electron" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  </p>
 
  <p>
    <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS-lightgrey?style=flat-square" alt="Platform" />
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
    <img src="https://img.shields.io/badge/status-early%20public%20testing-orange?style=flat-square" alt="Status" />
  </p>
</div>

<img width="auto" height="auto"  alt="Screenshot 2026-03-27 at 08 35 22" src="https://github.com/user-attachments/assets/2d1c65e1-6872-4971-aa61-f2d66ffaf0d2" />

> [!NOTE]
> This project is currently in early public testing. Core features are functional, but additional features and improvements are being added. Expect bugs and/or incomplete implementations.

## Motivation

This project started as a way form me to learn React, TypeScript, and Electron. I wanted something simpler than a spreadsheet for tracking my personal finances. Most apps in this space are either mostly for mobile or require an internet connection. Reledger is 100% local, lightweight (for an Electron app), and does exactly what I need.

## ✨ Features

<details>
<summary><strong>📊 Dashboard</strong></summary>

- **Financial Overview**: View total balance, income, and expenses at a glance

- **Month-over-Month Comparison**: Track percentage changes from the previous month

- **Interactive Charts**: Monthly income/expense trend visualization and category breakdown pie chart

- **Quick Stats**: A summary of your monthly transaction count, average daily expenses, and top spending category

- **Recent Transactions**: Quick view of your latest 5 transactions

- **Filtering**: Filter data by year and month

</details>

<details>
<summary><strong>💸 Transactions</strong></summary>

- **CRUD Operations**: Add, view, edit, and delete transactions

- **Transaction Types**: Support for both income and expense entries

- **Categories**: Predefined expense categories for organization

- **Advanced Filtering**:

- Filter by month/year

- Search by keyword

- Filter by category

- **Data Table**: Sortable transaction list

- **CSV Export**: Download filtered or full transaction history as a CSV file

</details>

## 🚧 Current Limitations

- [ ] Spending targets / budget limits (planned for future release)

- [ ] CSV export uses a comma as the column separator by default. An option to change this to a semicolon will be added in the future release.

## Known Issues

On **Windows 11**, when a date mismatch warning occurs, the application may not detect the correction immediately after you update your system date. Please wait a few moments before clicking Retry to continue.

---

## 🛠️ Tech Stack

<div align="center">

| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/electron/electron-original.svg" width="48"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" width="48"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="48"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="48"/> |
|:---:|:---:|:---:|:---:|
| **Electron** | **Vite** | **React 19** | **TypeScript** |
| Desktop runtime | Lightning-fast dev server | UI framework | Type-safe JS |

| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" width="48"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" width="48"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="48"/> |
|:---:|:---:|:---:|
| **Tailwind CSS** | **SQLite** | **Node.js** |
| Utility-first styling | Local database | Runtime |

</div>

---

## 📦 Installation

Download the latest release from the **[Releases page](https://github.com/faisal-hendra/reledger/releases/latest)**.

<div align="center">

| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg" width="48"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" width="48"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" width="48"/> |
|:---:|:---:|:---:|
| **Windows** | **macOS** | **Linux** |
| Download the `.exe` installer for your CPU architecture (AArch64 or x86_64), run it, and launch from the Start menu. | Download the `.dmg` file *(Apple Silicon only)*, drag **Reledger** into your Applications folder, and launch. | No prebuilt package yet. Build from source — see the [Development](#-development) section below. |

</div>

## Development

### Prerequisites

- Node.js (v18 or higher recommended)

- npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/faisal-hendra/reledger.git

cd reledger
```

2. Install dependencies:

```bash
npm install
```

3. Start in development mode:

```bash
npm run dev
```

### Build for Production

```bash
# Build for Windows
npm  run  build:win

# Build for macOS
npm  run  build:mac

# Build for Linux
npm  run  build:linux
```

## 🗄️ Database Schema

Transactions are stored in a local SQLite database with the following fields:

| Field | Type | Description |
|---|---|---|
| `id` | `INTEGER` `PK` | Auto-incrementing primary key |
| `transaction_type` | `TEXT` | `"expense"` or `"income"` |
| `name` | `TEXT` | Transaction name |
| `amount` | `NUMERIC` | Transaction amount |
| `category` | `TEXT` | Category label |
| `description` | `TEXT` | Optional notes |
| `date` | `TEXT` | Transaction date |
| `created_at` | `TEXT` | Auto-generated timestamp |

The file that stores the database itself is named `reledger.sqlite`

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) with the following extensions:
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## 📜 License

MIT License
