import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: {
            DEFAULT: "#FF0000",
            light: "#FF0000",
            dark: "#AC0000",
          },
          green: {
            DEFAULT: "#55A630",
            light: "#55A630",
            dark: "#27632E",
          },
          black: {
            DEFAULT: "#303030",
            light: "#303030",
            dark: "#000000",
          },
          gray: {
            DEFAULT: "#A9A9A9",
            light: "#F5F4F4",
            dark: "#696969",
          },
        },
      },
      backgroundImage: {
        "ghana-flag-gradient":
          "linear-gradient(154.26deg, rgba(255, 0, 0, 0.5) 3.5%, rgba(255, 221, 0, 0.4) 51.1%, rgba(85, 166, 48, 0.5) 92%)",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        abhaya: ["Abhaya Libre", "serif"],
      },
      fontSize: {
        "xs-plus": ["10px", "11.72px"],
        "sm-plus": ["15px", "17.58px"],
        "xsm-plus": ["20px", "21.42px"],
        "md-plus": ["20px", "23.44px"],
        subtitle: ["24px", "28.13px"],
        title: ["32px", "37.5px"],
        headline: ["40px", "46.88px"],
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      lineHeight: {
        "117": "1.17", // 117%
        "125": "1.25", // 125%
        "150": "1.5", // 150%
        "175": "1.75", // 175%
        "200": "2", // 200%
      },
      borderRadius: {
        none: "0",
        sm: "0.125rem", // 2px
        DEFAULT: "0.25rem", // 4px
        md: "0.375rem", // 6px
        lg: "0.5rem", // 8px
        xlg: "10px", // Our custom value between lg and xl
        xl: "0.75rem", // 12px
        "2xl": "1rem", // 16px
        "3xl": "1.5rem", // 24px
        full: "9999px",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
} satisfies Config;
