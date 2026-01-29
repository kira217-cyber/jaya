// src/components/PromotionModal.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "@/Context/AuthContext";

const PromotionModal = () => {
  const { language = "en" } = useContext(AuthContext);
  const [promotions, setPromotions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

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
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/promotions`,
      );
      const latest = res.data.slice(0, 5); // latest 5 promotions
      if (latest.length > 0) {
        setPromotions(latest);
        setShowModal(true);
        localStorage.setItem("promotionModalSeen", "true");
      }
    } catch (err) {
      console.error("Failed to load promotions:", err);
    }
  };

  if (!showModal || promotions.length === 0) return null;

  const currentPromo = promotions[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? promotions.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === promotions.length - 1 ? 0 : prev + 1));
  };

  const handleImageClick = () => {
    setShowModal(false);
    navigate("/promotions");
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4 md:p-6"
        >
          {/* Modal Container – Responsive width & height */}
          <motion.div
            initial={{ scale: 0.85, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="
              relative w-full max-w-lg sm:max-w-2xl md:max-w-4xl lg:max-w-5xl 
              bg-gradient-to-b from-teal-950 via-teal-900 to-black 
              rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden 
              border-2 border-teal-700/70 max-h-[95vh] overflow-y-auto
            "
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="
                absolute top-3 right-3 md:top-4 md:right-5 
                text-yellow-400 text-3xl md:text-4xl z-50 
                hover:scale-125 hover:text-yellow-300 transition-transform
              "
            >
              ×
            </button>

            {/* Content Layout – Stacked on mobile, side-by-side on desktop */}
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 p-2 md:p-6 lg:p-8">
              {/* Left: Titles List (hidden on very small screens if needed) */}
              <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                <h3 className="text-2xl md:text-3xl font-bold text-yellow-400 md:mb-6 drop-shadow-lg text-center lg:text-left">
                  {t.announcement}
                </h3>

                <div className="space-y-2.5 hidden md:block max-h-60 lg:max-h-none overflow-y-auto pr-2">
                  {promotions.map((promo, index) => (
                    <motion.div
                      key={promo._id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setCurrentIndex(index)}
                      className={`
                        flex items-center gap-3 p-3 md:p-4 rounded-xl cursor-pointer transition-all text-sm md:text-base
                        ${
                          index === currentIndex
                            ? "bg-yellow-500/90 text-[#1a0f00] shadow-lg"
                            : "bg-teal-950/70 text-white hover:bg-teal-800/60"
                        }
                      `}
                    >
                      <span className="text-xl flex-shrink-0">🎉</span>
                      <span className="font-semibold truncate">
                        {language === "bn" ? promo.title_bn : promo.title_en}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right: Promotion Details */}
              <div className="flex-1 flex flex-col">
                <div className="bg-teal-950/60 rounded-xl p-2 md:p-6 lg:p-7 flex-1">
                  {/* Title */}
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-300 mb-4 md:mb-5 text-center lg:text-left">
                    {language === "bn"
                      ? currentPromo.title_bn
                      : currentPromo.title_en}
                  </h1>

                  {/* Image – now clickable */}
                  <div
                    className="relative rounded-xl overflow-hidden border-2 border-yellow-600/70 shadow-xl cursor-pointer"
                    onClick={handleImageClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleImageClick();
                      }
                    }}
                  >
                    <img
                      src={currentPromo.image}
                      alt={currentPromo.title_en || "Promotion"}
                      className="
                        w-full h-36 sm:h-64 md:h-80 lg:h-[340px] xl:h-[380px] 
                        object-cover transition-transform duration-700 
                        hover:scale-105
                      "
                      onError={(e) => {
                        e.target.src = "/fallback-promo.jpg"; // optional fallback image
                      }}
                    />
                  </div>

                  {/* Description (visible only on larger screens) */}
                  <div className="mt-5 md:mt-6 space-y-3 hidden md:block">
                    <h2 className="text-yellow-400 text-lg md:text-2xl font-bold">
                      {language === "bn"
                        ? currentPromo.footer_bn || "প্রমোশন বিস্তারিত"
                        : currentPromo.footer_en || "Promotion Details"}
                    </h2>
                    <p className="text-gray-200 text-sm md:text-base leading-relaxed">
                      {language === "bn"
                        ? currentPromo.description_bn ||
                          currentPromo.description_en
                        : currentPromo.description_en ||
                          currentPromo.description_bn}
                    </p>
                  </div>

                  {/* Go Button – desktop */}
                  <div className="hidden md:block mt-6 md:mt-8 text-center">
                    <Link to="/promotions">
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowModal(false)}
                        className="
                          py-3 px-8 md:px-10 text-lg md:text-xl font-bold 
                          bg-gradient-to-r from-yellow-500 to-orange-600 
                          text-black rounded-full shadow-xl 
                          hover:from-yellow-400 hover:to-orange-500 
                          transition-all duration-300
                        "
                      >
                        {t.go}
                      </motion.button>
                    </Link>
                  </div>

                  {/* Mobile Prev / Next controls */}
                  <div className="block mt-5 md:hidden p-2 flex justify-between gap-3">
                    <button
                      onClick={handlePrevious}
                      className="
                        flex-1 py-3 px-6 text-lg font-semibold 
                        bg-yellow-600 hover:bg-yellow-500 
                        text-white rounded-lg transition-colors
                        active:scale-95
                      "
                    >
                      Previous
                    </button>

                    <button
                      onClick={handleNext}
                      className="
                        flex-1 py-3 px-6 text-lg font-semibold 
                        bg-yellow-600 hover:bg-yellow-500 
                        text-white rounded-lg transition-colors
                        active:scale-95
                      "
                    >
                      Next
                    </button>
                  </div>

                  {/* Optional: show current position on mobile */}
                  <div className="text-center text-gray-400 text-sm mt-2 md:hidden">
                    {currentIndex + 1} / {promotions.length}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromotionModal;
