# ⚡ Volt-Trace: Autonomous Digital Carbon Footprint Analyzer

Volt-Trace is a cutting-edge web application designed to measure, analyze, and visualize the environmental impact of the digital world. By calculating the energy consumption and carbon emissions of websites, it empowers developers and users to make more sustainable digital choices.

---

## 🚀 Key Features

- **Real-Time Analysis**: Calculate carbon emissions based on page weight, DOM complexity, and network traffic.
- **Dynamic Visualization**: Interactive Bar and Pie charts powered by **Recharts** for clear data interpretation.
- **Energy Grid Simulator**: Test emissions against different global grids to see geographic impact.
- **Comparative Benchmarking**: Compare two websites side-by-side to identify more efficient designs.
- **Cyberpunk Aesthetics**: A premium, high-performance UI designed for modern web explorers.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: React Hooks & Context API
- **Backend Integration**: Python-based Carbon Calculation Engine (Axios)

---

## 📁 Project Structure

```text
volt-trace-main/
├── app/                # Application logic (Pages, Layouts, and Global Styles)
├── public/             # Static assets (icons and SVGs)
├── next.config.ts      # Next.js configuration
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

---

## 📦 Getting Started

### **Prerequisites**
- Node.js 18.x or higher
- npm or bun

### **Installation**
```bash
npm install
# or
bun install
```

### **Run Development Server**
```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📚 Literature Review & Research Resources

The concept of a "digital carbon footprint" is a rapidly growing field of study in tech, especially as websites get heavier and AI data centers expand. The following resources serve as a foundation for this project's architecture and problem statement.

### 📺 YouTube Videos & Channels
1. **"The carbon footprint of the internet—explained"** (by Shift Browser)
   * **Link:** [https://www.youtube.com/watch?v=hgLnE9rQB7A](https://www.youtube.com/watch?v=hgLnE9rQB7A)
   * **Value:** Provides a high-level breakdown of internet energy consumption, essential for structuring the problem statement.
2. **"Your Digital Carbon Footprint"** (by PBS Documentaries)
   * **Link:** [https://www.youtube.com/watch?v=RjEEPxTfCe8](https://www.youtube.com/watch?v=RjEEPxTfCe8)
   * **Value:** A highly credible academic reference detailing the hidden carbon costs of daily internet usage.
3. **"Surprising Fact About WEBSITE CARBON FOOTPRINT"** (by Clicks to Clients)
   * **Link:** [https://www.youtube.com/watch?v=SlPtTe9U99E](https://www.youtube.com/watch?v=SlPtTe9U99E)
   * **Value:** Validates the metrics (page weight, network traffic) used by the Volt-Trace backend.

### 📰 High-Profile News Articles & Reports
1. **The Guardian: "Think before you click – and three other ways to reduce your digital carbon footprint"**
   * **Key Takeaway:** Digital industry emissions now rival the global aviation industry, highlighting the urgency of tools like Volt-Trace.
2. **Ericsson IndustryLab Report: "A quick guide to your digital carbon footprint"**
   * **Key Takeaway:** Deep dive into hardware energy life cycles and data transfer impacts, providing enterprise-level backing for our methodology.
3. **Marmelab: "Digital Carbon Footprint: The Current State of Measuring Tools"**
   * **Key Takeaway:** Technical analysis of the mathematics behind estimating CO2 emissions, exploring page weight and DOM elements.

---

## 📄 License

This project is licensed under the MIT License.
