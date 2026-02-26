import app from "./app.js";
import mongoose from "mongoose";
import os from "os";

// Dynamically resolve the local network IP
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
};

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/coding_app")
  .then(() => console.log("✅ MongoDB Connected (Atlas)"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 8001;
const LOCAL_IP = getLocalIP();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Mobile/Expo: http://${LOCAL_IP}:${PORT}`);
  console.log(`💻 Local: http://localhost:${PORT}`);
});
