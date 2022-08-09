interface IColor {
    name: string
}

interface IColorEdit extends IColor {
    id: number
}

export { IColor, IColorEdit };