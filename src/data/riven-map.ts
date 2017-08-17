export const rivenMap: {
  [key: string]: {
    p: string,
    s: string,
    type: '' | 'Projectile' | 'Melee',
    display_name: string | string[],
    display_amt_suffix: string
  }
} = {
  AmmoMaximum: { p: 'Ampi', s: 'Bin', type: 'Projectile', display_name: 'Ammo Maximum', display_amt_suffix: '%' },
  CorpusDamage: { p: 'Manti', s: 'Tron', type: '', display_name: 'Damage to Corpus', display_amt_suffix: '%' },
  GrineerDamage: { p: 'Argi', s: 'Con', type: '', display_name: 'Damage to Grineer', display_amt_suffix: '%' },
  InfestedDamage: { p: 'Pura', s: 'Ada', type: '' , display_name: 'Damage to Infested', display_amt_suffix: '%' },
  ColdDamage: { p: 'Geli', s: 'Do', type: '', display_name: 'Cold', display_amt_suffix: '%' }, // icon
  ChannelingDamage: { p: 'Tori', s: 'Bo', type: 'Melee', display_name: 'Channeling Damage', display_amt_suffix: '%' },
  ChannelingEfficiency: { p: 'Uti', s: 'Tia', type: 'Melee', display_name: 'Channeling Efficiency', display_amt_suffix: '%' },
  ComboDuration: { p: 'Tempi', s: 'Nem', type: 'Melee', display_name: 'Combo Duration', display_amt_suffix: 's' },
  CriticalChance: { p: 'Crita', s: 'Cron', type: '', display_name: 'Critical Chance', display_amt_suffix: '%' },
  CriticalChanceSlideAttack: { p: 'Pleci', s: 'Nent', type: 'Melee', display_name: 'Critical Chance on Slide Attacks', display_amt_suffix: '%' },
  CriticalDamage: { p: 'Acri', s: 'Tis', type: '', display_name: 'Critical Damage', display_amt_suffix: '%' },
  Damage: { p: 'Visi', s: 'Ata', type: '', display_name: 'Damage', display_amt_suffix: '%' },
  ElectricDamage: { p: 'Vexi', s: 'Tio', type: '', display_name: 'Electricity', display_amt_suffix: '%' },  // icon
  FireDamage: { p: 'Igni', s: 'Pha', type: '', display_name: 'Fire', display_amt_suffix: '%' }, // icon
  FinisherDamage: { p: 'Exi', s: 'Cta', type: 'Melee', display_name: 'Finisher', display_amt_suffix: '%' },
  AttackSpeed: { p: 'Croni', s: 'Dra', type: '', display_name: ['Fire Rate (x2 for Bows)', 'Fire Rate', 'Attack Speed'], display_amt_suffix: '%' },
  FlightSpeed: { p: 'Conci', s: 'Nak', type: 'Projectile', display_name: 'Flight Speed', display_amt_suffix: '%' },
  ImpactDamage: { p: 'Magna', s: 'Ton', type: '', display_name: 'Impact', display_amt_suffix: '%' }, // icon
  MagazineCapacity: { p: 'Arma', s: 'Tin', type: 'Projectile', display_name: 'Magazine Capacity', display_amt_suffix: '%' },
  Multishot: { p: 'Sati', s: 'Can', type: 'Projectile', display_name: 'Multishot', display_amt_suffix: '%' },
  ToxinDamage: { p: 'Toxi', s: 'Tox', type: '', display_name: 'Toxin', display_amt_suffix: '%' }, // icon
  PunchThrough: { p: 'Lexi', s: 'Nok', type: 'Projectile', display_name: 'Punch Through', display_amt_suffix: '' },
  PunctureDamage: { p: 'Insi', s: 'Cak', type: '', display_name: 'Puncture', display_amt_suffix: '%' }, // icon
  ReloadSpeed: { p: 'Feva', s: 'Tak', type: 'Projectile', display_name: 'Reload Speed', display_amt_suffix: '%' },
  Range: { p: 'Locti', s: 'Tor', type: 'Melee', display_name: 'Range', display_amt_suffix: '%' },
  SlashDamage: { p: 'Sci', s: 'Sus', type: '', display_name: 'Slash', display_amt_suffix: '%' }, // icon
  StatusChance: { p: 'Hexa', s: 'Dex', type: '', display_name: 'Status Chance', display_amt_suffix: '%' },
  StatusDuration: { p: 'Deci', s: 'Des', type: '', display_name: 'Status Duration', display_amt_suffix: '%' },
  Recoil: { p: 'Zeti', s: 'Mag', type: 'Projectile', display_name: 'Weapon Recoil', display_amt_suffix: '%' },
  Zoom: { p: 'Hera', s: 'Lis', type: 'Projectile', display_name: 'Zoom', display_amt_suffix: '%' },
};

export default rivenMap;
