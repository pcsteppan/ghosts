import { AddLetterResult, GameState, StringEndPosition } from "../types/types";

export const applyAddLetterResultToWordpart = (result: Pick<AddLetterResult, "letter" | "position">, wordpart: string) => {
	return result.position === StringEndPosition.Head
		? result.letter + wordpart
		: wordpart + result.letter;
}

export const inGame = (state: GameState) => state.word !== '';