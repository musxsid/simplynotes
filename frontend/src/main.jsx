import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import './index.css'
import App from './App.jsx'
import { Toaster } from "react-hot-toast";

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster 
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className:
            "bg-surface dark:bg-surface-dark text-text-primary dark:text-text-darkPrimary border border-border dark:border-border-dark",
        }}
      />
      <App />
    </BrowserRouter>
  </StrictMode>
);