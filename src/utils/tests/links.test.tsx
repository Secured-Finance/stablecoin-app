import { LinkList } from 'src/utils';

describe('links', () => {
    it('should have one link', () => {
        expect(LinkList).toHaveLength(6);
    });
});
