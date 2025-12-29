// src/components/SocialLinks.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const SocialLinks = () => {
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/social-links`
        );
        // অর্ডার অনুযায়ী দেখানোর জন্য (যেভাবে অ্যাডমিনে যোগ করা হয়েছে)
        setSocialLinks(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Social links load failed:", err);
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  // লোডিং এর সময় কিছু না দেখাক (যাতে ফ্লিকার না করে)
  if (loading) return null;

  // যদি কোনো লিংক না থাকে তাহলে কিছু দেখাবে না
  if (!socialLinks || socialLinks.length === 0) return null;

  // প্রতিটি লিংকের জন্য ডাইনামিক পজিশন
  const positions = [
    "-100px",  // প্রথমটা (যেমন: Telephone)
    "-140px",  // দ্বিতীয়টা (Telegram)
    "-180px",  // তৃতীয়টা (Facebook)
    "-220px",  // চতুর্থটা (WhatsApp)
    "-260px",  // পঞ্চমটা (যদি আরো যোগ করেন)
    "-300px",
    "-340px",
  ];

  return (
    <div>
      {socialLinks.map((link, index) => (
        <div
          key={link._id}
          className="absolute right-2 transform -translate-y-1/2 z-50"
          style={{
            top: positions[index] || `calc(-100px - ${index * 60}px)`, // বেশি হলে অটো স্পেসিং
          }}
        >
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-all duration-300 hover:scale-125"
          >
            <img
              src={link.icon}
              alt={link.name}
              className="w-10 h-10 object-contain drop-shadow-lg"
            />
          </a>
        </div>
      ))}
    </div>
  );
};

export default SocialLinks;