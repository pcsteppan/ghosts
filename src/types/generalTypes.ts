// =====
// Model types
export type Player = {
	isHuman: boolean,
	name: string,
	losses: number
}


export type GameState = {
	word: string;
	players: Array<Player>;
	currentPlayer: Player;
	gameSpeed: number;
	log: Array<string>;
}

// =====
// Reducer action types
export enum ActionType {
	Challenge,
	AddLetter,
}

type Action<T extends ActionType, U> = {
	type: T,
	payload: U
}

export type RAction =
	Action<ActionType.AddLetter, { letter: string, position: StringEndPosition }>
	| Action<ActionType.Challenge, null>;

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
}