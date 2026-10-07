import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HealthHub from "./pages/HealthHub";

import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import SymptomChecker from "./pages/SymptomChecker";
import MedicineReminder from "./pages/MedicineReminder";
import HealthTracker from "./pages/HealthTracker";
import HealthReports from "./pages/HealthReports";
import EmergencyMode from "./pages/EmergencyMode";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Homepage */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* New Health Hub */}
        <Route path="/health-check" element={<HealthHub />} />

        {/* Main Health Features */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
        <Route path="/medicine-reminder" element={<MedicineReminder />} />
        <Route path="/health-tracker" element={<HealthTracker />} />
        <Route path="/health-reports" element={<HealthReports />} />
        <Route path="/emergency" element={<EmergencyMode />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;