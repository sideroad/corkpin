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
    images: '/bff/apis/board/images',
    boards: '/bff/apis/board/boards',
    board: '/bff/apis/board/boards/:id'
  }
};
