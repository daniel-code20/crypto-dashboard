import React from "react";

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Crypto Dashboard</h1>
      <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
        Cambiar Tema
      </button>
    </header>
  );
};

export default Header;
