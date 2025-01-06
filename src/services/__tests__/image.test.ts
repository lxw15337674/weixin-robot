import { describe, expect, it } from '@jest/globals';
import { getRandomImage } from '../acions/randomImage';
import { parseCommand } from '../command';

describe('Image Tests', () => {
    describe('Random Image', () => {
        it('should return a valid image path', async () => {
            const randomImage = await getRandomImage();
            expect(randomImage).not.toBeNull();
        });
    });

    describe('Image Commands', () => {
        it('should handle image command correctly', async () => {
            await parseCommand('img', (path) => { 
                expect(path).not.toBeNull();
                expect(path).toContain('random_awsl.png');
            });
        });
    });
}); 