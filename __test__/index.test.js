import { Item, update_quality } from '../index'

describe('Hutber Rose', function () {
  let roseItems = []

  beforeEach(() => {
    roseItems = []
  })

  it('should lower sell_in and quality by 1 each day for "standard" items', function () {
    roseItems.push(new Item('+5 Dexterity Vest', 10, 20))
    const expected = [
      { name: '+5 Dexterity Vest', sell_in: 9, quality: 19 },
      { name: '+5 Dexterity Vest', sell_in: 8, quality: 18 },
    ]

    expected.forEach((item, index) => {
      const [desired] = update_quality(roseItems)
      expect(expected[index]).toEqual(desired)
    })
  })

  it('Quality | should degrade twice as fast once the sell_in is at 0', () => {
    roseItems.push(new Item('+5 Dexterity Vest', 0, 20))

    const expected = [
      { name: '+5 Dexterity Vest', quality: 18 },
      { name: '+5 Dexterity Vest', quality: 16 },
    ]

    expected.forEach((item, index) => {
      const [desired] = update_quality(roseItems)
      expect(expected[index].quality).toBe(desired.quality)
    })
  })

  it('Quality | can never be negative', () => {
    roseItems.push(new Item('+5 Dexterity Vest', 5, 2))

    for (let i = 0; i < 5; i++) {
      update_quality(roseItems)
    }
    const desired = update_quality(roseItems)
    expect(0).toBe(desired[0].quality)
  })

  it('Quality | Aged brie should increase with age', function () {
    roseItems.push(new Item('Aged Brie', 2, 0))

    const expected = 3
    const desired = update_quality(roseItems)

    expect(expected).toBe(desired[0].quality)
  })

  it('Quality | can never go above 50', function () {
    roseItems.push(new Item('Aged Brie', 30, 49))

    const expected = 50

    for (let i = 0; i < 5; i++) {
      update_quality(roseItems)
    }
    const desired = update_quality(roseItems)

    expect(expected).toBe(desired[0].quality)
  })

  it('Sulfuras | Does not need to be sold or decrease in quality & can have quality 80', function () {
    roseItems.push(new Item('Sulfuras, Hand of Ragnaros', 30, 80))

    for (let i = 0; i < 5; i++) {
      update_quality(roseItems)
    }
    const desired = update_quality(roseItems)
    expect(80).toBe(desired[0].quality)
    expect(30).toBe(desired[0].sell_in)
  })

  it('Backstage passes | increases in quality when sell_in is closer ', function () {
    const name = 'Backstage passes to a TAFKAL80ETC concert'
    roseItems.push(new Item(name, 7, 10))

    const expected = [
      { name, sell_in: 6, quality: 12 },
      { name, sell_in: 5, quality: 14 },
      { name, sell_in: 4, quality: 17 },
      { name, sell_in: 3, quality: 20 },
    ]

    expected.forEach((item, index) => {
      const desired = update_quality(roseItems)
      expect(item).toEqual(desired[0])
    })
  })

  it('Backstage passes | Quality equals 0 when there are no days left ', function () {
    roseItems.push(new Item('Backstage passes to a TAFKAL80ETC concert', 1, 12))

    const expected = { sell_in: -1, quality: 0 }
    update_quality(roseItems)
    const [desired] = update_quality(roseItems)
    expect(desired.sell_in).toBe(expected.sell_in)
    expect(desired.quality).toBe(expected.quality)
  })

  it('Conjured | degrade twice as fast as normal items', function () {
    const name = 'Conjured Mana Cake'
    roseItems.push(new Item(name, 5, 12))

    const expected = [
      { name, sell_in: 4, quality: 10 },
      { name, sell_in: 3, quality: 8 },
      { name, sell_in: 2, quality: 6 },
    ]

    expected.forEach((item, index) => {
      const desired = update_quality(roseItems)
      expect(item).toEqual(desired[0])
    })
  })

  it('Deep Test | should return the same items we put in, with all values updated', function () {
    roseItems.push(new Item('+5 Dexterity Vest', 10, 20))
    roseItems.push(new Item('Aged Brie', 2, 0))
    roseItems.push(new Item('Elixir of the Mongoose', 5, 7))
    roseItems.push(new Item('Sulfuras, Hand of Ragnaros', 0, 80))
    roseItems.push(new Item('Sulfuras, Hand of Ragnaros', -1, 80))
    roseItems.push(new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20))
    roseItems.push(new Item('Backstage passes to a TAFKAL80ETC concert', 10, 49))
    roseItems.push(new Item('Backstage passes to a TAFKAL80ETC concert', 5, 49))
    roseItems.push(new Item('Conjured Mana Cake', 3, 6))

    const desired = update_quality(roseItems)

    const expected = [
      { name: '+5 Dexterity Vest', sell_in: 9, quality: 19 },
      { name: 'Aged Brie', sell_in: 1, quality: 3 },
      { name: 'Elixir of the Mongoose', sell_in: 4, quality: 6 },
      { name: 'Sulfuras, Hand of Ragnaros', sell_in: 0, quality: 80 },
      { name: 'Sulfuras, Hand of Ragnaros', sell_in: -1, quality: 80 },
      { name: 'Backstage passes to a TAFKAL80ETC concert', sell_in: 14, quality: 21 },
      { name: 'Backstage passes to a TAFKAL80ETC concert', sell_in: 9, quality: 50 },
      { name: 'Backstage passes to a TAFKAL80ETC concert', sell_in: 4, quality: 50 },
      { name: 'Conjured Mana Cake', sell_in: 2, quality: 4 },
    ]

    expect(desired.length).not.toBe(0)

    desired.forEach((item, index) => {
      expect(item.name).toBe(expected[index].name)
      expect(item.sell_in).toBe(expected[index].sell_in)
      expect(item.quality).toBe(expected[index].quality)
    })
  })
})
