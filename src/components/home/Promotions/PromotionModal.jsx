// src/components/PromotionModal.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "@/Context/AuthContext";



const PromotionModal = () => {
  const { language = "en" } = useContext(AuthContext);
  const [promotions, setPromotions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const texts = {
    en: { announcement: "Announcement", go: "Go" },
    bn: { announcement: "ঘোষণা", go: "যান" },
  };
  const t = texts[language];

  useEffect(() => {
    const hasSeen = localStorage.getItem("promotionModalSeen");
    if (!hasSeen) {
      fetchPromotions();
    }
  }, []);

  const fetchPromotions = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/promotions`);
      const latestTwo = res.data.slice(0, 5);
      if (latestTwo.length > 0) {
        setPromotions(latestTwo);
        setShowModal(true);
        localStorage.setItem("promotionModalSeen", "true");
      }
    } catch (err) {
      console.error("Failed to load promotions:", err);
    }
  };

  if (!showModal || promotions.length === 0) return null;

  const currentPromo = promotions[currentIndex];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      {/* Main Modal - Responsive Container */}
      <div className="relative w-full max-w-5xl bg-gradient-to-b from-teal-900 to-teal-950 rounded-3xl shadow-2xl overflow-hidden border-2 border-teal-600 
                      max-h-[95vh] overflow-y-auto">

        {/* Close Button */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-yellow-400 text-3xl z-50 hover:scale-125 transition"
        >
          ×
        </button>

        {/* Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 p-6 md:p-8">

          {/* Left Sidebar - Titles */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <h3 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-4 md:mb-6 drop-shadow-lg text-center lg:text-left">
              {t.announcement}
            </h3>
            <div className="space-y-2">
              {promotions.map((promo, index) => (
                <div
                  key={promo._id}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex gap-3 cursor-pointer py-3 px-4 rounded-lg items-center transition-all text-sm md:text-base
                    ${index === currentIndex ? "bg-yellow-400" : "bg-[#01323B]"}`}
                >
                  <span className="text-lg">🎉</span>
                  <span className={`font-bold truncate ${index === currentIndex ? "text-[#BF5400]" : "text-white"}`}>
                    {language === "bn" ? promo.title_bn : promo.title_en}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Promotion Details */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 md:p-6 bg-[#01323B] rounded-xl flex-1">
              {/* Title */}
              <h1 className="text-start text-[#21F1BF] text-sm md:text-xl font-bold mb-4">
                {language === "bn" ? currentPromo.title_bn : currentPromo.title_en}
              </h1>

              {/* Image */}
              <div className="relative">
                <img
                  src={currentPromo.image}
                  alt="Promotion"
                  className="rounded-xl w-full h-32 sm:h-64 md:h-80 lg:h-[320px] object-cover border-2 border-yellow-500 shadow-2xl"
                />
              </div>

              {/* Description & Footer */}
              <div className="mt-6 space-y-3">
                <h2 className="hidden md:flex text-yellow-400 text-lg md:text-2xl font-bold text-start">
                  {language === "bn"
                    ? currentPromo.footer_bn || "প্রমোশন বিস্তারিত"
                    : currentPromo.footer_en || "Promotion Details"}
                </h2>
                <p className="hidden md:flex text-yellow-400 text-sm md:text-lg font-medium text-start leading-relaxed">
                  {language === "bn"
                    ? currentPromo.description_bn || currentPromo.description_en
                    : currentPromo.description_en || currentPromo.description_bn}
                </p>
              </div>

              {/* Go Button */}
              <div className="text-center md:text-end mt-8">
                <Link to="/promotions">
                  <button
                    onClick={() => setShowModal(false)}
                    className="py-2 px-6 md:px-8 bg-yellow-400 text-lg md:text-xl font-bold rounded-xl text-[#BF5400] 
                               hover:bg-yellow-300 transition shadow-lg transform hover:scale-105"
                  >
                    {t.go}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;