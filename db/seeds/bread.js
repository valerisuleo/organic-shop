let collectionBread = [
    {
        title: 'Pizza Slice',
        imageUrl: 'https://www.dropbox.com/s/0dymh0nkdhccz6j/119627_01.jpg?raw=1',
        price: 0.69,
        category: 'Bread',
        inStock: 30
    },
    {
        title: 'Italian Style Panini Roll',
        imageUrl: 'https://www.dropbox.com/s/b03fg3pjd8m9e0z/1950_01.jpg?raw=1',
        price: 0.25,
        category: 'Bread',
        inStock: 60
    },
    {
        title: 'French Baguette',
        imageUrl: 'https://www.dropbox.com/s/kgpaae6jahstelz/6742_01.jpg?raw=1',
        price: 0.69,
        category: 'Bread',
        inStock: 90
    },
    {
        title: 'Maple and Pecan',
        imageUrl: 'https://www.dropbox.com/s/8wqgzxumpz9e99w/6817_01.jpg?raw=1',
        price: 0.49,
        category: 'Bread',
        inStock: 120
    },
    {
        title: 'Double Chocolate Cookie',
        imageUrl: 'https://www.dropbox.com/s/lqjddrhhehdwiow/5207811_01.jpg?raw=1',
        price: 0.39,
        category: 'Bread',
        inStock: 150
    },
    {
        title: 'All Butter Croisssant',
        imageUrl: 'https://www.dropbox.com/s/ojwtiirrdvo1mhs/121278_01.jpg?raw=1',
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










