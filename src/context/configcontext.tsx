import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

const ConfigContext = createContext<any | null>(null);
const useConfigContext = () => useContext(ConfigContext);

interface AuxProps {
  children: ReactNode;
}

const ConfigProvider = ({ children }: AuxProps) => {
  const [data, setData] = useState<any | null>([]);
  const [configLoaded, setConfigLoaded] = useState<boolean>(false);

  const [DOC_SIZE, setDocSize] = useState<Number>(1);
  const [MIN_DOCS, setMinDocs] = useState<Number>(1);
  const [MAX_DOCS, setMaxDocs] = useState<Number>(3);
  const [DATE_FORMAT, setDateFormat] = useState<string>("DD-MMM-yyyy");
  const [IMAGE_SIZE, setImageSize] = useState<Number>(2.75);
  const [CUMULATIVE_DOC_SIZE, setCumulativeDocSize] = useState<Number>(1);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    fetch("/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else return "{}";
      })
      .then((myJson: any) => {
        setData(myJson);
      });
  };

  useEffect(() => {
    if (data.DOC_SIZE) setDocSize(data.DOC_SIZE);
    if (data.MIN_DOCS) setMinDocs(data.MIN_DOCS);
    if (data.MAX_DOCS) setMaxDocs(data.MAX_DOCS);
    if (data.DATE_FORMAT) setDateFormat(data.DATE_FORMAT);
    if (data.IMAGE_SIZE) setImageSize(data.IMAGE_SIZE);
    if (data.CUMULATIVE_DOC_SIZE)
      setCumulativeDocSize(data.CUMULATIVE_DOC_SIZE);

    setConfigLoaded(true);
  }, [data]);

  return (
    <ConfigContext.Provider
      value={{
        configLoaded,
        DOC_SIZE,
        MIN_DOCS,
        MAX_DOCS,
        DATE_FORMAT,
        IMAGE_SIZE,
        CUMULATIVE_DOC_SIZE,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export { ConfigProvider, useConfigContext };
