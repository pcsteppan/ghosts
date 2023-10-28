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
}

export enum ActionType {
	Challenge,
	AddLetter,
}

export enum AddLetterType {
	Head,
	Tail
}

export type Action = {
	type: ActionType,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	payload: any
}

export type SliceMatchResult = {
	fullWord: string,
	query: string,
	matches: Array<number>
}