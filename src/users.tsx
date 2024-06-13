export type User = {
  name: string
  img: string
  color: string
}

export const allUsers: User[] = [
  // { name: 'Marit', img: '', color: '' },
  // { name: 'Cato', img: '', color: '' },
]

export const userImage = (userName: string): string | undefined => allUsers.find((user) => user.name === userName)?.img
