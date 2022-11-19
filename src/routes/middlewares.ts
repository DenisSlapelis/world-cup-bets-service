import { userService } from '@app/users/user.service';
import Express from 'express';

export const getUserMiddleware = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    const auth = req?.headers['user-id'] || '';
    const googleUserId = Array.isArray(auth) ? auth[0] : auth;

    const userId = await userService.findOneByGoogleId(googleUserId);

    if (!userId) {
        return res.status(401).json({error: 'Unauthorized', message: 'Unauthorized User'});
    }

    req.query.userId = userId.id.toString();

    return next();
}
