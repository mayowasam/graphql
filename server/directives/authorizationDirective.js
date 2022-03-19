const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');
const { defaultFieldResolver } = require('graphql');
const { ForbiddenError } = require('apollo-server-core');


function authorizationDirective(directiveName, getUserFn) {
    const typeDirectiveArgumentMaps= {}
    return {
      authDirectiveTypeDefs: `directive @${directiveName}(
        requires: Role = ADMIN,
      ) on OBJECT | FIELD_DEFINITION
  
      enum Role {
        ADMIN
        REVIEWER
        USER
        UNKNOWN
      }`,
      authorizationDirectiveTransformer: (schema) =>
        mapSchema(schema, {
          [MapperKind.TYPE]: type => {
            const authDirective = getDirective(schema, type, directiveName)?.[0]
            if (authDirective) {
              typeDirectiveArgumentMaps[type.name] = authDirective
            }
            return undefined
          },
          [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
            const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0] ?? typeDirectiveArgumentMaps[typeName]
            if (authDirective) {
              const { requires } = authDirective
              if (requires) {
                const { resolve = defaultFieldResolver } = fieldConfig
                fieldConfig.resolve = function (source, args, context, info) {
                  // const user = getUserFn(context.headers.authToken)
                  let role = context.user && context.user.role || ""
                  const user = getUserFn(role)
                  // console.log('user dir', user);
                  // console.log('requires', requires);
                  if (!user || !user.hasRole(requires)) {
                    throw new ForbiddenError('User not authorized')
                  }
                  return resolve(source, args, context, info)
                }
                return fieldConfig
              }
            }
          },
        })
    }
  }

  function getUser(token) {
    const roles = ['UNKNOWN', 'USER', 'REVIEWER', 'ADMIN']
    // console.log('token', token);

    return {
      hasRole: (role) => {
        const tokenIndex = roles.indexOf(token)
        // console.log('tokenIndex', tokenIndex);
        const roleIndex = roles.indexOf(role)
        // console.log('roleIndex', roleIndex);

        return roleIndex >= 0 && tokenIndex >= roleIndex
      }
    }
  }
const { 
  // authDirectiveTypeDefs, 
  authorizationDirectiveTransformer }= authorizationDirective('permit', getUser)

  
module.exports = {
  // authDirectiveTypeDefs, 
  authorizationDirectiveTransformer
}