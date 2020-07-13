const formTemplate = [
    {
        name: "title",
        type: "text",
        label: "Title",
        isRequired: true,
        minLenght: 6
    },
    {
        name: "price",
        type: "text",
        label: "Price",
        isRequired: true,
        minLenght: 2
    },
    {
        name: "categories",
        type: "select",
        label: "Categories",
        isRequired: false,
        minLenght: 0
    },
    {
        name: "imageUrl",
        type: "text",
        label: "Image Url",
        isRequired: true,
        minLenght: 6
    },
];

export default formTemplate;