import { useEffect, useState } from "react";
import { FiWifiOff, FiWifi, FiX } from "react-icons/fi"; // Import icons from react-icons

export const CheckNetwork = () => {
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000); // Hide message after 3 seconds
    };

    const handleOffline = () => {
      setOnlineStatus(false);
      setShowMessage(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleClose = () => {
    setShowMessage(false);
  };

  return (
    <div className="flex justify-center">
      {showMessage && (
        <div className={`fixed top-1 left-1/2 transform -translate-x-1/2 ${onlineStatus ? 'bg-green-500' : 'bg-red-500'} text-white p-4 text-center shadow-lg z-[9999] flex items-center gap-2 rounded-md`}>
          {onlineStatus ? (
            <>
              <FiWifi size={20} /> {/* Online icon */}
              <span>Back online. You&apos;re connected to the internet.</span>
            </>
          ) : (
            <>
              <FiWifiOff size={20} /> {/* Offline icon */}
              <span>Offline. Please check your network connection.</span>
            </>
          )}
          <button onClick={handleClose} className="ml-auto">
            <FiX size={20} className="hover:text-gray-200" /> {/* Close icon */}
          </button>
        </div>
      )}
    </div>
  );
};
