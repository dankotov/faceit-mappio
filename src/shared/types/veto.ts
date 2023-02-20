interface VetoEntity {
  guid: string;
  status: string;
  random: boolean;
  round: number;
  selected_by: string;
}

interface VetoTicket {
  entities: VetoEntity[];
  entity_type: string;
  vote_type: string;
}

export interface VetoHistory {
  match_id: string;
  tickets: VetoTicket[];
}
