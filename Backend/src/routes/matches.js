import { Router } from 'express';

export function createMatchesRouter(dal) {
  const router = Router();

  /**
   * GET /matches
   * Returns mutual matches for the user.
   */
  router.get('/', async (req, res, next) => {
    try {
      const userId = req.headers['x-user-id'] || dal.currentUserId;
      const matches = await dal.getMatches(userId);

      res.status(200).json({
        success: true,
        count: matches.length,
        matches
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
