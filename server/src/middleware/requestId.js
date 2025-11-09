// Simple UUID generator (can be replaced with uuid package)
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Generate request ID middleware
 */
export const requestId = (req, res, next) => {
  req.id = req.headers['x-request-id'] || generateUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
};

