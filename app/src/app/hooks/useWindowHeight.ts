import { useEffect, useState } from "react";

const useWindowHeight = () => {
  const [windowHeight, setWindowHeight] = useState<number>(
    typeof window !== "undefined" ? window.innerHeight : 0
  );

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);

    // Add the event listener
    window.addEventListener("resize", handleResize);

    // Initial height setting (for SSR safety)
    handleResize();

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowHeight;
};

export default useWindowHeight;
