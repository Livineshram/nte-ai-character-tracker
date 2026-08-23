// Bond gift data only. Fields: name, affection, price, location, availability.
// Verified Chaos entries are kept separate so future character audits are easy.
const BOND_GIFTS = {
  chaos: [
    {name: 'A Handwritten Letter', affection: 2000, price: null, location: 'Warp Exchange → Circle Bounty', availability: 'free', unlimited: true},
    {name: 'Deluxe Ship Model Kit', affection: 1200, price: null, location: 'Paid Products', availability: 'paid', unlimited: true},
    {name: 'Floe Cinema Ticket', affection: 400, price: null, location: 'Event Reward / Maintenance Compensation', availability: 'event', unlimited: true},
    {name: 'Kokoro Rider L1 - Eradicator', affection: 400, price: 14400, location: 'DSD POP — Illusion Town; New Herland District', availability: 'shop'},
    {name: 'Kokoro Rider L1 - Metal Strategist', affection: 400, price: 14400, location: 'DSD POP — Illusion Town; New Herland District', availability: 'shop'},
    {name: 'On Track', affection: 400, price: 20000, location: 'Electronics Store — Miguel District; New Herland District', availability: 'shop'},
    {name: '9331', affection: 200, price: 7500, location: 'Oops! Chest Gift Shop — Bridge Crossings', availability: 'shop'},
    {name: 'Kokoro Rider L1 - Silent Vow', affection: 200, price: null, location: 'Gacha Machine', availability: 'gacha'},
    {name: 'Sin, Vice, Crime', affection: 200, price: 6000, location: 'Bookstore — New Herland District', availability: 'shop'},
    {name: 'Firework Seafood Paella', affection: 100, price: null, location: 'Source not reliably confirmed', availability: 'unknown'},
    {name: 'Hamburger Steak XL', affection: 100, price: 420, location: 'Food shop / restaurant source', availability: 'shop'},
    {name: 'Refreshing Fruity', affection: 100, price: 480, location: 'Refresh Recharge Vending Machine; Convenience Store — New Herland District', availability: 'shop'},
    {name: 'Kokoro Rider L1 - Splendor', affection: 100, price: null, location: 'Gacha Machine', availability: 'gacha'}
  ],
  shinku: [
    {name: 'Puka Chocoa Ellie Tour Special', affection: 100, price: 1050, location: 'Puka Candy Vending Machine; Puka Candy Shop — Bridge Crossings', availability: 'shop'},
    {name: 'Golden Spring', affection: 200, price: 7500, location: 'Florist — Bridge Crossings; Illusion Town', availability: 'shop'},
    {name: 'Gigafluff - The Strong', affection: 400, price: 12000, location: 'DSD POP — Bridge Crossings; Miguel District; Anecdote Quest', availability: 'shop'}
  ],
  iroi: [
    {name: '999 Nights', affection: 400, price: 15000, location: 'DSD POP — New Herland District', availability: 'shop'},
    {name: 'Unknown Mystery Box', affection: 1200, price: null, location: 'Paid Products', availability: 'paid', unlimited: true},
    {name: 'Puka Sweet Dreams Marshmallow', affection: 100, price: 660, location: 'Puka Candy Vending Machine; Puka Candy Shops', availability: 'shop'},
    {name: 'Asahi Inori - Flowing Delusion', affection: 200, price: null, location: 'Gacha Machine', availability: 'gacha'},
    {name: 'Floe Cinema Ticket', affection: 400, price: null, location: 'Event Reward / Maintenance Compensation', availability: 'event', unlimited: true},
    {name: 'Asahi Inori - Argentum Persona', affection: 400, price: null, location: 'Gacha Machine', availability: 'gacha'},
    {name: 'Solitude', affection: 200, price: 10000, location: 'Oops! Chest Gift Shop — Illusion Town; DSD POP — New Herland District', availability: 'shop'}
  ],
  lacrimosa: [
    {name: 'Tomato 100', affection: 100, price: 300, location: 'Gift shop source', availability: 'shop'},
    {name: 'Chill Out', affection: 200, price: 4000, location: 'Bookstore — Bridge Crossings; Illusion Town; Miguel District', availability: 'shop'},
    {name: 'Bunny Box', affection: 400, price: 20000, location: 'Electronics Store — Bridge Crossings', availability: 'shop'}
  ],
  hotori: [
    {name: 'Ebisu Royal Tower', affection: 100, price: null, location: 'Story Reward', availability: 'story'},
    {name: 'Golden Spring', affection: 200, price: 7500, location: 'Florist — Bridge Crossings; Illusion Town', availability: 'shop'},
    {name: 'Zhu! Vitamin!', affection: 100, price: 750, location: 'Pharmacy — Bridge Crossings; Illusion Town; Miguel District; New Herland District', availability: 'shop'},
    {name: 'Floe Cinema Ticket', affection: 400, price: null, location: 'Event Reward / Maintenance Compensation', availability: 'event', unlimited: true},
    {name: 'Golden Moon', affection: 400, price: 15000, location: 'Electronics Store — Illusion Town', availability: 'shop'},
    {name: 'Yellow Glaze Vase', affection: 200, price: 3600, location: 'Florist — Bridge Crossings; Miguel District', availability: 'shop'},
    {name: 'Chiyo Family Brew', affection: 100, price: 300, location: 'Izakaya — Bridge Crossings; Miguel District; New Herland District', availability: 'shop'}
  ],
  nanally: [
    {name: 'Cool-lala Spicy Snack', affection: 100, price: 300, location: 'Vending Machine; Convenience Store — New Herland District', availability: 'shop'},
    {name: 'Gubichi Original Flavor Chips', affection: 100, price: 360, location: 'Gubicrisp Vending Machine; Convenience Stores', availability: 'shop'},
    {name: 'Nekomaru Oni Ramen', affection: 100, price: 600, location: 'Ramen Shops — all districts', availability: 'shop'},
    {name: 'Blazing Crimson', affection: 200, price: 5400, location: 'Florist — Illusion Town', availability: 'shop'},
    {name: 'We Are One', affection: 200, price: 6000, location: 'Bookstore — Bridge Crossings; Miguel District', availability: 'shop'},
    {name: 'Sin, Vice, Crime', affection: 200, price: 6000, location: 'Bookstore — New Herland District', availability: 'shop'},
    {name: 'Kokoro Rider L1 - Silent Vow', affection: 200, price: null, location: 'Gacha Machine', availability: 'gacha'},
    {name: 'Kokoro Rider L1 - Metal Strategist', affection: 400, price: 14400, location: 'DSD POP — Bridge Crossings; Miguel District', availability: 'shop'},
    {name: 'Kokoro Rider L1 - Eradicator', affection: 400, price: 14400, location: 'DSD POP — Illusion Town; New Herland District', availability: 'shop'},
    {name: 'Kokoro Rider L1 - Ultimate Skill', affection: 400, price: null, location: 'Gacha Machine', availability: 'gacha'},
    {name: 'A Handwritten Letter', affection: 2000, price: null, location: 'Warp Exchange → Circle Bounty', availability: 'free', unlimited: true},
    {name: 'Floe Cinema Ticket', affection: 400, price: null, location: 'Event Reward / Maintenance Compensation', availability: 'event', unlimited: true}
  ],
  chiz: [
    {name: 'Puka Sweet Dreams Marshmallow', affection: 100, price: 660, location: 'Puka Candy Vending Machine; Puka Candy Shops', availability: 'shop'},
    {name: 'Rose Lychee Cake', affection: 100, price: 660, location: 'Bakery — Bridge Crossings; New Herland District', availability: 'shop'},
    {name: 'Nyanko Punch Taro Pudding Milktea', affection: 100, price: 450, location: 'Milk Tea Shops — all districts', availability: 'shop'},
    {name: 'Holy Worship Month', affection: 200, price: 6600, location: 'Florist — Bridge Crossings', availability: 'shop'},
    {name: 'Sweet Pink', affection: 200, price: 5400, location: 'Florist — Illusion Town', availability: 'shop'},
    {name: 'Fantasia', affection: 200, price: 3000, location: 'Florists — all districts', availability: 'shop'},
    {name: 'Bunny Box', affection: 400, price: 20000, location: 'Electronics Store — Bridge Crossings', availability: 'shop'},
    {name: 'A Handwritten Letter', affection: 2000, price: null, location: 'Warp Exchange → Circle Bounty', availability: 'free', unlimited: true},
    {name: 'Floe Cinema Ticket', affection: 400, price: null, location: 'Event Reward / Maintenance Compensation', availability: 'event', unlimited: true}
  ],
  hathor: [
    {name: '0-K Cold Brew', affection: 100, price: 600, location: 'Vending Machine; Convenience Stores', availability: 'shop'},
    {name: 'Colorful Light Salad', affection: 100, price: 450, location: 'Family Restaurants — all districts', availability: 'shop'},
    {name: 'Cooly Cool Refresher', affection: 100, price: 600, location: 'Pharmacies — all districts', availability: 'shop'},
    {name: "Nightingale's Sonata", affection: 200, price: 6000, location: 'Florist — Bridge Crossings', availability: 'shop'},
    {name: 'Fever Dream', affection: 200, price: 5000, location: 'Oops! Chest Gift Shop — Bridge Crossings', availability: 'shop'},
    {name: 'On Track', affection: 400, price: 20000, location: 'Electronics Store — Miguel District; New Herland District', availability: 'shop'},
    {name: 'A Handwritten Letter', affection: 2000, price: null, location: 'Warp Exchange → Circle Bounty', availability: 'free', unlimited: true},
    {name: 'Floe Cinema Ticket', affection: 400, price: null, location: 'Event Reward / Maintenance Compensation', availability: 'event', unlimited: true}
  ],
  jiuyuan: [
    {name: 'Magi-Puff Whole Wheat Bread', affection: 100, price: 360, location: 'Vending Machine; Convenience Store — Bridge Crossings; Miguel District', availability: 'shop'},
    {name: 'Cold Brew', affection: 100, price: 450, location: 'Café — all districts', availability: 'shop'},
    {name: 'Ebisu Royal Tower', affection: 100, price: null, location: 'Story Reward', availability: 'story'},
    {name: "Nightingale's Sonata", affection: 200, price: 6000, location: 'Florist — Bridge Crossings', availability: 'shop'},
    {name: 'Moon Vase', affection: 200, price: 3000, location: 'Florist — Bridge Crossings; Miguel District', availability: 'shop'},
    {name: 'On Track', affection: 400, price: 20000, location: 'Electronics Store — Miguel District; New Herland District', availability: 'shop'},
    {name: 'A Handwritten Letter', affection: 2000, price: null, location: 'Warp Exchange → Circle Bounty', availability: 'free', unlimited: true},
    {name: 'Floe Cinema Ticket', affection: 400, price: null, location: 'Event Reward / Maintenance Compensation', availability: 'event', unlimited: true}
  ],
  mint: [
    {name: 'Gubicrisp', affection: 100, price: 300, location: 'Gubicrisp Vending Machine; Convenience Store — Miguel District', availability: 'shop'},
    {name: 'Super Tonkotsu Ramen', affection: 100, price: 600, location: 'Izakaya — Bridge Crossings; Miguel District; New Herland District', availability: 'shop'},
    {name: 'Nyanko Punch Taro Pudding Milktea', affection: 100, price: 450, location: 'Milk Tea Shops — all districts', availability: 'shop'},
    {name: 'Waltz', affection: 200, price: 3000, location: 'Florists — all districts', availability: 'shop'},
    {name: 'Secrets of the Bag…', affection: 200, price: 4800, location: 'Bookstore — Bridge Crossings; Illusion Town; Miguel District', availability: 'shop'},
    {name: 'Asahi Inori - Moonlight', affection: 400, price: 18000, location: 'DSD POP — Illusion Town; New Herland District', availability: 'shop'},
    {name: 'Asahi Inori - Crimson', affection: 400, price: 18000, location: 'DSD POP — Illusion Town; New Herland District', availability: 'shop'},
    {name: 'Asahi Inori - Moonsilver', affection: 400, price: null, location: 'Gacha Machine', availability: 'gacha'},
    {name: 'A Handwritten Letter', affection: 2000, price: null, location: 'Warp Exchange → Circle Bounty', availability: 'free', unlimited: true},
    {name: 'Floe Cinema Ticket', affection: 400, price: null, location: 'Event Reward / Maintenance Compensation', availability: 'event', unlimited: true}
  ]
};

// For characters not yet audited, return an empty list rather than silently inventing data.
function getBondGifts(characterId) { 
  return BOND_GIFTS[characterId] || []; 
}