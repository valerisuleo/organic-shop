let collectionBread = [
    {
        title: 'Pizza Slice',
        imageUrl: 'https://images.pexels.com/photos/4004463/pexels-photo-4004463.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
        price: 0.69,
        category: 'Bread',
        inStock: 30
    },
    {
        title: 'Brown Pie',
        imageUrl: 'https://images.pexels.com/photos/3223494/pexels-photo-3223494.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        price: 0.25,
        category: 'Bread',
        inStock: 60
    },
    {
        title: 'French Baguette',
        imageUrl: 'https://images.pexels.com/photos/1387070/pexels-photo-1387070.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
        price: 0.69,
        category: 'Bread',
        inStock: 90
    },
    {
        title: 'Cupcake with Chocolate Cubes',
        imageUrl: 'https://images.pexels.com/photos/1908675/pexels-photo-1908675.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
        price: 0.49,
        category: 'Bread',
        inStock: 120
    },
    {
        title: 'Double Chocolate Cookie',
        imageUrl: 'https://images.pexels.com/photos/6719/food-sugar-milk-cookie.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        price: 0.39,
        category: 'Bread',
        inStock: 150
    },
    {
        title: 'All Butter Croisssant',
        imageUrl: 'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        price: 0.37,
        category: 'Bread',
        inStock: 180
    },
]


collectionBread = collectionBread.map((item, index) => {
    return {
        ...item,
        seqN: index + 1,
    }
})


module.exports = {
    collectionBread
}










