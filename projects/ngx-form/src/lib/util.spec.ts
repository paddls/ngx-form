import {set} from './util';

describe('Util', () => {

  describe('#set', () => {
    let object: any;

    beforeEach(() => {
      object = { a: [{ bar: { c: 3 } }] };
    });

    it('\'a[0].bar.c\' 4', () => {
      set(object, 'a[0].bar.c', 4);
      expect(object.a[0].bar.c).toEqual(4);
    });

    it('[\'x\', \'0\', \'y\', \'z\']', () => {
      set(object, ['x', '0', 'y', 'z'], 5);
      expect(object.x[0].y.z).toEqual(5);
    });
  });
})
