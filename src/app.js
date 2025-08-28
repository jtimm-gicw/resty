// src/App.js
import React, { useState } from "react";
import Header from "./components/Header/Header";
import Form from "./components/Form/Form";
import Results from "./components/Results/Results";
import History from "./components/History/History";
import Footer from "./components/Footer/Footer";
import "./app.scss";

function App() {
  const [data, setData] = useState(null);       
  const [loading, setLoading] = useState(false); 
  const [history, setHistory] = useState([]);    

  // Handle API calls from Form
  const handleApiCall = async (requestParams) => {
    setLoading(true);

    try {
      const response = await fetch(requestParams.url, {
        method: requestParams.method || "GET",
        headers: requestParams.headers || {},
        body: requestParams.body ? JSON.stringify(requestParams.body) : null,
      });

      const result = await response.json();
      setData(result);

      // Save request to history
      setHistory((prev) => [
        ...prev,
        { url: requestParams.url, method: requestParams.method },
      ]);
    } catch (err) {
      console.error("API call failed:", err);
      setData({ error: "Request failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Header />

      {/* Form for API requests */}
      <Form handleApiCall={handleApiCall} />

      {/* Side-by-side layout: History (left) & Results (right) */}
      <div className="results-history-container">
        <History history={history} />
        <Results data={data} loading={loading} />
      </div>

      <Footer />
    </React.Fragment>
  );
}

export default App;
