// Character metadata only. Keep this file focused on roster/presentation data.
const NTE_CHARACTERS = [
  { 
    id: 'chaos', 
    name: 'Chaos', 
    faction: 'Containment Unit', 
    icon: '🖤',
    rarity: 'SSR',
    element: 'Dark',
    weapon: 'Scythe',
    role: 'DPS',
    releaseDate: '2024-01-15',
    voiceActor: {
      jp: '未知',
      cn: '未知',
      en: 'Unknown'
    }
  },
  { 
    id: 'shinku', 
    name: 'Shinku', 
    faction: 'NTE', 
    icon: '🌸',
    rarity: 'SR',
    element: 'Fire',
    weapon: 'Blade',
    role: 'Support',
    releaseDate: '2024-01-15',
    voiceActor: {
      jp: '未知',
      cn: '未知',
      en: 'Unknown'
    }
  },
  { 
    id: 'iroi', 
    name: 'Iroi', 
    faction: 'NTE', 
    icon: '🦋',
    rarity: 'SR',
    element: 'Wind',
    weapon: 'Bow',
    role: 'Support',
    releaseDate: '2024-02-01',
    voiceActor: {
      jp: '未知',
      cn: '未知',
      en: 'Unknown'
    }
  },
  { 
    id: 'lacrimosa', 
    name: 'Lacrimosa', 
    faction: 'NTE', 
    icon: '🌙',
    rarity: 'SSR',
    element: 'Water',
    weapon: 'Catalyst',
    role: 'Healer',
    releaseDate: '2024-02-15',
    voiceActor: {
      jp: '未知',
      cn: '未知',
      en: 'Unknown'
    }
  },
  { 
    id: 'hotori', 
    name: 'Hotori', 
    faction: 'NTE', 
    icon: '🔥',
    rarity: 'SR',
    element: 'Fire',
    weapon: 'Gauntlets',
    role: 'DPS',
    releaseDate: '2024-03-01',
    voiceActor: {
      jp: '未知',
      cn: '未知',
      en: 'Unknown'
    }
  },
  { 
    id: 'nanally', 
    name: 'Nanally', 
    faction: 'NTE', 
    icon: '⚡',
    rarity: 'SSR',
    element: 'Electric',
    weapon: 'Dual Blades',
    role: 'DPS',
    releaseDate: '2024-03-15',
    voiceActor: {
      jp: '未知',
      cn: '未知',
      en: 'Unknown'
    }
  },
  { 
    id: 'chiz', 
    name: 'Chiz', 
    faction: 'NTE', 
    icon: '🎀',
    rarity: 'SR',
    element: 'Ice',
    weapon: 'Wand',
    role: 'Support',
    releaseDate: '2024-04-01',
    voiceActor: {
      jp: '未知',
      cn: '未知',
      en: 'Unknown'
    }
  },
  { 
    id: 'hathor', 
    name: 'Hathor', 
    faction: 'NTE', 
    icon: '☀️',
    rarity: 'SSR',
    element: 'Light',
    weapon: 'Staff',
    role: 'Healer',
    releaseDate: '2024-04-15',
    voiceActor: {
      jp: '未知',
      cn: '未知',
      en: 'Unknown'
    }
  },
  { 
    id: 'jiuyuan', 
    name: 'Jiuyuan', 
    faction: 'Sterry Express', 
    icon: '🌹',
    rarity: 'SSR',
    element: 'Dark',
    weapon: 'Rapier',
    role: 'DPS',
    releaseDate: '2024-05-01',
    voiceActor: {
      jp: '未知',
      cn: '未知',
      en: 'Unknown'
    }
  },
  { 
    id: 'fadia', 
    name: 'Fadia', 
    faction: 'NTE', 
    icon: '✨',
    rarity: 'SR',
    element: 'Light',
    weapon: 'Orb',
    role: 'Support',
    releaseDate: '2024-05-15',
    voiceActor: {
      jp: '未知',
      cn: '未知',
      en: 'Unknown'
    }
  },
  { 
    id: 'sakiri', 
    name: 'Sakiri', 
    faction: 'NTE', 
    icon: '🌊',
    rarity: 'SSR',
    element: 'Water',
    weapon: 'Spear',
    role: 'DPS',
    releaseDate: '2024-06-01',
    voiceActor: {
      jp: '未知',
      cn: '未知',
      en: 'Unknown'
    }
  },
  { 
    id: 'baicang', 
    name: 'Baicang', 
    faction: 'NTE', 
    icon: '🐾',
    rarity: 'SR',
    element: 'Wind',
    weapon: 'Claws',
    role: 'DPS',
    releaseDate: '2024-06-15',
    voiceActor: {
      jp: '未知',
      cn: '未知',
      en: 'Unknown'
    }
  },
  { 
    id: 'daffodill', 
    name: 'Daffodill', 
    faction: 'NTE', 
    icon: '🌼',
    rarity: 'SR',
    element: 'Nature',
    weapon: 'Bow',
    role: 'Support',
    releaseDate: '2024-07-01',
    voiceActor: {
      jp: '未知',
      cn: '未知',
      en: 'Unknown'
    }
  },
  { 
    id: 'aurelia', 
    name: 'Aurelia', 
    faction: 'NTE', 
    icon: '💫',
    rarity: 'SSR',
    element: 'Light',
    weapon: 'Sword',
    role: 'DPS',
    releaseDate: '2024-07-15',
    voiceActor: {
      jp: '未知',
      cn: '未知',
      en: 'Unknown'
    }
  },
  { 
    id: 'mint', 
    name: 'Mint', 
    faction: 'Bureau of Anomaly Control', 
    icon: '🐱',
    rarity: 'SSR',
    element: 'Ice',
    weapon: 'Gun',
    role: 'DPS',
    releaseDate: '2024-08-01',
    voiceActor: {
      jp: '未知',
      cn: '未知',
      en: 'Unknown'
    }
  },
  { 
    id: 'adler', 
    name: 'Adler', 
    faction: 'NTE', 
    icon: '🛡️',
    rarity: 'SR',
    element: 'Earth',
    weapon: 'Shield',
    role: 'Tank',
    releaseDate: '2024-08-15',
    voiceActor: {
      jp: '未知',
      cn: '未知',
      en: 'Unknown'
    }
  },
  { 
    id: 'skia', 
    name: 'Skia', 
    faction: 'NTE', 
    icon: '🎧',
    rarity: 'SR',
    element: 'Sound',
    weapon: 'Microphone',
    role: 'Support',
    releaseDate: '2024-09-01',
    voiceActor: {
      jp: '未知',
      cn: '未知',
      en: 'Unknown'
    }
  },
  { 
    id: 'haniel', 
    name: 'Haniel', 
    faction: 'NTE', 
    icon: '😇',
    rarity: 'SSR',
    element: 'Light',
    weapon: 'Halo',
    role: 'Healer',
    releaseDate: '2024-09-15',
    voiceActor: {
      jp: '未知',
      cn: '未知',
      en: 'Unknown'
    }
  },
  { 
    id: 'edgar', 
    name: 'Edgar', 
    faction: 'NTE', 
    icon: '📚',
    rarity: 'SR',
    element: 'Dark',
    weapon: 'Book',
    role: 'Support',
    releaseDate: '2024-10-01',
    voiceActor: {
      jp: '未知',
      cn: '未知',
      en: 'Unknown'
    }
  }
];

// Helper functions for filtering and validation
function getCharacter(id) { 
  return NTE_CHARACTERS.find(c => c.id === id) || null; 
}

function getCharactersByFaction(faction) {
  return NTE_CHARACTERS.filter(c => c.faction === faction);
}

function getCharactersByRarity(rarity) {
  return NTE_CHARACTERS.filter(c => c.rarity === rarity);
}

function getCharactersByElement(element) {
  return NTE_CHARACTERS.filter(c => c.element === element);
}

function getCharactersByRole(role) {
  return NTE_CHARACTERS.filter(c => c.role === role);
}

function getCharacterCount() {
  return NTE_CHARACTERS.length;
}

function validateCharacterData() {
  const errors = [];
  const ids = new Set();
  
  NTE_CHARACTERS.forEach(char => {
    // Check for duplicate IDs
    if (ids.has(char.id)) {
      errors.push(`Duplicate character ID: ${char.id}`);
    }
    ids.add(char.id);
    
    // Check required fields
    if (!char.name) errors.push(`Missing name for character ${char.id}`);
    if (!char.faction) errors.push(`Missing faction for character ${char.id}`);
    if (!char.icon) errors.push(`Missing icon for character ${char.id}`);
    
    // Check if character has gift data
    if (!BOND_GIFTS[char.id] || BOND_GIFTS[char.id].length === 0) {
      console.warn(`No bond gift data available for ${char.name} (${char.id})`);
    }
  });
  
  return errors;
}