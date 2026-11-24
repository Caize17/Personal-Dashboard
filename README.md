# My Dashboard

A local-first, all-in-one personal productivity, finance, academic, and credential management desktop dashboard built with **React** and **Tauri**. Designed to run offline directly on your laptop with native desktop notifications and multi-theme support.

---

## ✨ Features

### 🏠 Home Overview
* **Greeting & Daily Motivation:** Dynamic time-based greeting paired with daily motivational quotes.
* **Live Local Clock & Weather:** Real-time Philippine Standard Time (`PH TIME`) clock and local weather summary widget.
* **Incoming Deadlines & Agenda:** Unified overview of active deadlines across bills, tasks, and coursework alongside upcoming scheduled routines and events.
* **Progress & Goals:** Interactive radial progress tracker with quick toggles for **Academics**, **Tasks**, and **Savings**.
* **Daily Tasks & Priority Reminders:** Filterable Master To-Do List (`All Categories`, `+ Add Task`) and Priority Reminders panel (`Set Alert`) with native desktop alert support.

### 🔐 Accounts Vault
* **Categorized Credential Storage:** Organize saved logins across customizable categories (`Academic`, `Finance`, `Design`, `Social`, `Entertainment`, `General`)[cite: 3].
* **Quick Management:** Add new accounts (`+ New Account`) and customize category filters (`Edit Categories`) locally.

### 💰 Personal Finance Tracker
* **Financial Summary Cards:** Track **Total Net Worth** (`₱`), **Monthly Inflow**, **Monthly Outflow** (with remaining budget indicator), and recurring **Subscriptions** (`/mo`).
* **Multi-Tab Ledger:** Dedicated views for **Transactions** (Income & Expenses with type filters), **Subscriptions**, **Savings Goals**, **Bill Reminders**, and **Financial Accounts**.

### 🎓 Academic Hub
* **Academic Metrics:** Monitor **Assignments Due** (with high-priority deliverable counts), **Completed Tasks**, **Weekly Classes**, and **Course Resources**.
* **Weekly Class Schedule:** Monday-through-Friday timetable grid (`+ Add Class`) alongside dedicated tabs for **Assignments** and **Course Resources**.

### 🎨 Themes & Desktop Experience
* **Customizable Themes:** Switch between multiple built-in visual themes (Dark Cosmic, Soft Pastel Light, and Sky Blue) with instant feedback.
* **Local-First & Offline:** Stores data locally on your machine and packages cleanly into a lightweight standalone Windows desktop app via Tauri.

---

## 🛠️ Tech Stack

* **Frontend:** React, JavaScript / TypeScript, CSS
* **Desktop Runtime:** Tauri (Rust + Windows WebView2)
* **Local Storage & Alerts:** Browser/WebView local persistence & Tauri Native Notification API

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+ recommended)
* [Rust & Cargo](https://www.rust-lang.org/tools/install) (with the `stable-x86_64-pc-windows-msvc` toolchain)
* Microsoft Visual Studio C++ Build Tools & WebView2 (pre-installed on Windows 11)

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/your-username/my-dashboard.git](https://github.com/your-username/my-dashboard.git)
   cd my-dashboard
   ```

# Run in Desktop Development Mode (with Live Reload)
   ```bash
   npm run tauri dev
   ```

# Build the Standalone Desktop Application
   ```bash
   npm run tauri build
   ```

The compiled .exe and installer will be generated inside src-tauri/target/release/bundle/.

## 📄 License
This project is built for personal productivity use. Feel free to customize and adapt it for your own workflow.
