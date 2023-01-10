import pMemoize from "p-memoize";
import { faceitApiBaseURL, faceitApiBearerToken } from "./consts";

const fetchFaceitApi = async (requestPath) => {
  console.log("called api", requestPath);
  const response = await fetch(faceitApiBaseURL + requestPath, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${faceitApiBearerToken}`,
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();
  return json;
};

const fetchFaceitApiMemoized = pMemoize(fetchFaceitApi);

export const fetchMatchDetails = async (matchroomId) =>
  await fetchFaceitApiMemoized(`/data/v4/matches/${matchroomId}`);
