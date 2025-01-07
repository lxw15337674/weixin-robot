import { describe, expect, it } from '@jest/globals';
import { getRandomImage } from '../acions/randomImage';
import { parseCommand } from '../command';
import { getHelp } from '../acions/getHelp';

describe('Image Tests', () => {
    describe('Random Image', () => {
        it('should return a valid image path', async () => {
            const filePath = await getHelp();
            expect(filePath).not.toBeNull();
        });
    });

}); 