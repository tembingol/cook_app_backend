type reruestContext = {
    currentUser: {
        userId: string
        userLogin: string
    }
}

declare global {
    declare module 'express-serve-static-core' {
        interface Request {
            context?: reruestContext;
        }
    }
}