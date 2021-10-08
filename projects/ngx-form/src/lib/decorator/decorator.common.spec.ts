import {addFormContextCommon, PROPERTY_CONFIGURATIONS_METADATA_KEY} from './decorator.common';

describe('DecoratorCommmon', () => {

  describe('#addFormContextCommon', () => {

    it('should place metadata on target', () => {
      const firstConf: any = {};
      const target: any = {};
      addFormContextCommon(target, firstConf, 'firstConf', 'keyy');
      expect(Reflect.getMetadata(`${PROPERTY_CONFIGURATIONS_METADATA_KEY}:keyy`, target)).toEqual({firstConf});
    });
  });
});
