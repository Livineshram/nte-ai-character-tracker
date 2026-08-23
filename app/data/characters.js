// Character metadata only. Keep this file focused on roster/presentation data.
const NTE_CHARACTERS = [
  { id:'chaos', name:'Chaos', faction:'Containment Unit', icon:'🖤' },
  { id:'shinku', name:'Shinku', faction:'NTE', icon:'🌸' },
  { id:'iroi', name:'Iroi', faction:'NTE', icon:'🦋' },
  { id:'lacrimosa', name:'Lacrimosa', faction:'NTE', icon:'🌙' },
  { id:'hotori', name:'Hotori', faction:'NTE', icon:'🔥' },
  { id:'nanally', name:'Nanally', faction:'NTE', icon:'⚡' },
  { id:'chiz', name:'Chiz', faction:'NTE', icon:'🎀' },
  { id:'hathor', name:'Hathor', faction:'NTE', icon:'☀️' },
  { id:'jiuyuan', name:'Jiuyuan', faction:'Sterry Express', icon:'🌹' },
  { id:'fadia', name:'Fadia', faction:'NTE', icon:'✨' },
  { id:'sakiri', name:'Sakiri', faction:'NTE', icon:'🌊' },
  { id:'baicang', name:'Baicang', faction:'NTE', icon:'🐾' },
  { id:'daffodill', name:'Daffodill', faction:'NTE', icon:'🌼' },
  { id:'aurelia', name:'Aurelia', faction:'NTE', icon:'💫' },
  { id:'mint', name:'Mint', faction:'Bureau of Anomaly Control', icon:'🐱' },
  { id:'adler', name:'Adler', faction:'NTE', icon:'🛡️' },
  { id:'skia', name:'Skia', faction:'NTE', icon:'🎧' },
  { id:'haniel', name:'Haniel', faction:'NTE', icon:'😇' },
  { id:'edgar', name:'Edgar', faction:'NTE', icon:'📚' }
];

function getCharacter(id){ return NTE_CHARACTERS.find(c => c.id === id) || NTE_CHARACTERS[0]; }
