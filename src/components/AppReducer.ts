import { big_words } from "../data/big_words";
import { lexicon } from "../data/lexicon";
import { getNextPlayer, getPreviousPlayer } from "../services/botService";
import { ActionType, AppState, GameState, Player, RAction, StringEndPosition } from "../types/types";

const initialPlayers: Record<string, Player> = {
	'0': { id: 0, isHuman: true, name: 'patrick', losses: 0 },
	'1': { id: 1, isHuman: false, name: 'olimar', losses: 0 },
	'2': { id: 2, isHuman: false, name: 'ears', losses: 0 },
};

const initialTurnOrder = [
	'0',
	'1',
	'2',
];

const initialGameState: GameState = {
	word: '',
	players: initialPlayers,
	turnOrder: initialTurnOrder,
	currentPlayer: initialTurnOrder[0],
	gameSpeed: 400,
	isActiveChallenge: false,
	humanChallengeResponseWord: '',
}

export const initialAppState: AppState = {
	...initialGameState,
	history: [{ action: { type: ActionType.StartGame }, snapshot: initialGameState }]
}

export function reduceOnAppAction(state: AppState, action: RAction): AppState {
	switch (action.type) {
		case ActionType.Challenge:
			{
				const challengedPlayer = getPreviousPlayer(state.turnOrder, state.currentPlayer);

				return {
					...state,
					currentPlayer: challengedPlayer,
					isActiveChallenge: true,
				}
			}
		case ActionType.AddLetter:
			{
				const nextPlayer = getNextPlayer(state.turnOrder, state.currentPlayer);
				let newWord = state.word;

				switch (action.position) {
					case StringEndPosition.Head:
						newWord = action.letter + state.word;
						break;
					case StringEndPosition.Tail:
						newWord += action.letter;
						break;
				}

				if (lexicon.includes(newWord)) {
					return {
						...state,
						word: '',
						players: {
							...state.players,
							[state.currentPlayer]: {
								...state.players[state.currentPlayer],
								losses: state.players[state.currentPlayer].losses + 1
							}
						},
						currentPlayer: state.turnOrder[0],
					}
				}

				return {
					...state,
					word: newWord,
					currentPlayer: nextPlayer,
				}
			}
		case ActionType.ResolveChallengeWithDefeat:
			return {
				...state,
				word: '',
				players: {
					...state.players,
					[state.currentPlayer]: {
						...state.players[state.currentPlayer],
						losses: state.players[state.currentPlayer].losses + 1
					}
				},
			};
		case ActionType.ResolveChallengeWithWord:
			{
				const challengingPlayer = getNextPlayer(state.turnOrder, state.currentPlayer);

				const isValidWord = action.word.includes(state.word)
					&& (lexicon.includes(action.word) || big_words.includes(action.word));

				if (isValidWord) {
					return {
						...state,
						word: '',
						isActiveChallenge: false,
						players: {
							...state.players,
							[challengingPlayer]: {
								...state.players[challengingPlayer],
								losses: state.players[challengingPlayer].losses + 1
							}
						},
					};
				} else {
					return {
						...state,
						word: '',
						isActiveChallenge: false,
						players: {
							...state.players,
							[state.currentPlayer]: {
								...state.players[state.currentPlayer],
								losses: state.players[state.currentPlayer].losses + 1
							}
						},
					};
				}
			}
		case ActionType.SetHumanChallengeResponseWord:
			return {
				...state,
				humanChallengeResponseWord: action.word
			}
		case ActionType.StartGame:
			return {
				...initialAppState
			}
		case ActionType.AddPlayer:
			{
				let i = 0;
				while (state.players[`bot ${++i}`]) { /**/ }
				const newName = `bot ${i}`;
				return {
					...state,
					players: {
						...state.players,
						[newName]: {
							name: newName,
							isHuman: false,
							losses: 0,
							id: i
						}
					},
					turnOrder: [...state.turnOrder, newName]
				}
			}
		case ActionType.DeletePlayer:
			{
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { [action.playerId]: _, ...newPlayers } = state.players;
				const newTurnOrder = [
					...state.turnOrder
				].filter(playerId => playerId !== action.playerId.toString());

				return {
					...state,
					players: {
						...newPlayers
					},
					turnOrder: newTurnOrder,
					currentPlayer: newTurnOrder[0]
				}
			}
		case ActionType.ChangePlayerName:
			{
				const newPlayers = { ...state.players };
				newPlayers[action.playerId].name = action.newName;

				return {
					...state,
					players: newPlayers
				}
			}
	}
}