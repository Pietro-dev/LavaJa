import NextAuth from "next-auth"
import Auth0 from "next-auth/providers/auth0"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
  providers: [
        GithubProvider({
        clientId: "Iv23li5LANo640pDe7RP",
        clientSecret: "ee2d6259d4e200934702c7e72831a35a16795169",
        }),
        Auth0({
        clientId: "RlOBtRk1SzEM0PwQTK8XPjqEurbCKiNG",
        clientSecret: "go_oh8qJgnTD1t9tAgNQmelItOzFvhn1okAQhSw1cqJLB4eBAkwGFKKikoQLFE8A",
        issuer: 'https://dev-k0yklupkow5pqq6q.us.auth0.com'
        }),
    ]
}

export default NextAuth(authOptions)