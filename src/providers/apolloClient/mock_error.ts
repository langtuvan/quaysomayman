const formError = {
  errors: [
    {
      extensions: {
        code: 'BAD_REQUEST',
        originalError: {
          message: [
            {
              field: 'title',
              message: 'title must be longer than or equal to 4 characters',
            },
          ],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
      path: ['updateFortune'],
    },
  ],
  data: null,
}

const bad = {
  errors: [
    {
      extensions: {
        code: 'BAD_REQUEST',
        originalError: {
          message:
            'Bạn đã tạo đủ 3 chương trình cho phép! Vui lòng nâng cấp tài khoản để tạo thêm!',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
      path: ['createFortune'],
    },
  ],
  data: null,
}

const badRequestError = {
  errors: [
    {
      extensions: {
        code: 'BAD_REQUEST',
        originalError: {
          message: 'INVALID ID',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
      path: ['fortune'],
    },
  ],
  data: null,
}

const notFoundError = {
  errors: [
    {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        originalError: {
          message: 'Không tìm thấy chương trình',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      path: ['fortune'],
    },
  ],
  data: null,
}
