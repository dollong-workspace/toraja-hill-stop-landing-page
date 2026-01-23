import { useEffect } from "react";

declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: Date;
  }
}

export const useTawk = () => {
  useEffect(() => {
    // Initialize Tawk_API
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Create and load Tawk script
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/6972ad1a934bbd198163ee96/1jfjv8clr";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
};
