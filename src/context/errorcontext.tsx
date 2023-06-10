import React, { createContext, useContext, useState, ReactNode } from "react";

const ErrorContext = createContext<any | null>(null);
const useErrorContext = () => useContext(ErrorContext);

interface AuxProps {
  children: ReactNode;
}

const ErrorContextProvider = ({ children }: AuxProps) => {
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  return (
    <ErrorContext.Provider value={{ error, info, setError, setInfo }}>
      {children}
    </ErrorContext.Provider>
  );
};

export { ErrorContextProvider, useErrorContext };
