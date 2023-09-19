export enum PALETTE {
  DEFAULT = 'Default',
  MULTIHUE = 'Multi Hue (CVD)',
  SINGLEHUE = 'Single Hue (CVD)',
}

const palettes: { [key: string]: string[] } = {
  [PALETTE.DEFAULT]: [
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
  [PALETTE.MULTIHUE]: [
    '#edf8fb',
    '#bfd3e6',
    '#9ebcda',
    '#8c96c6',
    '#8c6bb1',
    '#88419d',
    '#6e016b',
  ],
  [PALETTE.SINGLEHUE]: [
    '#edf8e9',
    '#c7e9c0',
    '#a1d99b',
    '#74c476',
    '#41ab5d',
    '#238b45',
    '#005a32',
  ],
};

export interface resultStatus {
  [key: string]: { shown: boolean; color: string };
}

export default palettes;
