interface IBrand{
    name: string;
    key: string;
}

interface IBrandEdit extends IBrand{
    id: number;
}

export { IBrand, IBrandEdit };
