import { getLinkList } from 'src/utils';

describe('links', () => {
    it('should have one link', () => {
        const linkList = getLinkList();
        expect(linkList).toHaveLength(5);
    });
});
