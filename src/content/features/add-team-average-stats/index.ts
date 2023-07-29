import { debounce } from "lodash";
import { ESCL } from "../../../shared/consts";
import { memFetchAllMatchPlayersMapStats } from "../../helpers/faceit-api";
import {
  getRosterContainers,
  getRosterNames,
  getRosterPlayers,
} from "../../helpers/matchroom";
import { getTeamAverageStats } from "../../helpers/team-average";
import { elementExistsIn } from "../../helpers/utils";
import createTeamAvgPlayerCard from "./components/TeamAvgPlayerCard";

export default debounce(async (matchroomId) => {
  const { rosterOneName, rosterTwoName } = getRosterNames();
  const { rosterOneContainer, rosterTwoContainer } = getRosterContainers();

  if (
    !rosterOneName ||
    !rosterTwoName ||
    !rosterOneContainer ||
    !rosterTwoContainer
  )
    return;

  const matchPlayersMapStats = await memFetchAllMatchPlayersMapStats(
    matchroomId
  );
  if (!matchPlayersMapStats) return;

  const rosterOnePlayers = getRosterPlayers(rosterOneContainer);
  const rosterTwoPlayers = getRosterPlayers(rosterTwoContainer);

  const rosters = [
    {
      rosterName: rosterOneName,
      rosterContainer: rosterOneContainer,
      rosterPlayers: rosterOnePlayers,
    },
    {
      rosterName: rosterTwoName,
      rosterContainer: rosterTwoContainer,
      rosterPlayers: rosterTwoPlayers,
    },
  ];

  rosters.forEach(({ rosterName, rosterContainer, rosterPlayers }, index) => {
    if (elementExistsIn(`.${ESCL}.teamAvgMapStats`, rosterContainer)) return;

    const teamAverageStats = getTeamAverageStats(
      rosterPlayers,
      matchPlayersMapStats
    );

    const teamAvgPlayerCard = createTeamAvgPlayerCard({
      mapStats: teamAverageStats,
      rosterName,
      rosterIndex: index,
    });

    rosterContainer.prepend(teamAvgPlayerCard);
  });
}, 300);
