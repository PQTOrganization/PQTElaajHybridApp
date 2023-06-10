import Api from "../api/api";

var marketingSlidesData: any = [];

export const getPanelHospitals = async (
  cityName: string = "",
  token: string
) => {
  var route = "PanelHospital";

  if (cityName !== "") route += "/bycity/" + cityName;

  var Data = await Api(route, null, "GET", token);
  return Data;
};

export const getPanelHospitalsLookup = async (token: string) => {
  var Data = await getPanelHospitals("", token);

  if (Data) {
    Data = Data.map((x: any) => {
      return {
        id: x.hospitalId,
        value: x.hospitalName,
      };
    });

    Data.sort((a: any, b: any) => {
      var textA = a.value.toUpperCase();
      var textB = b.value.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    return Data;
  } else return [];
};

export const getValueAddedServices = async (token: string) => {
  var route = "Info/valueaddedservices";

  var Data = await Api(route, null, "GET", token);

  return Data;
};
export const getProductServices = async (token: string) => {
  var route = "Info/productsservices";

  var Data = await Api(route, null, "GET", token);

  return Data;
};

export const getMarketingSlides = async () => {
  var route = "info/marketingslides";

  var Data = await Api(route, null, "GET");

  marketingSlidesData = Data.slice();
};

export { marketingSlidesData };
