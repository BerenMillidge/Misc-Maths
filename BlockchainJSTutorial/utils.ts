// okay, quick utils file here

const hexToBinary = function(s: string): string {
	var string = "";
	const lookupTable = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
        '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
        'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101',
        'e': '1110', 'f': '1111'
};
for (var i: number = 0; i< s.length; i++) {
	if(lookupTable[s[i]]) {
		string += lookupTable[s[i]];
	} else {
		return null;
	}
}
return string;
};

export {hexToBinary};