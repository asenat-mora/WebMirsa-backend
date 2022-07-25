interface IBrand{
    name: string;
}

interface IBrandEdit extends IBrand{
    id: number;
}

export { IBrand, IBrandEdit };