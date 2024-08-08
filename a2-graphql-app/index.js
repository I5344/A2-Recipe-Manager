const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require('@apollo/server/standalone');
const { default: axios } = require("axios");

const baseURL = 'http://localhost:8000';

let typeDefs = `
    type User {
        userId: ID!
        name: String!
        email: String!
        password: String!
        token: String!
    }

    type Recipe {
        itemId: ID!
        userId: ID!
        title: String!
        category: String!
        ingredients: [String!]!
        instructions: [String!]!
        date: String!
    }

    type Query {
        allRecipes: [Recipe]
        recipe(itemId: ID): Recipe
    }

    type Mutation {
        login(username: String!, password: String!): String
        register(username: String!, password: String!, email: String!): String

        addRecipe(title: String!, category: String!, ingredients: [String!]!, instructions: [String!]!, date: String!): String
        updateRecipe(itemId: ID! ,title: String!, category: String!, ingredients: [String!]!, instructions: [String!]!, date: String!): String
        deleteRecipe(itemId: ID!): String
    }   
`

let resolvers = {
    Query: {
        async allRecipes(_, __, contextValue) {
            let result = await axios.get(baseURL + '/items', { headers: { Authorization: `Bearer ${contextValue.token}` } })
            return result.data
        },

        async recipe(src, { itemId }, contextValue) {
            let result = await axios.get(baseURL + '/items/' + itemId, { headers: { Authorization: `Bearer ${contextValue.token}` } })
            return result.data
        }
    },
    Mutation: {
        async login(src, { ...userData }, contextValue) {
            let result = await axios.post(baseURL + '/login', userData)
            return result.data.token
        },

        async register(src, { ...userData }, contextValue) {
            let result = await axios.post(baseURL + '/users', userData)
            return result.data.userId
        },

        async addRecipe(src, { ...itemData }, contextValue) {
            let result = await axios.post(baseURL + '/items', itemData, { headers: { Authorization: `Bearer ${contextValue.token}` } })
            return result.data
        },

        async updateRecipe(src, { itemId, ...itemData }, contextValue) {
            let result = await axios.put(baseURL + '/items/' + itemId, itemData, { headers: { Authorization: `Bearer ${contextValue.token}` } })
            return result.data
        },

        async deleteRecipe(src, { itemId }, contextValue) {
            await axios.delete(baseURL + '/items/' + itemId, { headers: { Authorization: `Bearer ${contextValue.token}` } })
        }
    }
}

let server = new ApolloServer({
    typeDefs,
    resolvers
});

startStandaloneServer(server, {
    listen: 9000,
    context: async ({ req }) => {
        const token = req.headers.authorization.split(' ')[1]
        return { token: token }
    }
}).then(response => console.log("GraphQL server started at 9000"));