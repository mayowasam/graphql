const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');
const { AuthenticationError } = require('apollo-server-core');
const { defaultFieldResolver } = require('graphql');



// function deprecatedDirectiveTransformer(schema, directiveName) {
//     return mapSchema(schema, {

//         // Executes once for each object field definition in the schema
//         [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
//             const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
//             if (deprecatedDirective) {
//                 fieldConfig.deprecationReason = deprecatedDirective['reason'];
//                 return fieldConfig;
//             }
//         },

//         // Executes once for each enum value definition in the schema
//         [MapperKind.ENUM_VALUE]: (enumValueConfig) => {
//             const deprecatedDirective = getDirective(schema, enumValueConfig, directiveName)?.[0];
//             if (deprecatedDirective) {
//                 enumValueConfig.deprecationReason = deprecatedDirective['reason'];
//                 return enumValueConfig;
//             }
//         }
//     });
// };



function authDirectiveTransformer(schema, directiveName) {
    // Executes once for each object field in the schema
    return mapSchema(schema, {

        // Executes once for each object field in the schema
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {

            // Check whether this field has the specified directive
            const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0];

            if (authDirective) {

                // Get this field's original resolver
                const { resolve = defaultFieldResolver } = fieldConfig;

                fieldConfig.resolve = async function (source, args, context, info) {
                    //or using the rest operator as argument
                    // fieldConfig.resolve = async function (...args) {


                    // console.log('args', args);
                    // console.log('source', source);
                    // console.log('args', args);
                    // console.log('context', context);

                    // the response shows i am getting everything in my context
                    //i.e context {
                    //isAuth: true,
                    //user: {id: .....}
                    //the response of the field i attached the dierective to
                    //i.e books: [{}, {}]
                    //User: Model {user}
                    //starwars: StarwarsApi{}
                    // }

                    // console.log('info', info);

                    let { isAuth, user } = context

                    if (isAuth && user) {
                        const result = await resolve(source, args, context, info);
                        return result;

                    } else {
                        throw new AuthenticationError("User is not authenticated")
                    }
                }
                // return fieldConfig;
            }
        }
    });
}

// Our GraphQL schema
// const typeDefs = gql`
//   directive @upper on FIELD_DEFINITION

//   type Query {
//     hello: String @upper
//   }
// `;


// This function takes in a schema and adds upper-casing logic
// to every resolver for an object field that has a directive with
// the specified name (we're using `upper`)
// function upperDirectiveTransformer(schema, directiveName) {
//     return mapSchema(schema, {

//         // Executes once for each object field in the schema
//         [MapperKind.OBJECT_FIELD]: (fieldConfig) => {

//             // Check whether this field has the specified directive
//             const upperDirective = getDirective(schema, fieldConfig, directiveName)?.[0];

//             if (upperDirective) {

//                 // Get this field's original resolver
//                 const { resolve = defaultFieldResolver } = fieldConfig;

//                 // Replace the original resolver with a function that *first* calls
//                 // the original resolver, then converts its result to upper case
//                 fieldConfig.resolve = async function (source, args, context, info) {
//                     const result = await resolve(source, args, context, info);
//                     if (typeof result === 'string') {
//                         return result.toUpperCase();
//                     }
//                     return result;
//                 }
//                 return fieldConfig;
//             }
//         }
//     });
// }

// Create the base executable schema
// let schema = makeExecutableSchema({
//   typeDefs,
//   resolvers
// });

// Transform the schema by applying directive logic
// schema = upperDirectiveTransformer(schema, 'upper');

// Provide the schema to the ApolloServer constructor
// const server = new ApolloServer({schema});


module.exports = authDirectiveTransformer