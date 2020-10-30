const apiKey = "1d69525bb94d08c0c885a67adca4aaf0";

export const weatherApi = (path, { zipcode, coords, units }) => {
  let suffix = "";
  let unit = "";

  if (zipcode) {
    suffix = `zip=${zipcode}`;
  } else if (coords) {
    suffix = `lat=${coords.latitude}&lon=${coords.longitude}`;
  }

  if (units === "metric") {
    unit = `&units=metric`;
  } else {
    unit = `&units=imperial`;
  }

  return fetch(
    `https://api.openweathermap.org/data/2.5${path}?appid=${apiKey}${unit}&${suffix}`
  ).then((response) => response.json());
};
