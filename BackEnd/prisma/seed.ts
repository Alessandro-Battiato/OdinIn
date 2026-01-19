import prisma from '../prisma.js'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

async function main() {
  await prisma.postLike.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.connection.deleteMany()
  await prisma.user.deleteMany()

  const users: any[] = []

  for (let i = 0; i < 20; i++) {
    const passwordHash = await bcrypt.hash('password123', 10)

    const user = await prisma.user.create({
      data: {
        email: faker.internet.email().toLowerCase(),
        password: passwordHash,
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        imageUrl: faker.image.avatar(),
        bio: faker.lorem.sentence(),
      },
    })

    users.push(user)
  }

  const posts: any[] = []

  for (const user of users) {
    const postsCount = faker.number.int({ min: 1, max: 5 })

    for (let i = 0; i < postsCount; i++) {
      const post = await prisma.post.create({
        data: {
          authorId: user.id,
          text: faker.lorem.paragraphs(2),
          imageUrl: faker.datatype.boolean()
            ? faker.image.url()
            : null,
        },
      })

      posts.push(post)
    }
  }

  for (const post of posts) {
    const commentsCount = faker.number.int({ min: 0, max: 5 })

    for (let i = 0; i < commentsCount; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)]

      await prisma.comment.create({
        data: {
          postId: post.id,
          userId: randomUser.id,
          text: faker.lorem.sentence(),
        },
      })
    }
  }

  for (const post of posts) {
    const likesCount = faker.number.int({ min: 0, max: users.length })

    const shuffledUsers = [...users].sort(() => 0.5 - Math.random())
    const selectedUsers = shuffledUsers.slice(0, likesCount)

    for (const user of selectedUsers) {
      try {
        await prisma.postLike.create({
          data: {
            postId: post.id,
            userId: user.id,
          },
        })
      } catch (e) {
        // skip duplicate like (unique constraint)
      }
    }
  }

  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      if (faker.datatype.boolean()) {
        await prisma.connection.create({
          data: {
            userAId: users[i].id,
            userBId: users[j].id,
            status: faker.helpers.arrayElement(['PENDING', 'ACCEPTED']),
          },
        })
      }
    }
  }
}

main()
  .catch((e) => {
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
