import { registerUserService, loginUserService } from '../services/index.js';
import { messages } from '../messages/index.js';
import { response } from '../utils/index.js';

export const registerUserController = async (req, res) => {
  try {
    // register user using service function
    const authPayload = await registerUserService(req.body);

    // send success response
    return response(res, {
      statusCode: 201,
      message: messages.auth.SIGNUP_SUCCESS,
      data: authPayload,
    });
  } catch (error) {
    console.error(
      'Error in registerUserController:',
      error.message,
      error.stack,
    );

    return response(res, {
      statusCode: error.status || 500,
      message: error.message || messages.general.INTERNAL_SERVER_ERROR,
      errorCode: error.code,
    });
  }
};

export const loginUserController = async (req, res) => {
  const { payload } = req.body;

  try {
    // authenticate user during login
    const authPayload = await loginUserService(payload);

    // send success response
    return response(res, {
      statusCode: 200,
      message: messages.auth.SIGNIN_SUCCESS,
      data: authPayload,
    });
  } catch (error) {
    console.error('Error in loginUserController:', error.message, error.stack);

    return response(res, {
      statusCode: error.status || 500,
      message: error.message || messages.general.INTERNAL_SERVER_ERROR,
      errorCode: error.code,
    });
  }
};
