# Reledger

A personal ledger and financial journaling desktop application built with Electron, React, and TypeScript (Work In Progress).

<img width="auto" height="auto" alt="Image" src="https://github.com/user-attachments/assets/7ecff224-9cac-4191-99bc-5258c9c12508" />

> **Note**: This project is currently in active development. Core features are functional, but additional features and improvements are being added. Expect bugs and/or incomplete implementations. Currently only USD is supported. Multi-currency support is planned for a future release.

## Motivation

This project started as a way form me to learn React, TypeScript, and Electron. I wanted something simpler than a spreadsheet for tracking my personal finances. Most apps in this space are either mostly for mobile or require an internet connection. Reledger is 100% local, lightweight (for an Electron app), and does exactly what I need.

## Features

### Dashboard

- **Financial Overview**: View total balance, income, and expenses at a glance
- **Month-over-Month Comparison**: Track percentage changes from the previous month
- **Interactive Charts**:
  - Monthly income/expense trend visualization
  - Category breakdown pie chart
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

- [ ] Multi-currency support (currently USD only)
- [ ] Multi-theme support (currently Dark Mode only)
- [ ] Spending targets / budget limits (planned for future release)
- [ ] Backend pagination (current frontend-only pagination may slow down with large datasets)

## Tech Stack

- **Framework**: Electron, Vite
- **Frontend**: React 19, TypeScript
- **UI**: Radix UI, Tailwind CSS, shadcn/ui components
- **Database**: Better-SQLite3 (SQLite)
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React, React Icons
- **Date Handling**: Day.js

## Getting Started

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
npm run build:win

# Build for macOS
npm run build:mac

# Build for Linux
npm run build:linux
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
