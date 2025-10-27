import { TokenPayload } from './tokens';

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
            token?: string;
        }
    }
}

export { };
