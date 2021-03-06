export function Item(name, sell_in, quality) {
  this.name = name
  this.sell_in = sell_in
  this.quality = quality
}

const MAX_QUALITY = 50
const MAX_LEGENDARY_QUALITY = 80
const MINI_QUALITY = 0
const STANDARD_DEGRADE = 1
const DOUBLE_DEGRADE = STANDARD_DEGRADE * 2
const BACKSTAGE_INCREASE_STANDARD = 1
const BACKSTAGE_INCREASE_LARGE = 2
const BACKSTAGE_INCREASE_EXTREME = 3
const BACKSTAGE_INCREASE_STANDARD_LIMIT = 10
const BACKSTAGE_INCREASE_EXTREME_LIMIT = 5

const isBrie = (name) => name.includes('Brie')
const isBackstagePass = (name) => name.includes('Backstage')
const isConjured = (name) => name.includes('Conjured')
const isSulfuras = (name) => name.includes('Sulfuras')

const isBackstageCat = (item) => [isBackstagePass(item), isBrie(item)].includes(true)
const isLegnedaryCat = (item) => [isSulfuras(item)].includes(true)
const isConjuredCat = (item) => [isConjured(item)].includes(true)

const backstageQualityCalculator = ({ sell_in, quality }) => {
  // between 10 and 5 days quality increase 2
  if (sell_in <= BACKSTAGE_INCREASE_STANDARD_LIMIT && sell_in >= BACKSTAGE_INCREASE_EXTREME_LIMIT && sell_in >= 0)
    quality += BACKSTAGE_INCREASE_LARGE
  // between 5 days and lower
  else if (sell_in <= BACKSTAGE_INCREASE_EXTREME_LIMIT && sell_in !== 0 && sell_in >= 0) quality += BACKSTAGE_INCREASE_EXTREME
  // if the concert is finished
  else if (sell_in <= 0) quality = 0
  // 11+ days quality 1 increase
  else quality += BACKSTAGE_INCREASE_STANDARD
  return quality
}

const qualityValidator = (quality) => Math.max(Math.min(quality, MAX_QUALITY), MINI_QUALITY)

const removeADay = (rose) => {
  rose.sell_in -= STANDARD_DEGRADE
  return rose
}

const transforms = {
  standard: (rose) => {
    rose = removeADay(rose)
    if (rose.quality !== 0) rose.quality -= rose.sell_in < 0 ? DOUBLE_DEGRADE : STANDARD_DEGRADE
    rose.quality = qualityValidator(rose.quality)
    return rose
  },
  backstage: (rose) => {
    rose = removeADay(rose)
    rose.quality = backstageQualityCalculator(rose)
    rose.quality = qualityValidator(rose.quality)
    return rose
  },
  legendary: (rose) => {
    if (rose.quality !== MAX_LEGENDARY_QUALITY) rose.quality = MAX_LEGENDARY_QUALITY
    return rose
  },
  conjured: (rose) => {
    rose = removeADay(rose)
    rose.quality -= DOUBLE_DEGRADE
    rose.quality = qualityValidator(rose.quality)
    return rose
  },
}

// All
//   Cannot go below 0 quality
//   quality never above 50
// Standard items
//   sell_in decreases 1 per day
//   quality < 0 degrades twice the standard rate
// Legendeary Items
//   never has to sold? What does that mean?
//   Quality 80
// Conjured Items
//   Degrade twice as fast as Standard Items
// Backstage Items
//   11+ days quality 1 increase
//   10 days quality increase 2
//   5 days quality increase 3
//   -1 days quality = 0

export const update_quality = (items = []) =>
  items.map((item) => {
    if (isBackstageCat(item.name)) return transforms.backstage(item)
    else if (isLegnedaryCat(item.name)) return transforms.legendary(item)
    else if (isConjuredCat(item.name)) return transforms.conjured(item)
    else return transforms.standard(item)
  })
