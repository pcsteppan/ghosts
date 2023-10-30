import { SliceMatchResult, StringEndPosition } from "../types/generalTypes";

const MinimumWordLength = 3;

const shuffle = (words: Array<string>): Array<string> => {
	return [...words].sort(() => Math.random() - .5);
}

export const getSubstringSliceMatches = (word: string, query: string): SliceMatchResult => {
	return {
		fullWord: word,
		query,
		matches: [...word.matchAll(new RegExp(query, 'g'))].map(i => i.index) as number[]
	}
}

export const getValidLettersToAdd = (word: string, query: string)
	: Array<{ letter: string, position: StringEndPosition }> => {

	const matchResults = getSubstringSliceMatches(word, query);

	return matchResults.matches
		.map(i => [
			{ index: i - 1, position: StringEndPosition.Head },
			{ index: i + query.length, position: StringEndPosition.Tail }
		])
		.flat()
		.filter(result => result.index >= 0 && result.index < word.length)
		.map(result => ({
			letter: word[result.index],
			position: result.position
		}));
}

// create variant that weights letters to add by how good they are as moves
export const getAllValidLettersToAdd = (query: string, lexicon: Array<string>)
	: Array<{ letter: string, position: StringEndPosition }> => {

	const valid_words = lexicon
		.filter(word => word.length > MinimumWordLength && word.includes(query))
		.map(word => getValidLettersToAdd(word, query))
		.flat();

	return valid_words;
}


