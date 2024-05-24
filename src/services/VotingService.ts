import api from "../http";
import {AxiosResponse} from "axios";
import {VotingResponse} from "../models/response/VotingResponse";
import {AddVotingRequest} from "../models/request/AddVotingRequest";
import {PositionResponse} from "../models/response/PositionResponse";
import {PositionRequest} from "../models/request/PositionRequest";
import {VoteResponse} from "../models/response/VoteResponse";
import {Voting} from "../models/Voting";
import {Position} from "../models/Position";
import {Comment} from "../models/Comment";
import {AddCommentRequest} from "../models/request/AddCommentRequest";
import {User} from "../models/User";

export default class VotingService {
    static async addVoting(votingRequest: AddVotingRequest) : Promise<AxiosResponse<VotingResponse>> {
        return api.post<VotingResponse>('/voting/add', votingRequest);
    }

    static async addPosition(positionRequest: PositionRequest, voting_id: number) : Promise<AxiosResponse<PositionResponse>> {
        return api.post<PositionResponse>(`/voting/${voting_id}/addPosition`, positionRequest);
    }

    static async addVote(voting_id: number, position_id: number) : Promise<AxiosResponse<VoteResponse>> {
        return api.post<VoteResponse>(`voting/${voting_id}/position/${position_id}/vote`);
    }

    static async getVotingRating() {
        return api.get<Voting[]>('/voting/rating');
    }

    static async getUserRating() {
        return api.get<User[]>('/users/rating');
    }

    static async getVoting(id: number) {
        return api.get<Voting>(`voting/${id}/info`);
    }

    static async getPositionsForVoting(id: number) {
        return api.get<Position[]>(`voting/${id}/getPositions`);
    }

    static async getCreatedVotings() {
        return api.get<Voting[]>(`voting/created`);
    }

    static async removePosition(voting_id: number, position_id: number) {
        return api.delete(`/voting/${voting_id}/position/${position_id}/remove`);
    }

    static async removeVoting(voting_id: number) {
        return api.delete(`/voting/${voting_id}/delete`);
    }

    static async getComments(voting_id: number) {
        return api.get<Comment[]>(`voting/${voting_id}/comments`);
    }

    static async addComment(voting_id: number, request: AddCommentRequest) : Promise<AxiosResponse<Comment>> {
        return api.post(`voting/${voting_id}/addComment`, request);
    }

    static async getVotedPosition(voting_id: number) : Promise<AxiosResponse<Position>> {
        return api.get<Position>(`voting/${voting_id}/isVoted`);
    }

    static async votesForPosition(position_id: number) {
        return api.get<number>(`position/${position_id}/votes`);
    }

    static async retractVote(position_id: number) {
        return api.delete(`position/${position_id}/retract`);
    }

    static async getUsersForPosition(position_id: number) : Promise<AxiosResponse<User[]>> {
        return api.get<User[]>(`position/${position_id}/users`);
    }

    static async searchByCategory(category: string) {
        return api.get<Voting[]>(`voting/category/${category}`);
    }

    static async searchByTitle(title: string) {
        return api.get<Voting[]>(`voting/search/title/${title}`);
    }
}