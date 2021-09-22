"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const book_1 = __importDefault(require("../models/book"));
const author_1 = __importDefault(require("../models/author"));
const BookType = new graphql_1.GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        genre: { type: graphql_1.GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                //code to get data from db
                return author_1.default.findById(parent.authorId);
            },
        },
    }),
});
const AuthorType = new graphql_1.GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        age: { type: graphql_1.GraphQLInt },
        books: {
            type: new graphql_1.GraphQLList(BookType),
            resolve(parent, args) {
                //code to get data from db
                return book_1.default.find({ authorId: parent.id });
            },
        },
    }),
});
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        book: {
            type: BookType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve(parent, args) {
                return book_1.default.findById(args.id);
                //code to get data from db
                // return _.find(books, { id: args.id });
            },
        },
        author: {
            type: AuthorType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve(parent, args) {
                //code to get data from db
                return author_1.default.findById(args.id);
            },
        },
        books: {
            type: new graphql_1.GraphQLList(BookType),
            resolve(parent, args) {
                return book_1.default.find({});
            },
        },
        authors: {
            type: new graphql_1.GraphQLList(AuthorType),
            resolve(parent, args) {
                return author_1.default.find({});
            },
        },
    },
});
const Mutation = new graphql_1.GraphQLObjectType({
    name: "Mutation",
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: graphql_1.GraphQLString },
                age: { type: graphql_1.GraphQLInt },
            },
            resolve(parent, args) {
                let author = new author_1.default({
                    name: args.name,
                    age: args.age,
                });
                return author.save();
            },
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: graphql_1.GraphQLString },
                genre: { type: graphql_1.GraphQLString },
                authorId: { type: graphql_1.GraphQLID },
            },
            resolve(parent, args) {
                let book = new book_1.default({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId,
                });
                return book.save();
            },
        },
    },
});
module.exports = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
//# sourceMappingURL=schema.js.map