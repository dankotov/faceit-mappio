import { MapCodename } from "./csgo-maps";

interface VotingOption {
  guid: string;
  name: string;
  class_name: string;
  image_lg: string;
  image_sm: string;
}

interface LocationVotingOption extends VotingOption {
  game_location_id: string;
}

interface MapVotingOption extends VotingOption {
  game_map_id: MapCodename;
}

interface VotingEntity {
  pick: string[];
}

interface LocationVotingEntity extends VotingEntity {
  entities: LocationVotingOption[];
}

interface MapVotingEntity extends VotingEntity {
  entities: MapVotingOption[];
}

export interface MatchVoting {
  voted_entity_types: string[];
  location: LocationVotingEntity;
  map: MapVotingEntity;
}
