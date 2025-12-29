// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false); // নতুন
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInformationModalOpen, setIsInformationModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState("tab1");
  const [language, setLanguage] = useState(
    localStorage.getItem("sidebarLang") || "bn"
  );
  console.log(userId);

  const fetchUser = async (userId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin?id=${userId}`
      );
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUserId(data.user._id);
      return data.user;
    } catch (err) {
      console.error("Fetch user error:", err);
      return null;
    }
  };

  // শুধু balance রিফ্রেশ
  const refreshBalance = async () => {
    const userId = localStorage.getItem("userId");
    console.log(userId);
    if (!userId) return;

    setIsBalanceLoading(true); // লোডিং শুরু
    try {
      const fetchedUser = await fetchUser(userId);
      if (fetchedUser) {
        setBalance(fetchedUser.balance || 0);
      }
    } catch (err) {
      console.error("Balance refresh failed:", err);
    } finally {
      setIsBalanceLoading(false); // লোডিং শেষ
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchUser(userId).then((fetchedUser) => {
        if (fetchedUser) {
          setUser(fetchedUser);

          setBalance(fetchedUser.balance || 0);
          localStorage.setItem("user", JSON.stringify(fetchedUser));
        } else {
          localStorage.removeItem("userId");
          localStorage.removeItem("user");
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    setUser(null);
    setBalance(0);
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
  };

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-red-600">
  //       <div className="text-white text-xl font-semibold flex items-center gap-3">
  //         <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
  //         <span>Authenticating...</span>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        balance,
        refreshBalance,
        isBalanceLoading, // নতুন
        language,
        setLanguage,
        userId,
        setBalance,
        setIsInformationModalOpen,
        isInformationModalOpen,
        initialTab,
        setInitialTab
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
