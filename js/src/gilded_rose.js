function Item(name, sell_in, quality) {
  this.name = name
  this.sell_in = sell_in
  this.quality = quality
}

function update_quality(items = []) {
  const MAX_QUALITY = 50
  const MAX_LEGENDARY_QUALITY = 80
  const MINIMUM_QUALITY = 0
  const STANDARD_DEGRADE = -1
  const DOUBLE_DEGRADE = -2
  const TRIPPLE_DEGRADE = -3
  
  const isBrie = (name) => name.includes('Brie')
  const isBackstagePass = (name) => name.includes('Backstage passes')
  const isSulfuras = (name) => name.includes('Sulfuras')
  const isConjured = (name) => name.includes('Conjured')
  
  const standardItems = []
  const legendaryItems = ['Sulfuras, Hand of Ragnaros']
  const backStageItems = ['Aged Brie', 'Backstage passes to a TAFKAL80ETC concert']
  
  for (let i = 0; i < items.length; i++) {
    // Normal degrade
    if (!isBrie(items[i].name) && !isBackstagePass(items[i].name)) {
      if (items[i].quality > MINIMUM_QUALITY) {
        if (!isSulfuras(items[i].name)) {
          if (isConjured(items[i].name)) {
            items[i].quality = items[i].quality - 2
          } else {
            items[i].quality = items[i].quality - 1
          }
        }
      }
    } else {
      // increase quality
      if (items[i].quality < 50) {
        items[i].quality = items[i].quality + 1
        if (items[i].name === 'Backstage passes to a TAFKAL80ETC concert') {
          if (items[i].sell_in < 11) {
            if (items[i].quality < 50) {
              items[i].quality = items[i].quality + 1
            }
          }
          if (items[i].sell_in < 6) {
            if (items[i].quality < 50) {
              items[i].quality = items[i].quality + 1
            }
          }
        }
      }
    }
    // increase sulfuras
    if (items[i].name !== 'Sulfuras, Hand of Ragnaros') {
      items[i].sell_in = items[i].sell_in - 1
    }
    //
    if (items[i].sell_in < 0) {
      if (items[i].name !== 'Aged Brie') {
        if (items[i].name !== 'Backstage passes to a TAFKAL80ETC concert') {
          if (items[i].quality > 0) {
            if (items[i].name !== 'Sulfuras, Hand of Ragnaros') {
              items[i].quality = items[i].quality - 1
            }
          }
        } else {
          items[i].quality = items[i].quality - items[i].quality
        }
      } else {
        if (items[i].quality < 50) {
          items[i].quality = items[i].quality + 1
        }
      }
    }
  }
  return items
}
