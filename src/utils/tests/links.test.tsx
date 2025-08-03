import { getLinkList } from 'src/utils';

describe('links', () => {
    it('should have one link', () => {
        expect(getLinkList()).toHaveLength(5);
    });
});
