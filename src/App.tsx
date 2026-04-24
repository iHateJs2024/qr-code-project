import { useState } from "react";
import { Title } from "./pages/Titile";
import { Input } from "./pages/Input";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Title />
      <Input />
    </div>
  );
}

export default App;
