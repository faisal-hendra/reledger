<div align="center">
  <img width=10% alt="Image" src="https://github.com/user-attachments/assets/70df47ef-b16c-43be-b9ec-246d07089683" />
  <h1>Reledger</h1>
  <p>A personal ledger and financial journaling desktop application built with Electron, React, and TypeScript.</p>
</div>

<img width="auto" height="auto" alt="Image" src="https://github.com/user-attachments/assets/eb61faba-83bf-44f5-96ee-46143ffa89a5" />

> **Note**: This project is currently in early public testing. Core features are functional, but additional features and improvements are being added. Expect bugs and/or incomplete implementations.

## Motivation

This project started as a way form me to learn React, TypeScript, and Electron. I wanted something simpler than a spreadsheet for tracking my personal finances. Most apps in this space are either mostly for mobile or require an internet connection. Reledger is 100% local, lightweight (for an Electron app), and does exactly what I need.

## Features

### Dashboard

- **Financial Overview**: View total balance, income, and expenses at a glance

- **Month-over-Month Comparison**: Track percentage changes from the previous month

- **Interactive Charts**: Monthly income/expense trend visualization and category breakdown pie chart

- **Quick Stats**: A summary of your monthly transaction count, average daily expenses, and top spending category

- **Recent Transactions**: Quick view of your latest 5 transactions

- **Filtering**: Filter data by year and month

### Transactions

- **CRUD Operations**: Add, view, edit, and delete transactions

- **Transaction Types**: Support for both income and expense entries

- **Categories**: Predefined expense categories for organization

- **Advanced Filtering**:

- Filter by month/year

- Search by keyword

- Filter by category

- **Data Table**: Sortable transaction list

- **CSV Export**: Download filtered or full transaction history as a CSV file

## Current Limitations

- [ ] Spending targets / budget limits (planned for future release)

- [ ] CSV export uses a comma as the column separator by default. An option to change this to a semicolon will be added in the future release.

## Known Issues

On **Windows 11**, when a date mismatch warning occurs, the application may not detect the correction immediately after you update your system date. Please wait a few moments before clicking Retry to continue.

## Tech Stack

- **Framework**: Electron, Vite

- **Frontend**: React 19, TypeScript

- **UI**: Radix UI, Tailwind CSS, shadcn/ui components

- **Database**: Better-SQLite3 (SQLite)

- **Routing**: React Router DOM

- **Charts**: Recharts

- **Icons**: Lucide React, React Icons

- **Date Handling**: Day.js

## Installation
Download the latest version for your platform from the [Releases](https://github.com/faisal-hendra/reledger/releases/latest) page.

### Windows
1. Download the `.exe` installer, make sure you download the one that fits your CPU architecture (AArch64 or x86_64)
2. Run the installer
3. Launch the app from the start menu and that's it!

### macOS
1. Download the `.dmg` file (This release currently supports Apple Silicon Macs only)
2. Open the DMG and drag the app icon into your **Applications** folder
3. Launch the app from your Applications folder, as simple as that!

### Linux: 
No prebuilt package is available yet. If you'd like to run the app on Linux, you can build it from source — see the Development section below for instructions.

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

## Database Schema

Transactions are stored in a local SQLite database with the following fields:

- `id`: Auto-incrementing primary key

- `transaction_type`: "expense" or "income"

- `name`: Transaction name

- `amount`: Numeric amount

- `category`: Category label

- `description`: Optional notes

- `date`: Transaction date

- `created_at`: Auto-generated timestamp

The file that stores the database itself is named `reledger.sqlite`

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## License

MIT License
