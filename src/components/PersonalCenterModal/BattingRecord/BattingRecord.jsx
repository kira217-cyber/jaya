import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/Context/AuthContext";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BattingRecord = () => {
  const { language, userId } = useContext(AuthContext);
  console.log("UserID Batting:", userId);

  // ================= States =================
  const [activeMainTab, setActiveMainTab] = useState(0);
  const [activeRadioTab, setActiveRadioTab] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterProvider, setFilterProvider] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // ================= Fetch User Game History =================
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/users/${userId}`);
        const user = res.data;

        // Extract and sort game history (latest first)
        const history = (user.gameHistory || [])
          .map((entry) => ({
            ...entry,
            createdAt: new Date(entry.createdAt),
          }))
          .sort((a, b) => b.createdAt - a.createdAt);

        setGameHistory(history);
      } catch (err) {
        console.error("Failed to fetch game history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // ================= Filter Logic =================
  const filteredHistory = gameHistory.filter((entry) => {
    // Provider filter
    if (filterProvider !== "all" && entry.provider_code !== filterProvider) {
      return false;
    }

    // Date filter (if selected)
    if (dateFilter) {
      const entryDate = new Date(entry.createdAt).toISOString().split("T")[0];
      if (entryDate !== dateFilter) return false;
    }

    return true;
  });

  // ================= Tabs Data (Sport & Slot) =================
  const data = [
    {
      tabTitle: { en: "ALL", bn: "সকল" },
      radioTabs: [
        { label: { en: "Today", bn: "আজ" }, tableData: filteredHistory },
        { label: { en: "Yesterday", bn: "গতকাল" }, tableData: filteredHistory },
      ],
    },
  ];

  const mainTab = data?.[activeMainTab];
  const radioTab = mainTab?.radioTabs?.[activeRadioTab];

  // ================= Table Headers =================
  const tableHeaders = [
    { label: { en: "Bet Time", bn: "বেট সময়" }, key: "createdAt" },
    { label: { en: "Bet Amount", bn: "বেট পরিমাণ" }, key: "amount" },
    { label: { en: "Valid Bet", bn: "বৈধ বেট" }, key: "amount" }, // Assuming valid = amount
    { label: { en: "Award", bn: "অর্থ পুরস্কার" }, key: "award" },
    { label: { en: "Profit Loss", bn: "লাভ ক্ষতি" }, key: "profitLoss" },
    { label: { en: "Game Name", bn: "গেম নাম" }, key: "game_code" },
    { label: { en: "Game Number", bn: "গেম নম্বর" }, key: "transaction_id" },
  ];

  // Format date
  const formatDateTime = (date) => {
    return new Date(date).toLocaleString();
  };

  // Calculate totals
  const totalBet = filteredHistory.reduce((sum, h) => sum + (h.amount || 0), 0);
  const totalWin = filteredHistory.reduce(
    (sum, h) => sum + (h.status === "won" ? h.amount : 0),
    0
  );
  const profitLoss = totalWin - totalBet;

  return (
    <div className="p-4 space-y-6 bg-gray-50">
      {/* ================= Main Tabs ================= */}
      <div className="flex gap-8 lg:gap-12 text-sm lg:text-lg overflow-x-auto border-b border-gray-300 pb-2">
        {data.map((tab, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveMainTab(i);
              setActiveRadioTab(0);
            }}
            className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${
              i === activeMainTab
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {language === "bn" ? tab.tabTitle.bn : tab.tabTitle.en}
          </button>
        ))}
      </div>

      {/* ================= Filters ================= */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center flex-wrap">
        {/* Radio Tabs (Today/Yesterday etc.) */}
        <div className="flex gap-6 flex-wrap">
          {mainTab?.radioTabs?.map((r, i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="radioTab"
                checked={i === activeRadioTab}
                onChange={() => setActiveRadioTab(i)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm lg:text-base">
                {language === "bn" ? r.label.bn : r.label.en}
              </span>
            </label>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Date Picker */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-gray-400 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-600"
          />
          <button className="px-6 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition">
            {language === "bn" ? "খুঁজুন" : "Search"}
          </button>
        </div>
      </div>

      {/* ================= Table ================= */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <p className="text-sm font-medium text-gray-700">
            {language === "bn"
              ? `মোট ফলাফল: ${filteredHistory.length}`
              : `Total Results: ${filteredHistory.length}`}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            {" "}
            <Skeleton height={24} count={3} />{" "}
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {language === "bn"
              ? "কোন রেকর্ড পাওয়া যায়নি"
              : "No records found"}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="overflow-x-auto hidden lg:block">
              <table className="w-full">
                <thead className="bg-[#063A49] text-white">
                  <tr>
                    {tableHeaders.map((header, i) => (
                      <th
                        key={i}
                        className="text-left p-3 text-sm font-medium text-white"
                      >
                        {language === "bn" ? header.label.bn : header.label.en}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((row, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm">
                        {formatDateTime(row.createdAt)}
                      </td>
                      <td className="p-3 text-sm">{row.amount || "-"}</td>
                      <td className="p-3 text-sm">{row.amount || "-"}</td>
                      <td className="p-3 text-sm text-green-600">
                        {row.status === "won" ? row.amount : "0.00"}
                      </td>
                      <td
                        className={`p-3 text-sm font-medium ${
                          row.status === "won"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {row.status === "won"
                          ? `+${row.amount}`
                          : `-${row.amount}`}
                      </td>
                      <td className="p-3 text-sm">{row.game_code || "-"}</td>
                      <td className="p-3 text-sm">
                        {row.transaction_id || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              {filteredHistory.map((row, i) => (
                <div key={i} className="border-b p-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">
                        {language === "bn" ? "বেট সময়" : "Bet Time"}
                      </p>
                      <p className="font-medium">
                        {formatDateTime(row.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">
                        {language === "bn" ? "বেট পরিমাণ" : "Bet Amount"}
                      </p>
                      <p className="font-medium">{row.amount || "-"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">
                        {language === "bn" ? "গেম নাম" : "Game Name"}
                      </p>
                      <p className="font-medium">{row.game_code || "-"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">
                        {language === "bn" ? "লাভ/ক্ষতি" : "Profit/Loss"}
                      </p>
                      <p
                        className={`font-medium ${
                          row.status === "won"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {row.status === "won"
                          ? `+${row.amount}`
                          : `-${row.amount}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ================= Bottom Summary ================= */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-sm text-gray-600">
              {language === "bn" ? "মোট বেট" : "Total Bet"}
            </p>
            <p className="text-lg font-bold text-gray-800">
              {totalBet.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {language === "bn" ? "মোট জয়" : "Total Win"}
            </p>
            <p className="text-lg font-bold text-green-600">
              {totalWin.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {language === "bn" ? "বৈধ বেট" : "Valid Bet"}
            </p>
            <p className="text-lg font-bold text-gray-800">
              {totalBet.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {language === "bn" ? "লাভ/ক্ষতি" : "Profit/Loss"}
            </p>
            <p
              className={`text-lg font-bold ${
                profitLoss >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {profitLoss >= 0 ? "+" : ""}
              {profitLoss.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattingRecord;
