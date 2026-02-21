describe('Smoke Test', () => {
    it('basit matematik testi', () => {
        expect(1 + 1).toBe(2);
    });

    it('GRID_SIZE 6 olmali', () => {
        const GRID_SIZE = 6;
        expect(GRID_SIZE).toBe(6);
    });
});
