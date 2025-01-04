import { config } from 'dotenv'
config() // добавление переменных из файла .env в process.env


export const SETTINGS = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: process.env.PORT || 4004,
    ADMIN_AUTH: process.env.ADMIN_AUTH || 'admin:qwerty',
    // MONGO_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
    MONGO_URL: process.env.MONGO_URL,
    DB_NAME: process.env.DB_NAME || 'qus_cook_app',

    EMAILMANAGERLOGIN: process.env.EMAILMANAGERLOGIN || 'login',
    EMAILMANAGERPASSWORD: process.env.EMAILMANAGERPASSWORD || 'password',
    EMAILMANAGERHOST: process.env.EMAILMANAGERHOST || 'smtp.mail.ru',
    EMAILMANAGERPORT: process.env.EMAILMANAGERPORT || 465,
    
    USERS_COLLECTION_NAME: 'users',
    USERSCREDENTIALS_COLLECTION_NAME: 'usersCredentials',
    JWT_TOKENS_COLLECTION_NAME: 'jwt_tokens',

    JWT_SECRET: process.env.JWT_SECRET || 'cook_app',
    ACCESSTOKEN_TTL: process.env.ACCESSTOKEN_TTL || 10,
    REFRESHTOKEN_TTL: process.env.REFRESHTOKEN_TTL || 20,

    PATH: {
        ROOT: '/api/v1',
        USERS: '/api/v1/users',
        AUTH: '/api/v1/auth',
        TESTING: '/api/v1/testing',
    },
}
