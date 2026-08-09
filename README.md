# 🌱 ECO LIFE

### Sustainable Living & Environmental Awareness Dashboard

**ECO LIFE** is a web-based sustainability dashboard designed to help users understand and monitor different aspects of their environmental impact, including **carbon footprint, energy consumption, water usage, daily habits, and overall eco performance**.

The project provides a simple and interactive dashboard where users can navigate through different sustainability modules and visualize their environmental activities in an organized way.

---

## 🌍 Project Overview

ECO LIFE aims to encourage people to adopt more sustainable habits by bringing important environmental metrics together in one place.

The dashboard includes dedicated sections for:

* 🌱 Carbon Footprint
* ⚡ Energy Usage
* 💧 Water Usage
* ♻️ Sustainable Habits
* 🏆 Leaderboard
* 🎁 Rewards
* ⚙️ Settings

The main dashboard provides an overview of carbon, energy, water and ECO Score information along with sections for trends, emissions breakdown, daily habits, personalized tips and recent activity.

---

## 🎯 Objectives

The main objectives of ECO LIFE are:

* To create awareness about environmental sustainability.
* To help users understand their carbon footprint.
* To monitor energy and water usage.
* To encourage sustainable daily habits.
* To provide a centralized environmental dashboard.
* To motivate users through rankings and rewards.
* To promote responsible and eco-friendly living.

---

## ✨ Key Features

### 📊 Dashboard

The main dashboard provides an overview of the user's environmental activities.

It includes:

* Carbon overview
* Energy overview
* Water overview
* ECO Score
* Carbon Footprint Trend
* Emissions Breakdown
* Energy This Week
* Daily Habits
* Personalized Tips
* Recent Activity

### 🌱 Carbon Footprint

The Carbon section focuses on tracking environmental emissions.

It contains sections such as:

* This Month
* Annual Pace
* Comparison with National Average
* Carbon Footprint Trend
* Emissions Breakdown

### ⚡ Energy

The Energy module provides an interface for monitoring energy-related information, including:

* Grid Usage
* Solar Generated
* Net Consumption
* CO₂ generated from energy usage
* Energy trends

### 💧 Water

The Water section is designed to monitor and present water-related consumption information through a dedicated dashboard interface.

### ♻️ Sustainable Habits

The Habits section focuses on everyday activities and their environmental impact.

It includes areas such as:

* Daily habits
* Energy-related habits
* CO₂ from habits
* Weekly activity information
* Habit trends

### 🏆 Leaderboard

The Leaderboard introduces a gamification element to encourage sustainable behavior.

It provides:

* User ranking
* Monthly performance
* Annual pace
* Comparison with national average
* 7-month trend
* Score comparison with top performers

### 🎁 Rewards

The Rewards section is designed to motivate users by connecting sustainable activities with a reward-based experience.

It includes categories related to:

* Car travel
* Flights
* Electricity
* Gas heating
* Diet
* Shopping
* Environmental trends and breakdowns

### 📱 Responsive Sidebar Navigation

ECO LIFE uses a reusable sidebar containing navigation options for all major sections:

* Dashboard
* Carbon
* Energy
* Water
* Habits
* Leaderboard
* Rewards
* Settings

The sidebar is loaded dynamically using JavaScript and can be opened or closed using the menu button.

---

## 🛠️ Technologies Used

### Frontend

* **HTML5** – Structure of the web pages
* **CSS3** – Styling, layout and responsive design
* **JavaScript** – Sidebar functionality and dynamic page behavior

### Project Structure

The project is currently implemented as a frontend web application using separate HTML, CSS and JavaScript files.

---

## 📂 Project Structure

```text
ECO_LIFE/
│
├── index.html
├── index.js
├── style.css
│
├── carbon.html
├── carbon.css
├── carbon.js
│
├── energy.html
├── energy.css
│
├── water.html
├── water.css
│
├── habits.html
├── habits.css
│
├── leaderboard.html
├── leaderboard.css
│
├── rewards.html
├── rewards.css
│
├── setting.html
├── setting.css
│
├── sidebar.html
├── sidebar.css
├── sidebar.js
│
└── README.md
```

> **Note:** The repository currently contains the corresponding HTML/CSS/JS files for the different modules.

---

## ⚙️ How to Run

Since ECO LIFE is a frontend web project, no backend installation or database setup is required for the current version.

### 1. Clone the repository

```bash
git clone https://github.com/Vishal-Mourya2892007/ECO_LIFE.git
```

### 2. Open the project

```bash
cd ECO_LIFE
```

### 3. Run the project

Open:

```text
index.html
```

in a web browser.

### Recommended

For development, you can use **VS Code** with the **Live Server** extension.

---

## 🚀 How It Works

The application starts from the main `index.html` dashboard.

The common sidebar is stored separately in `sidebar.html`. JavaScript fetches this file and inserts it into pages dynamically. The menu button then controls the sidebar visibility.

Users can navigate between different environmental modules through the sidebar.

```text
                    ┌─────────────────┐
                    │    ECO LIFE     │
                    │    Dashboard    │
                    └────────┬────────┘
                             │
       ┌──────────┬──────────┼──────────┬──────────┐
       ↓          ↓          ↓          ↓          ↓
    Carbon     Energy      Water      Habits    ECO Score
       │          │          │          │
       └──────────┴──────────┴──────────┘
                             │
                    ┌────────┴────────┐
                    ↓                 ↓
               Leaderboard         Rewards
```

---

## 💡 Why ECO LIFE?

Environmental sustainability is not only about large-scale policies; individual daily choices also contribute to environmental impact.

ECO LIFE attempts to make sustainability information:

* Easy to understand
* Easy to monitor
* Visually organized
* Motivating
* Accessible through a single dashboard

The combination of tracking, trends, rankings and rewards can help make sustainable living more engaging.

---

## 🔮 Future Scope

The current project can be extended into a complete sustainability platform.

Possible future improvements include:

* 🔐 User authentication and profiles
* 🗄️ Database integration
* 📈 Real-time environmental data
* 📊 Interactive charts and graphs
* 🤖 AI-based personalized sustainability recommendations
* 🌐 API integration for carbon-footprint calculations
* 📱 Progressive Web App / mobile version
* 🏅 Advanced reward and achievement system
* 🌍 Community-based environmental challenges
* 📍 Location-based sustainability recommendations
* ☁️ Cloud-based data synchronization

## 🛠️ Technologies Used

### 🎨 Frontend

* **HTML5** – Structure of the web application
* **CSS3** – Styling, layouts and responsive design
* **JavaScript** – Dynamic functionality and API communication

### ⚙️ Backend — Planned / In Development

The frontend version of ECO LIFE is currently being developed first. The next phase of the project will introduce a complete backend using:

* **Java** – Backend programming language
* **Spring Boot** – Backend framework
* **Spring Web / REST API** – Communication between frontend and backend
* **Spring Data JPA** – Database operations
* **Hibernate** – ORM for database interaction
* **MySQL** – Relational database
* **Maven** – Backend dependency and project management

### 🗄️ Planned Database

MySQL will be used to store and manage application data such as:

* User accounts
* User profiles
* Carbon footprint records
* Energy consumption
* Water consumption
* Sustainable habits
* ECO scores
* Leaderboard data
* Rewards and achievements
* User activity history

### 🔗 Planned Architecture

The planned application architecture will be:

```text
┌───────────────────────────────┐
│          Frontend             │
│                               │
│  HTML + CSS + JavaScript      │
└───────────────┬───────────────┘
                │
                │ REST API
                ▼
┌───────────────────────────────┐
│        Spring Boot Backend    │
│                               │
│  Java + Spring Web            │
│  Business Logic               │
│  Authentication               │
│  REST Controllers             │
│  Services                     │
│  Repositories                 │
└───────────────┬───────────────┘
                │
                │ JPA / Hibernate
                ▼
┌───────────────────────────────┐
│            MySQL              │
│                               │
│  Users                        │
│  Carbon Data                  │
│  Energy Data                  │
│  Water Data                   │
│  Habits                       │
│  Rewards                      │
│  Leaderboard                  │
└───────────────────────────────┘
```

---

## 🔮 Future Development

ECO LIFE is planned to evolve from a frontend dashboard into a complete full-stack sustainability platform.

### 🔐 1. User Authentication

A secure authentication system will be added using the Spring Boot backend.

Planned functionality:

* User registration
* Login / Logout
* User profiles
* Password management
* Session / token-based authentication

### 🗄️ 2. MySQL Database Integration

Currently, the project mainly focuses on the frontend interface.

In the next phase, MySQL will be connected with the Spring Boot backend to permanently store user and sustainability-related data.

### 🔌 3. REST API Integration

The frontend JavaScript code will communicate with the Spring Boot backend through REST APIs.

For example:

```text
GET    /api/users
POST   /api/users
GET    /api/carbon
POST   /api/carbon
GET    /api/energy
POST   /api/energy
GET    /api/water
POST   /api/water
GET    /api/habits
POST   /api/habits
GET    /api/leaderboard
GET    /api/rewards
```

### 📊 4. Dynamic Dashboard

After backend integration, dashboard values will no longer be static.

Data such as:

* Carbon footprint
* Energy consumption
* Water consumption
* ECO Score
* Monthly trends
* Recent activity

will be retrieved dynamically from the database through APIs.

### 🏆 5. Real Leaderboard

The leaderboard will be connected with user data stored in MySQL.

Users will be ranked according to their sustainability performance and ECO Score.

### 🎁 6. Reward System

A backend-powered reward system will be implemented where users can earn points and achievements by completing sustainable activities.

### 🤖 7. Smart Recommendations

In a later stage, the system can be extended with intelligent recommendations based on a user's:

* Carbon footprint
* Energy consumption
* Water usage
* Daily habits
* Previous activity

This can help users understand **where they can improve their environmental impact**.

---

## 🚧 Current Development Status

| Module                   | Status                    |
| ------------------------ | ------------------------- |
| Frontend Dashboard       | ✅ Completed / In Progress |
| Carbon Footprint UI      | ✅                         |
| Energy UI                | ✅                         |
| Water UI                 | ✅                         |
| Habits UI                | ✅                         |
| Leaderboard UI           | ✅                         |
| Rewards UI               | ✅                         |
| Responsive Sidebar       | ✅                         |
| JavaScript Functionality | 🔄 In Progress            |
| Spring Boot Backend      | 🔜 Planned                |
| REST APIs                | 🔜 Planned                |
| MySQL Database           | 🔜 Planned                |
| JPA / Hibernate          | 🔜 Planned                |
| User Authentication      | 🔜 Planned                |
| Dynamic Dashboard Data   | 🔜 Planned                |
| AI Recommendations       | 🔜 Future                 |

---

## 🚀 Planned Full-Stack Technology Stack

```text
Frontend
   │
   ├── HTML5
   ├── CSS3
   └── JavaScript
          │
          │ REST API
          ▼
Backend
   │
   ├── Java
   ├── Spring Boot
   ├── Spring Web
   ├── Spring Data JPA
   └── Hibernate
          │
          ▼
Database
   │
   └── MySQL
```

> **Note:** Spring Boot, Java and MySQL integration are part of the planned next phase of ECO LIFE development. The current repository primarily contains the frontend implementation.

## 🌱 Vision

> **"Small sustainable choices today can create a greener tomorrow."**

**ECO LIFE — Track. Improve. Sustain. 🌍**
