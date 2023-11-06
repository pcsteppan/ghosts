// =====
// Model types

export type Player = {
	isHuman: boolean,
	name: string,
	losses: number
}


export type GameState = {
	word: string;
	players: Record<string, Player>;
	turnOrder: Array<string>;
	currentPlayer: string;
	gameSpeed: number;
	log: Array<string>;
	isActiveChallenge: boolean;
	humanChallengeResponseWord: string,
}


// =====
// Reducer action types


export enum ActionType {
	Challenge,
	AddLetter,
	ResolveChallengeWithWord,
	ResolveChallengeWithDefeat,
	SetHumanChallengeResponseWord
}

type Action<T extends ActionType, U> = {
	type: T,
	payload: U
}

export type RAction =
	Action<ActionType.AddLetter, { letter: string, position: StringEndPosition }>
	| Action<ActionType.Challenge, null>
	| Action<ActionType.ResolveChallengeWithDefeat, null>
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