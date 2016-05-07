import memoize from 'lodash/memoize';

export const rtlRegExp = /[\u060C-\u06FE\uFB50-\uFEFC]/gi;

export const isRTL = (text, threshold = 0.2) => {
  const matches = text.match(rtlRegExp);
  const count = matches ? matches.length : 0;
  return count / text.length > threshold;
};

export const autodir = memoize(text => (isRTL(text) ? 'rtl' : 'ltr'));

export default autodir;
