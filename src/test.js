// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import MonitorDashboard from "./pages/MonitorDashboard";

// import ResponsiveDesignTool, {
//   useDeviceSignal
// } from "./tools/ResponsiveDesignTool";

// const device = useDeviceSignal();
// const AppContent = (
//     <div className={`app-container ${device}`}>
//       <Routes>
//         <Route
//           path="/monitor"
//           element={<MonitorDashboard device={device} />}
//         />
//       </Routes>
//     </div>
// );
// export default App;

import React from "react";
import { Routes, Route } from "react-router-dom";
import MonitorDashboard from "./pages/MonitorDashboard";

import ResponsiveDesignTool, {
  useDeviceSignal
} from "./tools/ResponsiveDesignTool";

const App = () => {
  const device = useDeviceSignal();

  return (
    <div className={`app-container ${device}`}>
      <ResponsiveDesignTool />

      <Routes>
        <Route
          path="/monitor"
          element={<MonitorDashboard device={device} />}
        />
      </Routes>
    </div>
  );
};

export default App;

