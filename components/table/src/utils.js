let colId = 1

export const NID = '@@col_id'
const PID = '@@p_id'
export const NO_CHILDREN = '@@no_children'
export const VISIBLE = '@@visible'
export const TYPE_SELECT = '@@type_select'

export const isGecko = (function () {
  return typeof window !== "undefined" && window.navigator.userAgent.indexOf('Gecko') !== -1
})()

export const isFixed = function (val) {
  return val === true || val === 'left' || val === 'right'
}

export const isLeftFixed = function (val) {
  return val === 'left' || val === true
}

export const isRightFixed = function (val) {
  return val === 'right'
}

const findSub = function (id, items) {
  let res = []
  items.forEach(item => {
    if (item[PID] === id) {
      res.push(item)
      if (items.some(it => it[PID] === item[NID])) {
        res = res.concat(findSub(item[NID], items))
      }
    }
  })
  return res
}

export const getColumnInstance = function (ins) {
  const slots = ins.$slots.default
  if (!slots) return []
  return slots.filter(vnode => {
    return vnode.componentInstance && vnode.componentInstance.$options.name === 't-table-column'
  }).map(vnode => vnode.componentInstance)
}

export const flatCols = function (inses) {
  const fns = function (inses, pid = null) {
    let cols = []
    inses.forEach(ins => {
      cols = cols.concat(fn(ins, pid))
    })
    return cols
  }

  const fn = function (ins, pid) {
    if (ins._props.hide) {
      return []
    }
    const nid = colId++
    const data = Object.assign({}, ins._props, {
      [NID]: nid,
      [PID]: pid,
      tpl: ins.$scopedSlots ? ins.$scopedSlots.default : undefined,
      headerTpl: ins.$scopedSlots ? ins.$scopedSlots.header : undefined,
      type: ins.type
    })
    const subInses = getColumnInstance(ins)
    if (subInses.length) {
      return [data, ...fns(subInses, nid)]
    } else {
      data[NO_CHILDREN] = true
      return [data]
    }
  }
  
  return fns(inses)
}

export const sortFixCols = function (flatCols) {
  const leftCols = flatCols.filter(col => col.fixed === true || col.fixed === 'left').sort((a, b) => a[NID] - b[NID])
  const rightCols = flatCols.filter(col => col.fixed === 'right').sort((a, b) => a[NID] - b[NID])
  const midCols = flatCols.filter(col => !('fixed' in col) || col.fixed !== true && col.fixed !== 'left' && col.fixed !== 'right')
  return [...leftCols, ...midCols, ...rightCols]
}

export const insertSelectCol = function (cols) {
  return [{
    [PID]: null,
    [NID]: 0,
    [NO_CHILDREN]: true,
    type: TYPE_SELECT,
    fixed: true,
    width: 80
  }].concat(cols)
}

export const fixesFixed = function (flatCols) {
  const data = flatCols.reduce((obj, item) => {
    obj[item[NID]] = Object.assign({}, item)
    return obj
  }, {})
  const done = []
  flatCols.forEach(col => {
    if (!isFixed(col.fixed) || done.indexOf(col[NID]) !== -1) {
      return
    }
    const subCols = findSub(col[NID], flatCols)
    subCols.forEach(item => {
      data[item[NID]].fixed = col.fixed
      done.push(item[NID])
    })
  })
  return Object.keys(data).map(k => data[k])
}

export const getLeftCols = function (flatCols) {
  const data = flatCols.reduce((obj, item) => {
    obj[item[NID]] = item
    return obj
  }, {})
  const leftObj = {}
  const leftCols = []
  flatCols.filter(col => isLeftFixed(col.fixed) && col[NO_CHILDREN] === true).forEach(col => {
    while (col[PID] !== null) {
      if (!leftObj[col[NID]]) {
        leftObj[col[NID]] = col
      }
      let cp = leftObj[col[PID]]
      if (!cp) {
        cp = Object.assign({}, data[col[PID]], {
          subCols: [col]
        })
      } else {
        if (!cp.subCols) {
          cp.subCols = []
        }
        if (cp.subCols.indexOf(col) === -1) {
          cp.subCols.push(col)
        }
      }
      col = cp
    }
    
    if (!col.subCols) {
      col.subCols = []
    }
    leftObj[col[NID]] = col
    if (leftCols.indexOf(col) === -1) {
      leftCols.push(col)
    }
  })
  
  return leftCols
}

export const getRightCols = function (flatCols) {
  const data = flatCols.reduce((obj, item) => {
    obj[item[NID]] = item
    return obj
  }, {})

  const rightObj = {}
  const rightCols = []
  flatCols.filter(col => isRightFixed(col.fixed) && col[NO_CHILDREN] === true).forEach(col => {
    while (col[PID] !== null) {
      if (!rightObj[col[NID]]) {
        rightObj[col[NID]] = col
      }
      let cp = rightObj[col[PID]]
      if (!cp) {
        cp = Object.assign({}, data[col[PID]], {
          subCols: [col]
        })
      } else {
        if (!cp.subCols) {
          cp.subCols = []
        }
        if (cp.subCols.indexOf(col) === -1) {
          cp.subCols.push(col)
        }
      }
      col = cp
    }
    if (!col.subCols) {
      col.subCols = []
    }
    rightObj[col[NID]] = col
    if (rightCols.indexOf(col) === -1) {
      rightCols.push(col)
    }
  })

  return rightCols
}

export const getMidCols = function (flatCols) {
  const data = flatCols.reduce((obj, item) => {
    obj[item[NID]] = item
    return obj
  }, {})

  const midObj = {}
  let midCols = []
  flatCols.filter(col => !isFixed(col.fixed) && col[NO_CHILDREN] === true).forEach(col => {
    while (col[PID] !== null) {
      if (!midObj[col[NID]]) {
        midObj[col[NID]] = col
      }
      let cp = midObj[col[PID]]
      if (!cp) {
        cp = Object.assign({}, data[col[PID]], {
          subCols: [col]
        })
      } else {
        if (!cp.subCols) {
          cp.subCols = []
        }
        if (cp.subCols.indexOf(col) === -1) {
          cp.subCols.push(col)
        }
      }
      col = cp
    }
    if (!col.subCols) {
      col.subCols = []
    }
    midObj[col[NID]] = col
    if (midCols.indexOf(col) === -1) {
      midCols.push(col)
    }
  })

  // 过滤掉所有子级都被fixed了的列
  // midCols = midCols.filter(col => {
  //   if (col.subCols.length) {
  //     return true
  //   } else {
  //     // 没有子级的情况：本身就没有 ｜　所有子级都被fixed
  //     return !flatCols.some(c => c[PID] === col[NID])
  //   }
  // })

  return midCols
}

export const getMaxLvByCol = function (col, lv) {
  const subCols = col.subCols || []
  if (subCols.length) {
    return getMaxLvByCols(subCols, lv + 1)
  } else {
    return lv
  }
}

export const getMaxLvByCols = function (cols, lv) {
  const lvs = []
  cols.forEach((col, idx) => {
    lvs[idx] = getMaxLvByCol(col, lv)
  })
  return Math.max(...lvs)
}

export const getSubColsCount = function (col) {
  const subCols = col.subCols || []
  if (subCols.length === 0) {
    return 1
  } else {
    return subCols.reduce((total, col) => {
      total += getSubColsCount(col)
      return total
    }, 0)
  }
}

export const getHeaderRenderDataByIns = function (col, lv, maxLv) {
  col.cols = getSubColsCount(col)
  const subCols = col.subCols || []
  if (subCols.length === 0) {
    col.rows = maxLv - lv + 1
  } else {
    col.rows = 1
  }
  col.row = lv
  return [col, ...getHeaderRenderDataByInses(subCols, lv + 1, maxLv)]
}

export const getHeaderRenderDataByInses = function (cols, lv, maxLv) {
  let data = []
  cols.forEach(col => {
    data = data.concat(getHeaderRenderDataByIns(col, lv, maxLv))
  })
  return data
}