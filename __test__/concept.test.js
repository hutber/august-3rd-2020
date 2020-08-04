import { Item, update_quality } from '../index'

describe.skip('Hutber Rose', function () {
  describe('stuff', () => {
    let roseItems
    let items
    beforeEach(() => {
      items = undefined
      roseItems = [new Item('+5 Dexterity Vest', 10, 20), new Item('Aged Brie', 2, 0)]
    })
    describe('when updating qualitys', () => {
      beforeEach(() => {
        items = update_quality(roseItems)
      })
      it.each`
        index | name
        ${0}  | ${'+5 Dexterity Vest'}
        ${1}  | ${'Aged Brie'}
      `('should return $name for item $index', ({ index, name }) => {
        expect(items[index].name).toEqual(name)
      })
    })

    describe('', () => {
      beforeEach(() => {
        items = update_quality(roseItems)
      })
      it.each`
        index | name                   | sell_in | quality
        ${0}  | ${'+5 Dexterity Vest'} | ${9}    | ${19}
        ${1}  | ${'+5 Dexterity Vest'} | ${8}    | ${18}
      `('should lower sell_in and quality by 1 each day for "standard" items', ({ index, name, sell_in, quality }) => {
        expect(items[index]).toEqual({ name, sell_in, quality })
      })
    })
  })
})
