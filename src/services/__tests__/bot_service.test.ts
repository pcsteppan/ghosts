import { getSubstringSliceMatches } from "../bot_service";

test('is true', () => {
	expect(true).toBeTruthy();
})

test('get substring all matches', () => {
	const word = 'abab_ab';
	//		      ^ ^  ^
	//            0123456
	const matches = getSubstringSliceMatches(word, 'ab');
	expect(matches).toBe([0, 2, 5]);
})