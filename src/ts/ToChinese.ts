const map = [
  '', '一', '二', '三', '四',
  '五', '六', '七', '八', '九'
];

export default (x: number) => {
  if (x === 0) {
    return '零';
  } else if (x >= 1 && x <= 9) {
    return map[x];
  } else if (x >= 10 && x <= 19) {
    return '十' + map[x % 10];
  } else if (x >= 20 && x <= 99) {
    return map[Math.floor(x / 10)] + '十' + map[x % 10];
  } else {
    return '<unknown>';
  }
};