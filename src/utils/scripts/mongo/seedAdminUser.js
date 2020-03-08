/**
 * RUN: node -r dotenv/config .\src\utils\scripts\mongo\seedAdminUser.js
 */

const Permission = require('../../../db/models/Permission');
const Rol = require('../../../db/models/Rol');
const User = require('../../../db/models/User');
const UserData = require('../../../db/models/UserData');

const initDatabase = require('../../../db');
initDatabase();
(
    async function () {
        try {
            const permissions = await Permission.insertMany([
                {
                    "may": "read:users",
                },
                {
                    "may": "create:users",
                },
                {
                    "may": "update:users",
                },
                {
                    "may": "inactivate:users",
                }
            ])

            const rolAdmin = new Rol();
            rolAdmin.name = "Admin";
            rolAdmin.permissions = permissions;
            await rolAdmin.save();


            const userAdmin = new User();
            userAdmin.email = "santiagoemp01@gmail.com";
            userAdmin.password = "kb#j#!%FZCn$TpBmtR#9gKu4Gj$!Rk"
            userAdmin.rol = rolAdmin;
            await userAdmin.save();

            const userAdminData = new UserData();
            userAdminData.name = "Admin";
            userAdminData.user = userAdminData;
            await userAdminData.save();
            console.log('Seed successful')
            process.exit();
        } catch (error) {
            console.log(error.message);
            process.exit();
        }
    }
)();