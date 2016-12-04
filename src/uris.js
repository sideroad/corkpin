export default {
  pages: {
    root: '/:lang',
    login: '/auth/facebook',
    finding: '/:lang/find',
    creating: '/:lang/create',
    board: '/:lang/boards/:id',
    privacy: '/:lang/privacy'
  },
  apis: {
    images: '/api/images',
    boards: '/api/boards'
  }
};
