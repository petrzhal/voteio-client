export interface AddVotingRequest {
    title: string;
    description: string;
    category: string;
    type: string;
    creator_id: number;
    begin_date: Date
    end_date: Date
}