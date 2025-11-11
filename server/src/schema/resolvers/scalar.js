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
      // If already a Decimal128, return as-is
      if (value instanceof mongoose.Types.Decimal128) {
        return value;
      }
      
      // Handle null or undefined
      if (value === null || value === undefined) {
        throw new Error('Decimal value cannot be null or undefined');
      }
      
      // Handle string or number (most common case)
      if (typeof value === 'string' || typeof value === 'number') {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(numValue) || !isFinite(numValue)) {
          throw new Error(`Invalid decimal value: ${value}`);
        }
        if (numValue < 0) {
          throw new Error('Decimal value must be non-negative');
        }
        return new mongoose.Types.Decimal128(value.toString());
      }
      
      // If it's an object, try to extract a numeric value
      if (value && typeof value === 'object') {
        // Try toString first
        if (typeof value.toString === 'function') {
          try {
            const strValue = value.toString();
            const numValue = parseFloat(strValue);
            if (!isNaN(numValue) && isFinite(numValue)) {
              return new mongoose.Types.Decimal128(strValue);
            }
          } catch (e) {
            // Fall through to other attempts
          }
        }
        
        // Try common object properties that might contain the value
        if ('value' in value && (typeof value.value === 'string' || typeof value.value === 'number')) {
          const numValue = typeof value.value === 'string' ? parseFloat(value.value) : value.value;
          if (!isNaN(numValue) && isFinite(numValue)) {
            return new mongoose.Types.Decimal128(value.value.toString());
          }
        }
        
        // If it's an array with one element, try that
        if (Array.isArray(value) && value.length === 1) {
          const numValue = typeof value[0] === 'string' ? parseFloat(value[0]) : value[0];
          if (typeof numValue === 'number' && !isNaN(numValue) && isFinite(numValue)) {
            return new mongoose.Types.Decimal128(value[0].toString());
          }
        }
        
        throw new Error(`Cannot convert object to Decimal. Received object: ${JSON.stringify(value)}`);
      }
      
      // Boolean values
      if (typeof value === 'boolean') {
        throw new Error(`Cannot convert boolean to Decimal. Received: ${value}`);
      }
      
      throw new Error(`Expected string or number for Decimal, received ${typeof value}: ${String(value)}`);
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

