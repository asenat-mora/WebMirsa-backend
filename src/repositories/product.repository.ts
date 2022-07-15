import prisma from "../../prisma/prisma.client";
import { IProduct } from "../interfaces/product.interface";
import Operations from "../models/operations.model";

const selectObject = {
	id: true,
	code: true,
	sku: true,
	description: true,
	price: true,
	image: true,
	model: true,
	side: true,
	brand: {
		select: {
			id: true,
			name: true,
		},
	},
	accessory: {
		select: {
			id: true,
			name: true,
		},
	},
	productcolor: {
		select: {
			color: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	},
	user: {
		select: {
			id: true,
			name: true,
		},
	},
	last_modification_description: true,
	isDeleted: true,
}

async function createProduct(product: IProduct, accessoryId: number, brandId:number, colors: Array<number>, userId: number){

    const productCreated = await prisma.product.create({
        data: {
            ...product,
            last_modification_description: Operations.Created,
            brand: {
                connect: {
                    id: brandId
                }
            },
            accessory: {
                connect: {
                    id: accessoryId
                }
            },
            productcolor: {
                create: colors.map(color => ({
                    color_id: color
                }))
            },
            user: {
                connect: {
                    id: userId
                }
            }
        }
    });

    return productCreated;
}

async function updateProduct(product: IProduct, productId: number, accessoryId: number, brandId:number, colors: Array<number>, userId: number){
    const deletedColors = prisma.productcolor.deleteMany({
        where: {
            product_id: productId
        }
    });

    const updateP = prisma.product.update({
        where: {
            id: productId
        },
        data: {
            ...product,
            last_modification_description: Operations.Updated,
            brand: {
                connect: {
                    id: brandId
                }
            },
            accessory: {
                connect: {
                    id: accessoryId
                }
            },
            productcolor: {
                create: colors.map(color => ({
                    color_id: color
                }))
            },
            user: {
                connect: {
                    id: userId
                }
            }
        },
        select: selectObject
    });

    const transaction = await prisma.$transaction([deletedColors, updateP]);

    return transaction[1];
}

async function deleteProduct(productId: number, userId: number){
    return await prisma.product.update({
        where: {
            id: productId
        },
        data: {
            last_modification_description: Operations.Deleted,
            isDeleted: true,
            user: {
                connect: {
                    id: userId
                }
            }
        }
    });
}

async function getProductById(productId: number){
    return await prisma.product.findUnique({
        where: {
            id: productId
        },
        select: selectObject
    });
}

async function getAllProducts(){
    return await prisma.product.findMany({
        select: selectObject
    });
}

async function getProductByCode(code: string){
    return await prisma.product.findUnique({
        where: {
            code: code
        },
        select: selectObject
    });
}

export { createProduct, updateProduct, deleteProduct, getProductById, getAllProducts, getProductByCode };
