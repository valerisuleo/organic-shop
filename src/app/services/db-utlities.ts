export function snapsCoverter(snaps) {
    
    return snaps.map((rawData) => {
        const obj = rawData.payload.doc.data();
        obj.id = rawData.payload.doc.id;
        return obj;
    });
}