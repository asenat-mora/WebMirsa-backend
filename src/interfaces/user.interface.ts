interface IUser {
    name: string,
    surname: string,
    email: string,
    password: string,
    verificationEmail: string,
}

interface ILoginUser{
    email: string,
    password: string,
}

export { IUser, ILoginUser };