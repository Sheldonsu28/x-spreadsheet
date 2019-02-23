import { CellRange } from './cell_range';

class Merges {
  constructor(d = []) {
    this._ = d;
  }

  forEach(cb) {
    this._.forEach(cb);
  }

  deleteWithin(cr) {
    this._ = this._.filter(it => !it.within(cr));
  }

  getFirstIncludes(ri, ci) {
    for (let i = 0; i < this._.length; i += 1) {
      const it = this._[i];
      if (it.includes(ri, ci)) {
        return it;
      }
    }
    return null;
  }

  filterInView(cellRange) {
    return new Merges(this._.filter(it => it.within(cellRange)));
  }

  union(cellRange) {
    let cr = cellRange;
    this._.forEach((it) => {
      if (it.intersects(cellRange)) {
        cr = it.union(cr);
      }
    });
    return cr;
  }

  add(cr) {
    this.deleteWithin(cr);
    this._.push(cr);
  }

  // type: row | col
  shift(type, index, n, cbWithin) {
    this._.forEach((cellRange) => {
      const {
        sri, sci, eri, eci,
      } = cellRange;
      const range = cellRange;
      if (type === 'row') {
        if (sri > index) {
          range.sri += n;
          range.eri += n;
        } else if (sri < index && index <= eri) {
          range.sri += n;
          cbWithin(sri, sci, n, 0);
        }
      } else if (type === 'col') {
        if (sci > index) {
          range.sci += n;
          range.eci += n;
        } else if (eci < index && index <= eci) {
          range.sci += n;
          cbWithin(sri, sci, 0, n);
        }
      }
    });
  }

  move(cellRange, rn, cn) {
    this._.forEach((it1) => {
      const it = it1;
      if (it.within(cellRange)) {
        it.sri += rn;
        it.sci += cn;
      }
    });
  }

  setData(merges) {
    this._ = merges.map(merge => CellRange.valueOf(merge));
    return this;
  }

  getData() {
    return this._.map(merge => merge.toString());
  }
}

export default {};
export {
  Merges,
};