import { genArray } from './Tools';
import Cookies from 'js-cookie';
import _ from 'lodash';

export class PuzzleCookies {
  static ok: boolean[] = [];
  static init(size: number) {
    PuzzleCookies.ok = genArray(size, () => false);

    const s = Cookies.get('ok');
    console.log('read cookie:', s);
    if (typeof s === 'string') {
      for (let i of _.range(s.length)) {
        let num = parseInt(s[s.length - i - 1], 16);
        for (let j of _.range(4)) {
          if ((num >> j) % 2 === 1) {
            PuzzleCookies.ok[i * 4 + j] = true;
          }
        }
      }
    }
  }
  static save() {
    let num = 0;
    let hex = '';
    for (let i of _.rangeRight(PuzzleCookies.ok.length)) {
      num = num * 2 + (+PuzzleCookies.ok[i]);
      if (i % 4 === 0) {
        hex += num.toString(16);
        num = 0;
      }
    }
    console.log('save:', PuzzleCookies.ok.map(b => (b ? 'x' : '.')).join(''));
    Cookies.set('ok', hex, {
      secure: true,
      expires: new Date(9999, 12, 31),
      path: '/'
    });
  }
  static get(id: number): boolean {
    return PuzzleCookies.ok[id];
  }
  static set(id: number) {
    if (PuzzleCookies.ok[id] === false) {
      PuzzleCookies.ok[id] = true;
      PuzzleCookies.save();
    }
  }
  static clear() {
    _.fill(PuzzleCookies.ok, false);
    PuzzleCookies.save();
  }
  static count(): number {
    return _.sumBy(PuzzleCookies.ok, (x) => +x);
  }
}