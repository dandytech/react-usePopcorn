import { useState, useEffect } from "react";

const KEY = "a915de6f";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  //const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      //cleanup UseEffect here with native browser api AbortController
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError(""); //always setError back to intial before fetching

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            //second argument for the conroller
            { signal: controller.signal }
          );

          if (!res.ok)
            //if data is not found
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          console.error(err.message);

          //display other errors other than AbortError
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }

        //reset the array to prevent diplaying Movie not found on default, also search keyword must be up to 3 before api call
        if (query.length < 3) {
          setMovies([]);
          setError("");
          return;
        }
      }
      //handleCloseMovie(); //to close the selected movie when trying to search another
      fetchMovies();

      //cleanup function to cancel request when another request is made
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
