import prisma from "../../prisma/prisma.client";
import { IProduct } from "../interfaces/product.interface";
import Operations from "../models/operations.model";

const selectObject = {
	id: true,
	sku: true,
	description: true,
	price: true,
	image: true,
	model: true,
	side: true,
	brandId: true,
    accessoryId: true,
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
	id_last_user: true,
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
        where: {
            isDeleted: false
        },
        select: selectObject
    });
}

/* async function getProductByCode(code: string){
    return await prisma.product.findUnique({
        where: {
            code: code
        },
        select: selectObject
    });
} */

function returnBrandSearchObject(brands: Array<number>, searchObject: any) {
    if(brands.length === 0 || brands === null) {
        return searchObject;
    }
    brands = brands.map(Number);
    searchObject.brandId = {
        in: brands
    }
    return searchObject;

}

function returnColorsSearchObject(colors: Array<number>, searchObject: any){
    if(colors.length === 0 || colors === null) {
        return searchObject;
    }
    colors = colors.map(Number);
    searchObject.productcolor = {
        some: {
            color_id: {
                in: colors
            }
        }
    }
    return searchObject;
}

function returnAccessoriesSearchObject(accessories: Array<number>, searchObject: any){
    if(accessories.length === 0 || accessories === null) {
        return searchObject;
    }
    accessories = accessories.map(Number);
    searchObject.accessoryId = {
        in: accessories
    }
    return searchObject;
}

function returnDescriptionSearchObject(description: string){
    if(description === null || description === "") {
        return {
            id: { not: 0 }
        };
    }
    
    return [{sku :{contains: description}},
            {description : {contains: description}}];
}

function returnSideSearchObject(side: string, searchObject: any){
    if(side.length === 0 || side === null) {
        return searchObject;
    }
    searchObject.side = {
        contains: side
    }
    return searchObject;
}


async function filterByAtrributes(brands: Array<number>, accessories: Array<number>, colors: Array<number>, description: string, side: string){

    let searchObject = {}
    let descriptionObject = returnDescriptionSearchObject(description);
    returnBrandSearchObject(brands, searchObject);
    returnAccessoriesSearchObject(accessories, searchObject);
    returnColorsSearchObject(colors, searchObject);
    returnSideSearchObject(side, searchObject);

    return await prisma.product.findMany({
        where:{
            AND: [
                searchObject,
            ],
            OR:
                descriptionObject
            ,
            isDeleted: false
        },
        
        select: selectObject
    });
}

export { createProduct, updateProduct, deleteProduct, getProductById, getAllProducts, filterByAtrributes };
