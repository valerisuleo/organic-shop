let collectionVegetable = [
    {
        title: 'Green Peapods',
        imageUrl: 'https://images.pexels.com/photos/1437587/pexels-photo-1437587.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
        price: 1.05,
        category: 'Vegetables',
        inStock: 25
    },
    {
        title: 'Mixed Peppers',
        imageUrl: 'https://images.pexels.com/photos/7017/food-peppers-kitchen-yum.jpg?auto=compress&cs=tinysrgb&dpr=2&w=500',
        price: 1.60,
        category: 'Vegetables',
        inStock: 50
    },
    {
        title: 'Organic Carrots',
        imageUrl: 'https://images.pexels.com/photos/3297799/pexels-photo-3297799.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        price: 0.95,
        category: 'Vegetables',
        inStock: 75
    },
    {
        title: 'Broccoli',
        imageUrl: 'https://images.pexels.com/photos/4055255/pexels-photo-4055255.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        price: 1.09,
        category: 'Vegetables',
        inStock: 100
    },
    {
        title: 'Vine Tomatoes',
        imageUrl: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        price: 1.45,
        category: 'Vegetables',
        inStock: 125
    }
]


collectionVegetable = collectionVegetable.map((item, index) => {
    return {
        ...item,
        seqN: index + 1,
    }
})


module.exports = {
    collectionVegetable
}










