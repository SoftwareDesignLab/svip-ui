export enum PALETTES {
  SINGLEHUE = '(CVD) Single Hue',
  MULTIHUE = '(CVD) Multi Hue',
  DEFAULT = 'Default',
}

const palettes: { [key: string]: string[] } = {
  [PALETTES.DEFAULT]: [
    ' #54AD78',
    '#FFD700',
    '#FF6000',
    '#5195EA',
    '#69599E',
    '#00FFFF',
    '#F44336',
    '#FF73DC',
    '#008080',
  ],
  [PALETTES.MULTIHUE]: [
    '#edf8fb',
    '#bfd3e6',
    '#9ebcda',
    '#8c96c6',
    '#8c6bb1',
    '#88419d',
    '#6e016b',
  ],
  [PALETTES.SINGLEHUE]: [
    '#eff3ff',
    '#c6dbef',
    '#9ecae1',
    '#6baed6',
    '#4292c6',
    '#2171b5',
    '#084594',
  ],
};

export default palettes;
