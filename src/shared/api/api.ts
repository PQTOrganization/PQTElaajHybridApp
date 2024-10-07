export default async function Api(
  route: string,
  body: any,
  method: any,
  sessionToken = ""
) {
  const API_URL = process.env.REACT_APP_API_ENDPOINT;

  var url = API_URL + route;

  if (body != null) {
    body = JSON.stringify(body);
  }

  var config: any = {
    method: method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionToken,
    },
  };

  if (body !== null) {
    config.body = body;
  }

  var Data = await fetch(url, config)
    .then(async (response: any) => {
      if (response.ok) return Promise.resolve(response.json());
      else {
        if (response.status === 401) {
          throw new Error("You are unauthorized.");
        }

        if (response.status === 404) {
          throw new Error("Unexpected error. Data not found");
        }

        if (response.status === 405) {
          throw new Error("Unexpected error. Method not allowed");
        }

        if (response.status === 500)
          return Promise.resolve(response.json()).then((responseInJson) => {
            return Promise.reject(responseInJson.Message);
          });
        else {
          return Promise.resolve(response.text()).then((errText) => {
            return Promise.reject(errText);
          });
        }
      }
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw error;
    });

  return Data;
}
