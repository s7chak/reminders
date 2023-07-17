import CountApp from "./countupdown";
import React, { createContext, useState } from "react";

export const ThemeContext = createContext(null);

export const App = () => {
	const [theme, setTheme] = useState("light");
	const toggleTheme = () => {
		setTheme((curr) => (curr === "light" ? "dark" : "light"));
	}
	return (
		<div className="app" id={theme}>
      <CountApp changeTheme={toggleTheme} />
    </div>
	);
};


export default App;