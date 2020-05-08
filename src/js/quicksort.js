// function swap(items, firstIndex, secondIndex){
//     const temp = items[firstIndex];
//     items[firstIndex] = items[secondIndex];
//     items[secondIndex] = temp;
// }

function partition(items, getValue, swap, ascending, left, right) {
    const direction = (a,b,bigger)=> bigger?a>b:a<b;
    var pivot   = getValue(items[Math.floor((right + left) / 2)]),
        i       = left,
        j       = right;
    while (i <= j) {
        while (direction(getValue(items[i]),pivot, ascending)) {
            i++;
        }
        while (direction(getValue(items[j]), pivot, !ascending)) {
            j--;
        }
        if (i <= j) {
            swap(items, i, j);
            i++;
            j--;
        }
    }
    return i;
}

function quickSort(items, getValue, swap, ascending, left, right) {
    var index;
    if (items.length > 1) {
        left = typeof left != "number" ? 0 : left;
        right = typeof right != "number" ? items.length - 1 : right;
        index = partition(items, getValue, swap, ascending, left, right);
        if (left < index - 1) {
            quickSort(items, getValue, swap, ascending, left, index - 1);
        }
        if (index < right) {
            quickSort(items, getValue, swap, ascending, index, right);
        }
    }
    return items;
}

export default quickSort;
