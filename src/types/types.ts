// =====
// Model types

export type Player = {
	isHuman: boolean,
	name: string,
	losses: number
}

export type History = {
	history: Array<{ action: RAction, snapshot: GameState }>
}

export type GameState = {
	word: string;
	players: Record<string, Player>;
	turnOrder: Array<string>;
	currentPlayer: string;
	gameSpeed: number;
	isActiveChallenge: boolean;
	humanChallengeResponseWord: string
}

export type AppState = GameState & History;

// =====
// Reducer action types


export enum ActionType {
	StartGame,
	AddLetter,
	Challenge,
	ResolveChallengeWithWord,
	ResolveChallengeWithDefeat,
	SetHumanChallengeResponseWord
}

// eslint-disable-next-line @typescript-eslint/ban-types
type Action<T extends ActionType, U = {}> = {
	type: T,
} & U;

export type RAction =
	Action<ActionType.StartGame>
	| Action<ActionType.AddLetter, { letter: string, position: StringEndPosition }>
	| Action<ActionType.Challenge>
	| Action<ActionType.ResolveChallengeWithDefeat>
	| Action<ActionType.ResolveChallengeWithWord, { word: string }>
	| Action<ActionType.SetHumanChallengeResponseWord, { word: string }>;


// =====
// Misc. or helper types

export enum StringEndPosition {
	Head,
	Tail
}

export type SliceMatchResult = {
	fullWord: string,
	wordpart: string,
	matches: Array<number>
}

export type AddLetterResult = {
	letter: string,
	position: StringEndPosition
	source: string,
	isBluff: boolean
}