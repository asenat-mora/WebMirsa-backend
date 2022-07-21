interface IProduct{
    code: string;
    sku: string;
    description: string;
    price: number;
    image: string;
    model: string;
    side: string;
}

interface IProductFilters {
	description: string;
	brands: Array<number>;
	accessories: Array<number>;
	colors: Array<number>;
}

export { IProduct, IProductFilters};