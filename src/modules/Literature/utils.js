/*Recursively sort Genre objects*/
export const recursiveSort = (arr, compareFn, childrenKey = 'children') => {
    let mapped = arr.map(e => e[childrenKey].length ? {
        ...e,
        [childrenKey]: recursiveSort(e[childrenKey], compareFn, childrenKey)
    } : e)
    return mapped.sort(compareFn)
}

/*Get array of ancestors, from top level to direct parent*/
export const getAncestors = (e, genres) => {
    let arr = []
    let currentEl = e
    while (currentEl.parent) {
        // eslint-disable-next-line no-loop-func
        let parent = genres.find(p => p.id === currentEl.parent);
        arr.unshift(parent.name)
        currentEl = parent
    }
    return arr
}

/*Add extra contextual information to the genres object*/
export const mapGenres = (e, genres) => {
    let ancestors = getAncestors(e, genres)
    return ({
        ...e,
        ancestors, /*for display*/
        fullName: [...ancestors, e.name].join(' '), /*for sorting*/
    })
}