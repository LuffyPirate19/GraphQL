/**
 * Get field names from GraphQL selection set
 */
const getFieldNames = (selectionSet, prefix = '') => {
  if (!selectionSet) return [];
  
  const fields = [];
  selectionSet.selections.forEach((selection) => {
    if (selection.kind === 'Field') {
      const fieldName = selection.name.value;
      if (fieldName === '__typename') return;
      
      const fullPath = prefix ? `${prefix}.${fieldName}` : fieldName;
      
      if (selection.selectionSet) {
        // Nested field - recursively get sub-fields
        fields.push(...getFieldNames(selection.selectionSet, fullPath));
      } else {
        // Leaf field
        fields.push(fullPath);
      }
    }
  });
  
  return fields;
};

/**
 * Get MongoDB projection from GraphQL selection set
 */
export const getProjection = (info, path = '') => {
  if (!info || !info.fieldNodes || info.fieldNodes.length === 0) {
    return {};
  }

  const selectionSet = info.fieldNodes[0].selectionSet;
  if (!selectionSet) return {};

  const projection = {};

  // Map GraphQL field names to MongoDB field names
  const mapField = (fieldName) => {
    if (fieldName === 'id') return '_id';
    return fieldName;
  };

  const extractFields = (selectionSet, prefix = '') => {
    selectionSet.selections.forEach((selection) => {
      if (selection.kind === 'Field') {
        const fieldName = selection.name.value;
        
        // Skip __typename
        if (fieldName === '__typename') return;

        // Handle nested fields (relations) - we don't project nested fields in MongoDB
        // They will be resolved separately
        if (!selection.selectionSet) {
          // Leaf field - add to projection
          const dbFieldName = mapField(fieldName);
          projection[dbFieldName] = 1;
        }
      } else if (selection.kind === 'InlineFragment') {
        if (selection.selectionSet) {
          extractFields(selection.selectionSet, prefix);
        }
      }
    });
  };

  extractFields(selectionSet, path);

  // Always include _id for MongoDB
  projection._id = 1;

  return projection;
};

/**
 * Simple projection helper
 * Always includes required fields to prevent filtering issues
 */
export const getSimpleProjection = (info) => {
  // For products, always include all fields to ensure filtering works correctly
  // Projection optimization can be added later if needed
  return {};
};

/**
 * Check if a specific field is requested
 */
export const isFieldRequested = (info, fieldName) => {
  if (!info || !info.fieldNodes || info.fieldNodes.length === 0) {
    return true; // If we can't determine, assume it's requested
  }

  try {
    const fields = getFieldNames(info.fieldNodes[0].selectionSet);
    return fields.some((field) => field === fieldName || field.startsWith(`${fieldName}.`));
  } catch (error) {
    return true; // If we can't determine, assume it's requested
  }
};

