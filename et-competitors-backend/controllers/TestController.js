import prismaClient from "../utils/prismaClient.js"

export const index = async (request,response)=>{
    try {
        return response.status(200).json({
           test:"new test"
        })
    } catch (error) {
        return response.status(406).json({
            error:error
        })
    }
    finally{
        await prismaClient.$disconnect()
    }
}