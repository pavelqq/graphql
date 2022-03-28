const { GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull } = require("graphql");

let movies = [
    { id: '1', name: 'Pulp Fiction', genre: 'Crime', directorId: '1', },
    { id: '2', name: '1984', genre: 'Sci-Fi', directorId: '2', },
    { id: '3', name: 'V for vendetta', genre: 'Sci-Fi-Triller', directorId: '3', },
    { id: '4', name: 'Snatch', genre: 'Crime-Comedy', directorId: '4', },
    { id: '5', name: 'Reservoir Dogs', genre: 'Crime', directorId: '1' },
    { id: '6', name: 'The Hateful Eight', genre: 'Crime', directorId: '1' },
    { id: '7', name: 'Inglourious Basterds', genre: 'Crime', directorId: '1' },
    { id: '7', name: 'Lock, Stock and Two Smoking Barrels', genre: 'Crime-Comedy', directorId: '4' },
];
let directors = [
    { id: '1', name: 'Quentin Tarantino', age: 55 },
    { id: '2', name: 'Michael Radford', age: 72 },
    { id: '3', name: 'James McTeigue', age: 51 },
    { id: '4', name: 'Guy Ritchie', age: 50 },
];

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        director: {
            type: DirectorType,
            resolve(parent, args) {
                return directors.find(director => director.id == parent.directorId)
            },
        },
    }),
});

const MovieInputType = new GraphQLObjectType({
    name: 'MovieInput',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        directorId: { type: GraphQLID },
    }),
});

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                return movies.filter(movie => movie.directorId == parent.id);
            },
        },
    }),
});

const DirectorInputType = new GraphQLObjectType({
    name: 'DirectorInput',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
    }),
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            description: 'Получить фильм по id',
            type: MovieType,
            args: {
                id: { type: GraphQLID },
            },
            resolve(parent, args) {
                return movies.find(movie => movie.id == args.id)
            },
        },
        director: {
            type: DirectorType,
            description: 'Получить режиссёра по id',
            args: {
                id: { type: GraphQLID },
            },
            resolve(parent, args) {
                return directors.find(director => director.id == args.id)
            },
        },
        movies: {
            description: 'Получить список фильмов',
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                return movies
            },
        },
        directors: {
            description: 'Получить список режиссеров',
            type: new GraphQLList(DirectorType),
            resolve(parent, args) {
                return directors
            },
        },
    },
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addMovie: {
            type: MovieInputType,
            description: 'Добавить фильм',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                directorId: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve: (parent, args) => {
                const movie = ({
                    id: movies.length + 1,
                    name: args.name,
                    genre: args.genre,
                    directorId: args.directorId,
                })
                movies.push(movie)
                return movie;
            }
        },
        removeMovie: {
            type: MovieType,
            description: 'Удалить фильм',
            args: {
                id: { type: GraphQLID }
            },
            resolve: (parent, args) => {
                movies = movies.filter(movie => movie.id !== args.id)
                return movies[args.id];
            }
        },
        addDirector: {
            type: DirectorInputType,
            description: 'Добавить режиссера',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const director = new Directors({
                    id: directors.length + 1,
                    name: args.name,
                    age: args.age,
                })
                directors.push(director)
                return director;
            }
        },
        removeDirector: {
            type: DirectorType,
            description: 'Удалить режиссера',
            args: {
                id: { type: GraphQLID }
            },
            resolve: (parent, args) => {
                directors = directors.filter(director => director.id !== args.id)
                return directors[args.id];
            }
        },
        updateDirector: {
            type: DirectorType,
            description: 'Обновить информацию о режиссере',
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                directors[args.id - 1].name = args.name;
                directors[args.id - 1].age = args.age;
                return directors[args.id - 1];
            }
        },
        updateMovie: {
            type: MovieType,
            description: 'Обновить информацию о фильме',
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                directorId: { type: GraphQLID },
            },
            resolve: (parent, args) => {
                movies[args.id - 1].name = args.name;
                movies[args.id - 1].genre = args.genre;
                movies[args.id - 1].directorId = args.directorId;
                return movies[args.id - 1];
            }
        },
    })
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
})