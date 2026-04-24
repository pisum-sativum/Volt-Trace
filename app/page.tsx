"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

interface ScanData {
  target_url: string;
  page_size_kb: number;
  carbon_emissions_grams: number;
  assets_found: {
    images: number;
    scripts: number;
  };
  ai_advice: Array<{ problem: string; solution: string }>;
}

export default function Home() {
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [data1, setData1] = useState<ScanData | null>(null);
  const [data2, setData2] = useState<ScanData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [carbonIntensity, setCarbonIntensity] = useState(475.0);
  const [unitCO2, setUnitCO2] = useState("g");
  const [unitWeight, setUnitWeight] = useState("KB");
  const [chartType, setChartType] = useState("Bar");

  useEffect(() => {
    const prefersLight = window.matchMedia(
      "(prefers-color-scheme: light)",
    ).matches;
    if (prefersLight) setIsDarkMode(false);
  }, []);

  const themeColors = {
    primary: "#9D6381",
    secondary: "#CECCCC",
    lightBg: "#FDECEF",
    darkBg: "#0F110C",
    accentDark: "#612940",
  };

  const currentTheme = isDarkMode
    ? {
        bg: themeColors.darkBg,
        text: themeColors.lightBg,
        mutedText: themeColors.secondary,
        cardBg: "#161813",
        cardBorder: themeColors.accentDark,
        primaryAccent: themeColors.primary,
        chartAxis: themeColors.secondary,
        chartTooltipBg: "#1e221a",
      }
    : {
        bg: themeColors.lightBg,
        text: themeColors.darkBg,
        mutedText: themeColors.accentDark,
        cardBg: "#ffffff",
        cardBorder: themeColors.primary,
        primaryAccent: themeColors.primary,
        chartAxis: themeColors.accentDark,
        chartTooltipBg: "#ffffff",
      };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setData1(null);
    setData2(null);

    try {
      const endpoint = (url: string) =>
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/scan?url=${url}&carbon_intensity=${carbonIntensity}`;

      const req1 = axios.get(endpoint(url1));

      if (url2) {
        const [res1, res2] = await Promise.all([
          req1,
          axios.get(endpoint(url2)),
        ]);
        setData1(res1.data);
        setData2(res2.data);
      } else {
        const res1 = await req1;
        setData1(res1.data);
      }
    } catch (err) {
      const axiosError = err as any;
      const errorMessage =
        axiosError.response?.data?.detail ||
        "Server connection failed. Is Python running?";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatCO2 = (grams: number) => {
    if (unitCO2 === "mg") return (grams * 1000).toFixed(6);
    return grams.toFixed(6);
  };

  const formatWeight = (kb: number) => {
    if (unitWeight === "MB") return (kb / 1024).toFixed(2);
    return kb.toFixed(2);
  };

  const assetData = data1
    ? [
        {
          name: "Images",
          [data1.target_url || "Site 1"]: data1.assets_found.images,
          ...(data2
            ? { [data2.target_url || "Site 2"]: data2.assets_found.images }
            : {}),
        },
        {
          name: "Scripts",
          [data1.target_url || "Site 1"]: data1.assets_found.scripts,
          ...(data2
            ? { [data2.target_url || "Site 2"]: data2.assets_found.scripts }
            : {}),
        },
      ]
    : [];

  const renderPieChart = () => {
    const pieData1 = [
      { name: "Images", value: data1?.assets_found.images || 0 },
      { name: "Scripts", value: data1?.assets_found.scripts || 0 },
    ];
    const COLORS = [themeColors.primary, themeColors.secondary];

    return (
      <div
        className={`grid grid-cols-1 ${data2 ? "md:grid-cols-2" : ""} gap-6 h-full w-full`}
      >
        <div className="flex flex-col items-center w-full h-full">
          <p
            className="font-bold text-sm mb-2"
            style={{ color: currentTheme.text }}
          >
            {data1?.target_url || "Target A"}
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData1}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {pieData1.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: currentTheme.chartTooltipBg,
                  borderColor: currentTheme.cardBorder,
                  color: currentTheme.text,
                  borderRadius: "12px",
                }}
              />
              <Legend iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {data2 && (
          <div className="flex flex-col items-center w-full h-full">
            <p
              className="font-bold text-sm mb-2"
              style={{ color: currentTheme.text }}
            >
              {data2.target_url || "Target B"}
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Images", value: data2.assets_found.images },
                    { name: "Scripts", value: data2.assets_found.scripts },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {[0, 1].map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: currentTheme.chartTooltipBg,
                    borderColor: currentTheme.cardBorder,
                    color: currentTheme.text,
                    borderRadius: "12px",
                  }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  };

  const SiteIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  );

  const SunIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  );

  const MoonIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  );

  return (
    <main
      className="min-h-screen transition-colors duration-300 font-sans p-6 md:p-12 relative"
      style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}
    >
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md rounded-2xl p-6 md:p-8 shadow-2xl border"
            style={{
              backgroundColor: currentTheme.cardBg,
              borderColor: currentTheme.cardBorder,
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                Settings Explorer
              </h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="opacity-70 hover:opacity-100 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  className="block text-sm font-bold uppercase tracking-wider mb-2"
                  style={{ color: currentTheme.mutedText }}
                >
                  Energy Grid Simulator
                </label>
                <select
                  value={carbonIntensity}
                  onChange={(e) =>
                    setCarbonIntensity(parseFloat(e.target.value))
                  }
                  className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: currentTheme.bg,
                    color: currentTheme.text,
                    borderColor: `${currentTheme.cardBorder}40`,
                  }}
                >
                  <option value={475.0}>Global Average (475 gCO2/kWh)</option>
                  <option value={53.0}>
                    France - Nuclear Heavy (53 gCO2/kWh)
                  </option>
                  <option value={20.0}>
                    Iceland - Geothermal (20 gCO2/kWh)
                  </option>
                  <option value={700.0}>
                    India - Coal Heavy (700 gCO2/kWh)
                  </option>
                  <option value={385.0}>
                    USA - Mixed Average (385 gCO2/kWh)
                  </option>
                </select>
                <p className="text-xs mt-2 opacity-70">
                  Changes the carbon intensity scale algorithm on the backend to
                  test varying global grids.
                </p>
              </div>

              <div>
                <label
                  className="block text-sm font-bold uppercase tracking-wider mb-2"
                  style={{ color: currentTheme.mutedText }}
                >
                  Units of Measurement
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <p className="text-xs mb-1 opacity-70">CO2 Emissions</p>
                    <select
                      value={unitCO2}
                      onChange={(e) => setUnitCO2(e.target.value)}
                      className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: currentTheme.bg,
                        color: currentTheme.text,
                        borderColor: `${currentTheme.cardBorder}40`,
                      }}
                    >
                      <option value="g">Grams (g)</option>
                      <option value="mg">Milligrams (mg)</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs mb-1 opacity-70">Page Weight</p>
                    <select
                      value={unitWeight}
                      onChange={(e) => setUnitWeight(e.target.value)}
                      className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: currentTheme.bg,
                        color: currentTheme.text,
                        borderColor: `${currentTheme.cardBorder}40`,
                      }}
                    >
                      <option value="KB">Kilobytes (KB)</option>
                      <option value="MB">Megabytes (MB)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-bold uppercase tracking-wider mb-2"
                  style={{ color: currentTheme.mutedText }}
                >
                  Data Visualization Style
                </label>
                <div
                  className="flex p-1 rounded-xl"
                  style={{
                    backgroundColor: currentTheme.bg,
                    border: `1px solid ${currentTheme.cardBorder}40`,
                  }}
                >
                  <button
                    onClick={() => setChartType("Bar")}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${chartType === "Bar" ? "shadow-sm" : "opacity-60"}`}
                    style={{
                      backgroundColor:
                        chartType === "Bar"
                          ? currentTheme.cardBg
                          : "transparent",
                      color: currentTheme.text,
                    }}
                  >
                    Bar Chart
                  </button>
                  <button
                    onClick={() => setChartType("Pie")}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${chartType === "Pie" ? "shadow-sm" : "opacity-60"}`}
                    style={{
                      backgroundColor:
                        chartType === "Pie"
                          ? currentTheme.cardBg
                          : "transparent",
                      color: currentTheme.text,
                    }}
                  >
                    Pie Chart
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-6 py-3 font-bold rounded-xl shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  backgroundColor: currentTheme.primaryAccent,
                  color: "#FDECEF",
                }}
              >
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between md:items-center mb-12 gap-6">
          <div>
            <h1
              className="text-4xl md:text-5xl font-extrabold tracking-tight"
              style={{ color: currentTheme.text }}
            >
              Volt-Trace
            </h1>
            <p
              className="mt-2 text-sm md:text-base font-medium uppercase tracking-widest"
              style={{ color: currentTheme.primaryAccent }}
            >
              Autonomous Digital Carbon Footprint Analyzer
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-6 py-3 font-semibold shadow-sm transition-transform hover:scale-105 active:scale-95 rounded-xl border flex items-center gap-2"
              style={{
                backgroundColor: currentTheme.cardBg,
                color: currentTheme.text,
                borderColor: `${currentTheme.cardBorder}50`,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              Settings
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 shadow-sm transition-transform hover:scale-105 active:scale-95 flex items-center justify-center rounded-xl border"
              style={{
                backgroundColor: currentTheme.cardBg,
                color: currentTheme.text,
                borderColor: `${currentTheme.cardBorder}50`,
              }}
              aria-label="Toggle Dark Mode"
              title="Toggle Light/Dark Theme"
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </header>

        <div
          className="rounded-2xl p-6 md:p-8 mb-10 shadow-lg border"
          style={{
            backgroundColor: currentTheme.cardBg,
            borderColor: `${currentTheme.cardBorder}50`,
          }}
        >
          <form
            onSubmit={handleScan}
            className="flex flex-col lg:flex-row gap-5"
          >
            <div className="flex-1 relative">
              <label
                className="block text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: currentTheme.mutedText }}
              >
                Primary Target
              </label>
              <div className="flex items-center">
                <div
                  className="absolute left-3"
                  style={{ color: currentTheme.mutedText }}
                >
                  <SiteIcon />
                </div>
                <input
                  type="text"
                  placeholder="e.g., wikipedia.org"
                  value={url1}
                  onChange={(e) => setUrl1(e.target.value)}
                  className="w-full rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 transition-all border"
                  style={{
                    backgroundColor: currentTheme.bg,
                    color: currentTheme.text,
                    borderColor: `${currentTheme.cardBorder}30`,
                    boxShadow: `0 0 0 0 ${currentTheme.primaryAccent}`,
                  }}
                  required
                />
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center pt-6">
              <span
                className="text-sm font-bold opacity-50 px-2"
                style={{ color: currentTheme.mutedText }}
              >
                VS
              </span>
            </div>

            <div className="flex-1 relative">
              <label
                className="block text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: currentTheme.mutedText }}
              >
                Comparison Target (Optional)
              </label>
              <div className="flex items-center">
                <div
                  className="absolute left-3"
                  style={{ color: currentTheme.mutedText }}
                >
                  <SiteIcon />
                </div>
                <input
                  type="text"
                  placeholder="e.g., github.com"
                  value={url2}
                  onChange={(e) => setUrl2(e.target.value)}
                  className="w-full rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 transition-all border"
                  style={{
                    backgroundColor: currentTheme.bg,
                    color: currentTheme.text,
                    borderColor: `${currentTheme.cardBorder}30`,
                  }}
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full lg:w-auto px-8 py-4 rounded-xl font-bold transition-all shadow-md transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-md"
                style={{
                  backgroundColor: currentTheme.primaryAccent,
                  color: "#FDECEF",
                }}
              >
                {loading ? "Analyzing..." : "Trace Footprint"}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div
            className="rounded-xl p-5 mb-10 flex items-center gap-4 border shadow-sm animate-in fade-in zoom-in-95 duration-300"
            style={{
              backgroundColor: isDarkMode ? "#251216" : "#ffe6e6",
              borderColor: "#ff4d4d",
              color: isDarkMode ? "#ff9999" : "#b30000",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span className="font-semibold text-sm md:text-base flex-1">
              {error}
            </span>
            <button
              onClick={() => setError("")}
              className="opacity-70 hover:opacity-100 transition-opacity p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}

        {data1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div
              className={`grid grid-cols-1 ${data2 ? "md:grid-cols-2" : ""} gap-6`}
            >
              <div
                className="rounded-2xl p-6 md:p-8 border shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                style={{
                  backgroundColor: currentTheme.cardBg,
                  borderColor: `${currentTheme.cardBorder}40`,
                }}
              >
                <div
                  className="absolute top-0 left-0 w-full h-1"
                  style={{ backgroundColor: currentTheme.primaryAccent }}
                ></div>

                <div className="mb-6">
                  <h3
                    className="text-xs font-bold uppercase tracking-wider mb-1"
                    style={{ color: currentTheme.mutedText }}
                  >
                    Target A
                  </h3>
                  <h2
                    className="text-2xl font-bold truncate"
                    title={data1.target_url}
                  >
                    {data1.target_url}
                  </h2>
                </div>

                <div
                  className="grid grid-cols-2 gap-4 border-t pt-6"
                  style={{ borderColor: `${currentTheme.cardBorder}20` }}
                >
                  <div>
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: currentTheme.mutedText }}
                    >
                      CO2 Emission
                    </p>
                    <p
                      className="text-3xl md:text-4xl font-extrabold flex items-baseline gap-1"
                      style={{ color: currentTheme.primaryAccent }}
                    >
                      {formatCO2(data1.carbon_emissions_grams)}
                      <span className="text-xl font-semibold opacity-80">
                        {unitCO2}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: currentTheme.mutedText }}
                    >
                      Page Weight
                    </p>
                    <p
                      className="text-2xl md:text-3xl font-bold flex items-baseline justify-end gap-1"
                      style={{ color: currentTheme.text }}
                    >
                      {formatWeight(data1.page_size_kb)}{" "}
                      <span className="text-lg font-semibold opacity-70">
                        {unitWeight}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {data2 && (
                <div
                  className="rounded-2xl p-6 md:p-8 border shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  style={{
                    backgroundColor: currentTheme.cardBg,
                    borderColor: `${currentTheme.cardBorder}40`,
                  }}
                >
                  <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{ backgroundColor: themeColors.secondary }}
                  ></div>

                  <div className="mb-6">
                    <h3
                      className="text-xs font-bold uppercase tracking-wider mb-1"
                      style={{ color: currentTheme.mutedText }}
                    >
                      Target B
                    </h3>
                    <h2
                      className="text-2xl font-bold truncate"
                      title={data2.target_url}
                    >
                      {data2.target_url}
                    </h2>
                  </div>

                  <div
                    className="grid grid-cols-2 gap-4 border-t pt-6"
                    style={{ borderColor: `${currentTheme.cardBorder}20` }}
                  >
                    <div>
                      <p
                        className="text-sm font-medium mb-1"
                        style={{ color: currentTheme.mutedText }}
                      >
                        CO2 Emission
                      </p>
                      <p
                        className="text-3xl md:text-4xl font-extrabold flex items-baseline gap-1"
                        style={{ color: themeColors.secondary }}
                      >
                        {formatCO2(data2.carbon_emissions_grams)}
                        <span className="text-xl font-semibold text-current opacity-80">
                          {unitCO2}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-sm font-medium mb-1"
                        style={{ color: currentTheme.mutedText }}
                      >
                        Page Weight
                      </p>
                      <p
                        className="text-2xl md:text-3xl font-bold flex items-baseline justify-end gap-1"
                        style={{ color: currentTheme.text }}
                      >
                        {formatWeight(data2.page_size_kb)}{" "}
                        <span className="text-lg font-semibold opacity-70">
                          {unitWeight}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              className="rounded-2xl p-6 md:p-8 border shadow-md lg:h-[450px]"
              style={{
                backgroundColor: currentTheme.cardBg,
                borderColor: `${currentTheme.cardBorder}40`,
              }}
            >
              <h3
                className="text-lg font-semibold mb-6 flex items-center gap-3"
                style={{ color: currentTheme.text }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
                Asset Distribution Analysis
              </h3>
              <div className="h-[300px] lg:h-[320px] w-full">
                {chartType === "Bar" ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={assetData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        strokeOpacity={0.1}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        stroke={currentTheme.chartAxis}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        tickMargin={14}
                      />
                      <YAxis
                        stroke={currentTheme.chartAxis}
                        axisLine={false}
                        tickLine={false}
                        dx={-10}
                      />
                      <Tooltip
                        cursor={{ fill: isDarkMode ? "#2a2d24" : "#f1f1f1" }}
                        contentStyle={{
                          backgroundColor: currentTheme.chartTooltipBg,
                          borderColor: currentTheme.cardBorder,
                          borderRadius: "12px",
                          color: currentTheme.text,
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          padding: "16px",
                        }}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: "30px", fontSize: "14px" }}
                        iconType="circle"
                        iconSize={10}
                      />
                      <Bar
                        dataKey={data1.target_url || "Site 1"}
                        fill={themeColors.primary}
                        radius={[6, 6, 0, 0]}
                        maxBarSize={70}
                        animationDuration={1000}
                      />
                      {data2 && (
                        <Bar
                          dataKey={data2.target_url || "Site 2"}
                          fill={themeColors.secondary}
                          radius={[6, 6, 0, 0]}
                          maxBarSize={70}
                          animationDuration={1000}
                        />
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  renderPieChart()
                )}
              </div>
            </div>

            <div
              className={`grid grid-cols-1 ${data2 ? "md:grid-cols-2" : ""} gap-6`}
            >
              <div
                className="rounded-2xl p-6 md:p-8 border shadow-sm relative overflow-hidden"
                style={{
                  backgroundColor: currentTheme.cardBg,
                  borderColor: `${currentTheme.cardBorder}40`,
                }}
              >
                <div
                  className="flex items-center gap-3 mb-5 pb-4 border-b relative z-10"
                  style={{ borderColor: `${currentTheme.cardBorder}20` }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={currentTheme.primaryAccent}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <h3
                    className="text-xl font-bold tracking-tight"
                    style={{ color: currentTheme.text }}
                  >
                    System Report: Target A
                  </h3>
                </div>
                <div className="space-y-4 relative z-10">
                  {Array.isArray(data1.ai_advice) ? (
                    data1.ai_advice.map((item, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl border flex flex-col gap-2"
                        style={{
                          backgroundColor: currentTheme.bg,
                          borderColor: `${currentTheme.cardBorder}30`,
                        }}
                      >
                        <div
                          className="font-semibold text-sm"
                          style={{ color: currentTheme.primaryAccent }}
                        >
                          <span className="font-bold mr-2 uppercase tracking-wide opacity-80 text-xs">
                            Problem:
                          </span>
                          <span style={{ color: currentTheme.text }}>
                            {item.problem}
                          </span>
                        </div>
                        <div className="text-sm font-medium">
                          <span
                            className="font-bold mr-2 uppercase tracking-wide opacity-80 text-xs"
                            style={{ color: themeColors.secondary }}
                          >
                            Solution:
                          </span>
                          <span style={{ color: currentTheme.mutedText }}>
                            {item.solution}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      className="whitespace-pre-line text-sm md:text-base leading-relaxed opacity-90"
                      style={{ color: currentTheme.text }}
                    >
                      {typeof data1.ai_advice === "string"
                        ? data1.ai_advice
                        : "Analysis Error"}
                    </div>
                  )}
                </div>
              </div>

              {data2 && (
                <div
                  className="rounded-2xl p-6 md:p-8 border shadow-sm relative overflow-hidden"
                  style={{
                    backgroundColor: currentTheme.cardBg,
                    borderColor: `${currentTheme.cardBorder}40`,
                  }}
                >
                  <div
                    className="flex items-center gap-3 mb-5 pb-4 border-b relative z-10"
                    style={{ borderColor: `${currentTheme.cardBorder}20` }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={themeColors.secondary}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <h3
                      className="text-xl font-bold tracking-tight"
                      style={{ color: currentTheme.text }}
                    >
                      System Report: Target B
                    </h3>
                  </div>
                  <div className="space-y-4 relative z-10">
                    {Array.isArray(data2.ai_advice) ? (
                      data2.ai_advice.map((item, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl border flex flex-col gap-2"
                          style={{
                            backgroundColor: currentTheme.bg,
                            borderColor: `${currentTheme.cardBorder}30`,
                          }}
                        >
                          <div
                            className="font-semibold text-sm"
                            style={{ color: currentTheme.primaryAccent }}
                          >
                            <span className="font-bold mr-2 uppercase tracking-wide opacity-80 text-xs">
                              Problem:
                            </span>
                            <span style={{ color: currentTheme.text }}>
                              {item.problem}
                            </span>
                          </div>
                          <div className="text-sm font-medium">
                            <span
                              className="font-bold mr-2 uppercase tracking-wide opacity-80 text-xs"
                              style={{ color: themeColors.secondary }}
                            >
                              Solution:
                            </span>
                            <span style={{ color: currentTheme.mutedText }}>
                              {item.solution}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        className="whitespace-pre-line text-sm md:text-base leading-relaxed opacity-90"
                        style={{ color: currentTheme.text }}
                      >
                        {typeof data2.ai_advice === "string"
                          ? data2.ai_advice
                          : "Analysis Error"}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
