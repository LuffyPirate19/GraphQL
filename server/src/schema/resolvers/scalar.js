import { GraphQLScalarType, Kind } from 'graphql';
import mongoose from 'mongoose';

export const scalarResolvers = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'DateTime scalar type',
    serialize: (value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    },
    parseValue: (value) => {
      return new Date(value);
    },
    parseLiteral: (ast) => {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
      }
      return null;
    },
  }),
  Decimal: new GraphQLScalarType({
    name: 'Decimal',
    description: 'Decimal scalar type',
    serialize: (value) => {
      if (value instanceof mongoose.Types.Decimal128) {
        return value.toString();
      }
      if (typeof value === 'string' || typeof value === 'number') {
        return value.toString();
      }
      return value;
    },
    parseValue: (value) => {
      if (typeof value === 'string' || typeof value === 'number') {
        return new mongoose.Types.Decimal128(value.toString());
      }
      return value;
    },
    parseLiteral: (ast) => {
      if (ast.kind === Kind.STRING || ast.kind === Kind.INT || ast.kind === Kind.FLOAT) {
        return new mongoose.Types.Decimal128(ast.value);
      }
      return null;
    },
  }),
  JSON: new GraphQLScalarType({
    name: 'JSON',
    description: 'JSON scalar type',
    serialize: (value) => value,
    parseValue: (value) => value,
    parseLiteral: (ast) => {
      if (ast.kind === Kind.OBJECT) {
        const value = {};
        ast.fields.forEach((field) => {
          value[field.name.value] = field.value.value;
        });
        return value;
      }
      return null;
    },
  }),
};

