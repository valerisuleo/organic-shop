function groupBy(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
        let key = obj[property]
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(obj)
        return acc
    }, {})
}

function removeDuplicates(items, key) {
    const result = [];
    for (let i = 0; i < items.length; i++) {
        // Extract the title 
        const objTitle = items[i][key];

        if (!result.find(item => item[key] === objTitle)) {
            result.push(items[i])
        }
    };
    return result;
}

function pathMaker(string, id: string): string {
    const subPath: string = string.replace(/ /g, '').toLowerCase();
    return `categories/${id}/${subPath}`;
}

export default {
    groupBy,
    removeDuplicates,
    pathMaker
}