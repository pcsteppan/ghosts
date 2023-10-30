import { expect, test } from 'vitest';
import { getSubstringSliceMatches, getValidLettersToAdd } from "../botService";
import { StringEndPosition } from '../../types/generalTypes';

test('is true', () => {
	expect(true).toBeTruthy();
})

test('get substring all matches', () => {
	const word = 'abab_ab';
	//		      ^ ^  ^
	//            0123456
	const matches = getSubstringSliceMatches(word, 'ab');
	expect(matches.matches).toStrictEqual([0, 2, 5]);
})

test('get valid letters to add #1', () => {
	const word = 'cat';

	const validLetters = getValidLettersToAdd(word, 'at');
	expect(validLetters).toStrictEqual([{ letter: 'c', position: StringEndPosition.Head }]);
})

test('get valid letters to add #1', () => {
	const word = 'cat';

	const validLetters = getValidLettersToAdd(word, 'ca');
	expect(validLetters).toStrictEqual([{ letter: 't', position: StringEndPosition.Tail }]);
})

test('get valid letters to add #3', () => {
	const word = 'catats';

	const validLetters = getValidLettersToAdd(word, 'at');
	expect(validLetters).toStrictEqual([
		{ letter: 'c', position: StringEndPosition.Head },
		{ letter: 'a', position: StringEndPosition.Tail },
		{ letter: 't', position: StringEndPosition.Head },
		{ letter: 's', position: StringEndPosition.Tail },
	]);
})

test('get bot action, add valid letter', () => {

})

// test('get bot action, add letter', () => {

// })

// test('get bot action, add letter', () => {

// })