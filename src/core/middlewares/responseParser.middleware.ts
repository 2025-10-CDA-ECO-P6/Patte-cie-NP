import { Request, Response, NextFunction } from 'express';

export const responseParser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const originalJson = res.json.bind(res);

  res.json = (body: any) => {
    const isAuthRoute = req.originalUrl.startsWith('/api/auth');
    if (isAuthRoute) return originalJson(body);

    if (!body) return originalJson({ success: true, data: null });

    if (body.error || body.success === false) return originalJson(body);

    if (body.success === true && (body.data || body.meta))
      return originalJson(body);

    if (body.data && body.meta) {
      return originalJson({
        success: true,
        data: body.data,
        meta: body.meta,
      });
    }

    if (body.data) {
      return originalJson({
        success: true,
        data: body.data,
      });
    }

    return originalJson({
      success: true,
      data: body,
    });
  };

  next();
};
