const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'test03@gmail.com' },
        });

        if (!user) {
            console.log('User not found, creating...');
            await prisma.user.create({
                data: {
                    name: 'arm01',
                    email: 'test03@gmail.com',
                    username: 'test03',
                    password: 'password', // Simple password
                    image: '',
                },
            });
            console.log('User created: test03@gmail.com');
        } else {
            console.log('User already exists');
            // Update fields if missing (migration backfill)
            if (!user.username || user.username === 'unknown') {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { username: 'test03' }
                });
                console.log('Updated username');
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
