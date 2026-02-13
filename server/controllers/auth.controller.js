import { registerUserService, loginUserService } from '../services/index.js';
import { messages } from '../messages/index.js';
import { response } from '../utils/index.js';

export const registerUserController = async (req, res) => {
  const { payload } = req.body;

  try {
    // register user using service function
    const userId = await registerUserService(payload);

    // send success response
    return response(res, {
      statusCode: 201,
      message: messages.auth.SIGNUP_SUCCESS,
      data: { userId },
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
    });
  }
};

export const loginUserController = async (req, res) => {
  const { payload } = req.body;

  try {
    // authenticate user during login
    const user = await loginUserService(payload);

    // send success response
    return response(res, {
      statusCode: 200,
      message: messages.auth.SIGNIN_SUCCESS,
      data: user.responsePayload,
    });
  } catch (error) {
    console.error('Error in loginUserController:', error.message, error.stack);

    return response(res, {
      statusCode: error.status || 500,
      message: error.message || messages.general.INTERNAL_SERVER_ERROR,
    });
  }
};
