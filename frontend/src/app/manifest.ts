import {  } from "next";

export default function manifest(): any {
  return {
    name: "Web Next App",
    short_name: "Web Next App",
    description: "Web Next App",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
