const { describe, expect, test} = require('@jest/globals');
import { MatchTypeENUM } from '../matches/match.models';
import { betService } from './bet.service';

const bet = {
    id: 1,
    userId: 1,
    matchId: 1,
    scoreA: 0,
    scoreB: 0,
};

const match = {
    id: 1,
    cupId: 1,
    teamIdA: 1,
    teamIdB: 1,
    scoreA: 0,
    scoreB: 0,
    type: MatchTypeENUM.GROUP_A,
    matchDate: new Date(),
}

describe('Service > correctOneTeamScore', () => {
    test('should return correct score for team A', () => {
        bet.scoreA = 1;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 1;

        const result = betService.correctOneTeamScore(bet, match);

        expect(result).toBe(true);
    });

    test('should return correct score for team B', () => {
        bet.scoreA = 0;
        bet.scoreB = 1;
        match.scoreA = 1;
        match.scoreB = 1;

        const result = betService.correctOneTeamScore(bet, match);

        expect(result).toBe(true);
    });

    test('should return false when both scores are correct', () => {
        bet.scoreA = 1;
        bet.scoreB = 1;
        match.scoreA = 1;
        match.scoreB = 1;

        const result = betService.correctOneTeamScore(bet, match);

        expect(result).toBe(false);
    });

    test('should return false when both scores are incorrect', () => {
        bet.scoreA = 0;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 1;

        const result = betService.correctOneTeamScore(bet, match);

        expect(result).toBe(false);
    });

    test('should return false when both scores are null', () => {
        bet.scoreA = 0;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 1;

        const result = betService.correctOneTeamScore(bet, match);

        expect(result).toBe(false);
    });
});

describe('Service > correctResult', () => {
    test('should return correct winner team A', () => {
        bet.scoreA = 1;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 0;

        const result = betService.correctResult(bet, match);

        expect(result).toBe(true);
    });

    test('should return correct winner team B', () => {
        bet.scoreA = 0;
        bet.scoreB = 1;
        match.scoreA = 0;
        match.scoreB = 1;

        const result = betService.correctResult(bet, match);

        expect(result).toBe(true);
    });

    test('should return draw', () => {
        bet.scoreA = 1;
        bet.scoreB = 1;
        match.scoreA = 1;
        match.scoreB = 1;

        const result = betService.correctResult(bet, match);

        expect(result).toBe(true);
    });

    test('should return false when bet result is different from match (A x B)', () => {
        bet.scoreA = 1;
        bet.scoreB = 0;
        match.scoreA = 0;
        match.scoreB = 1;

        const result = betService.correctResult(bet, match);

        expect(result).toBe(false);
    });

    test('should return false when bet result is different from match (B x A)', () => {
        bet.scoreA = 0;
        bet.scoreB = 1;
        match.scoreA = 1;
        match.scoreB = 0;

        const result = betService.correctResult(bet, match);

        expect(result).toBe(false);
    });

    test('should return false when bet result is different from match (A x Draw)', () => {
        bet.scoreA = 1;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 1;
        const result = betService.correctResult(bet, match);

        expect(result).toBe(false);
    });

    test('should return false when bet result is different from match (B x Draw)', () => {
        bet.scoreA = 0;
        bet.scoreB = 1;
        match.scoreA = 1;
        match.scoreB = 1;

        const result = betService.correctResult(bet, match);

        expect(result).toBe(false);
    });
});

describe('Service > correctBothScore', () => {
    test('should return true on correct score (A x B)', () => {
        bet.scoreA = 1;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 0;

        const result = betService.correctBothScore(bet, match);

        expect(result).toBe(true);
    });

    test('should return true on correct score (B x A)', () => {
        bet.scoreA = 0;
        bet.scoreB = 1;
        match.scoreA = 0;
        match.scoreB = 1;

        const result = betService.correctBothScore(bet, match);

        expect(result).toBe(true);
    });

    test('should return false on incorrect score', () => {
        bet.scoreA = 2;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 0;

        const result = betService.correctBothScore(bet, match);

        bet.scoreA = 1;
        bet.scoreB = 0;
        match.scoreA = 0;
        match.scoreB = 1;

        const result2 = betService.correctBothScore(bet, match);

        bet.scoreA = 1;
        bet.scoreB = 0;
        match.scoreA = 0;
        match.scoreB = 1;

        const result3 = betService.correctBothScore(bet, match);

        bet.scoreA = 1;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 1;

        const result4 = betService.correctBothScore(bet, match);

        bet.scoreA = 1;
        bet.scoreB = 1;
        match.scoreA = 1;
        match.scoreB = 0;

        const result5 = betService.correctBothScore(bet, match);

        expect(result).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);
        expect(result4).toBe(false);
        expect(result5).toBe(false);
    });
});

describe('Service > applyWeightByRound', () => {
    test('should return correct points to group matches', () => {
        const result = betService.applyWeightByRound(0, MatchTypeENUM.GROUP_A);
        const result1 = betService.applyWeightByRound(1, MatchTypeENUM.GROUP_A);
        const result2 = betService.applyWeightByRound(2, MatchTypeENUM.GROUP_A);
        const result3 = betService.applyWeightByRound(3, MatchTypeENUM.GROUP_A);
        const result4 = betService.applyWeightByRound(5, MatchTypeENUM.GROUP_A);

        expect(result).toBe(0);
        expect(result1).toBe(1);
        expect(result2).toBe(2);
        expect(result3).toBe(3);
        expect(result4).toBe(5);
    });

    test('should return correct points to round of 16 matches', () => {
        const result = betService.applyWeightByRound(0, MatchTypeENUM.ROUND_OF_16);
        const result1 = betService.applyWeightByRound(1, MatchTypeENUM.ROUND_OF_16);
        const result2 = betService.applyWeightByRound(2, MatchTypeENUM.ROUND_OF_16);
        const result3 = betService.applyWeightByRound(3, MatchTypeENUM.ROUND_OF_16);
        const result4 = betService.applyWeightByRound(5, MatchTypeENUM.ROUND_OF_16);

        expect(result).toBe(0);
        expect(result1).toBe(1);
        expect(result2).toBe(3);
        expect(result3).toBe(4);
        expect(result4).toBe(7);
    });

    test('should return correct points to quarter final matches', () => {
        const result = betService.applyWeightByRound(0, MatchTypeENUM.QUARTER_FINAL);
        const result1 = betService.applyWeightByRound(1, MatchTypeENUM.QUARTER_FINAL);
        const result2 = betService.applyWeightByRound(2, MatchTypeENUM.QUARTER_FINAL);
        const result3 = betService.applyWeightByRound(3, MatchTypeENUM.QUARTER_FINAL);
        const result4 = betService.applyWeightByRound(5, MatchTypeENUM.QUARTER_FINAL);

        expect(result).toBe(0);
        expect(result1).toBe(1);
        expect(result2).toBe(3);
        expect(result3).toBe(4);
        expect(result4).toBe(7);
    });

    test('should return correct points to semi final matches', () => {
        const result = betService.applyWeightByRound(0, MatchTypeENUM.SEMI_FINAL);
        const result1 = betService.applyWeightByRound(1, MatchTypeENUM.SEMI_FINAL);
        const result2 = betService.applyWeightByRound(2, MatchTypeENUM.SEMI_FINAL);
        const result3 = betService.applyWeightByRound(3, MatchTypeENUM.SEMI_FINAL);
        const result4 = betService.applyWeightByRound(5, MatchTypeENUM.SEMI_FINAL);

        expect(result).toBe(0);
        expect(result1).toBe(2);
        expect(result2).toBe(4);
        expect(result3).toBe(6);
        expect(result4).toBe(10);
    });

    test('should return correct points to third place matches', () => {
        const result = betService.applyWeightByRound(0, MatchTypeENUM.THIRD_PLACE);
        const result1 = betService.applyWeightByRound(1, MatchTypeENUM.THIRD_PLACE);
        const result2 = betService.applyWeightByRound(2, MatchTypeENUM.THIRD_PLACE);
        const result3 = betService.applyWeightByRound(3, MatchTypeENUM.THIRD_PLACE);
        const result4 = betService.applyWeightByRound(5, MatchTypeENUM.THIRD_PLACE);

        expect(result).toBe(0);
        expect(result1).toBe(2);
        expect(result2).toBe(5);
        expect(result3).toBe(7);
        expect(result4).toBe(12);
    });

    test('should return correct points to final matches', () => {
        const result = betService.applyWeightByRound(0, MatchTypeENUM.FINAL);
        const result1 = betService.applyWeightByRound(1, MatchTypeENUM.FINAL);
        const result2 = betService.applyWeightByRound(2, MatchTypeENUM.FINAL);
        const result3 = betService.applyWeightByRound(3, MatchTypeENUM.FINAL);
        const result4 = betService.applyWeightByRound(5, MatchTypeENUM.FINAL);

        expect(result).toBe(0);
        expect(result1).toBe(3);
        expect(result2).toBe(6);
        expect(result3).toBe(9);
        expect(result4).toBe(15);
    });
});

describe('Service > calculatePoints', () => {
    test('should return correct points to group matches', () => {
        match.type = MatchTypeENUM.GROUP_A;

        bet.scoreA = 2;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 1;

        const result = betService.calculatePoints(bet, match);

        bet.scoreA = 1;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 1;

        const result1 = betService.calculatePoints(bet, match);

        bet.scoreA = 2;
        bet.scoreB = 1;
        match.scoreA = 1;
        match.scoreB = 0;

        const result2 = betService.calculatePoints(bet, match);

        bet.scoreA = 1;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 0;

        const result3 = betService.calculatePoints(bet, match);

        expect(result).toBe(0);
        expect(result1).toBe(1);
        expect(result2).toBe(2);
        expect(result3).toBe(5);
    });

    test('should return correct points to round of 16 matches', () => {
        match.type = MatchTypeENUM.ROUND_OF_16;

        bet.scoreA = 2;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 1;

        const result = betService.calculatePoints(bet, match);

        bet.scoreA = 1;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 1;

        const result1 = betService.calculatePoints(bet, match);

        bet.scoreA = 2;
        bet.scoreB = 1;
        match.scoreA = 1;
        match.scoreB = 0;

        const result2 = betService.calculatePoints(bet, match);

        bet.scoreA = 1;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 0;

        const result3 = betService.calculatePoints(bet, match);

        expect(result).toBe(0);
        expect(result1).toBe(1);
        expect(result2).toBe(3);
        expect(result3).toBe(7);
    });

    test('should return correct points to quarter final matches', () => {
        match.type = MatchTypeENUM.QUARTER_FINAL;

        bet.scoreA = 2;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 1;

        const result = betService.calculatePoints(bet, match);

        bet.scoreA = 1;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 1;

        const result1 = betService.calculatePoints(bet, match);

        bet.scoreA = 2;
        bet.scoreB = 1;
        match.scoreA = 1;
        match.scoreB = 0;

        const result2 = betService.calculatePoints(bet, match);

        bet.scoreA = 1;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 0;

        const result3 = betService.calculatePoints(bet, match);

        expect(result).toBe(0);
        expect(result1).toBe(1);
        expect(result2).toBe(3);
        expect(result3).toBe(7);
    });

    test('should return correct points to semi final matches', () => {
        match.type = MatchTypeENUM.SEMI_FINAL;

        bet.scoreA = 2;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 1;

        const result = betService.calculatePoints(bet, match);

        bet.scoreA = 1;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 1;

        const result1 = betService.calculatePoints(bet, match);

        bet.scoreA = 2;
        bet.scoreB = 1;
        match.scoreA = 1;
        match.scoreB = 0;

        const result2 = betService.calculatePoints(bet, match);

        bet.scoreA = 1;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 0;

        const result3 = betService.calculatePoints(bet, match);

        expect(result).toBe(0);
        expect(result1).toBe(2);
        expect(result2).toBe(4);
        expect(result3).toBe(10);
    });

    test('should return correct points to third place matches', () => {
        match.type = MatchTypeENUM.THIRD_PLACE;

        bet.scoreA = 2;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 1;

        const result = betService.calculatePoints(bet, match);

        bet.scoreA = 1;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 1;

        const result1 = betService.calculatePoints(bet, match);

        bet.scoreA = 2;
        bet.scoreB = 1;
        match.scoreA = 1;
        match.scoreB = 0;

        const result2 = betService.calculatePoints(bet, match);

        bet.scoreA = 1;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 0;

        const result3 = betService.calculatePoints(bet, match);

        expect(result).toBe(0);
        expect(result1).toBe(2);
        expect(result2).toBe(5);
        expect(result3).toBe(12);
    });

    test('should return correct points to final matches', () => {
        match.type = MatchTypeENUM.FINAL;

        bet.scoreA = 2;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 1;

        const result = betService.calculatePoints(bet, match);

        bet.scoreA = 1;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 1;

        const result1 = betService.calculatePoints(bet, match);

        bet.scoreA = 2;
        bet.scoreB = 1;
        match.scoreA = 1;
        match.scoreB = 0;

        const result2 = betService.calculatePoints(bet, match);

        bet.scoreA = 1;
        bet.scoreB = 0;
        match.scoreA = 1;
        match.scoreB = 0;

        const result3 = betService.calculatePoints(bet, match);

        expect(result).toBe(0);
        expect(result1).toBe(3);
        expect(result2).toBe(6);
        expect(result3).toBe(15);
    });
});
