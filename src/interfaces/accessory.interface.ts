interface IAccessory {
    name: string
}

interface IAccessoryEdit extends IAccessory {
    id: number
}

export { IAccessory, IAccessoryEdit };