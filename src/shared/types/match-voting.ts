interface VotingOption {
  guid: string;
  name: string;
  class_name: string;
  game_location_id: string;
  image_lg: string;
  image_sm: string;
}

interface VotingEntity {
  entities: VotingOption[];
  pick: string[];
}

export interface MatchVoting {
  voted_entity_types: string[];
  location: VotingEntity;
  map: VotingEntity;
}
