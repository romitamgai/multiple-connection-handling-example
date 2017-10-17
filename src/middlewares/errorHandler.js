import HttpStatus from 'http-status-codes';

export function notFoundError(req, res, next) {
  res.status(HttpStatus.NOT_FOUND).json({
    error: {
      code: HttpStatus.NOT_FOUND,
      message: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
    }
  });
}

export function genericErrorHandler(err, req, res, next) {
  let error;

  if(err.name === 'bad') {
    error = {
      code: HttpStatus.BAD_REQUEST,
      message: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST)
    }
  } else {
    error = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    };
  }

  res.status(error.code).json({error: error});
}
