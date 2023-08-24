import { useState, useEffect } from "react";

export function useLocalStorageState(intialState, key) {
  //retrieve the locally stored watched movies
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : intialState;
  });

  //Store to local Storage
  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(value, key));
    },
    [value, key]
  );

  return [value, setValue];
}
