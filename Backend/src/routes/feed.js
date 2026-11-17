import { Router } from 'express';

export function createFeedRouter(dal) {
  const router = Router();

  /**
   * GET /feed
   * Returns profiles not yet swiped on by the assumed logged-in user.
   */
  router.get('/', async (req, res, next) => {
    try {
      const userId = req.headers['x-user-id'] || dal.currentUserId;
      const profiles = await dal.getFeed(userId);

      res.status(200).json({
        success: true,
        count: profiles.length,
        profiles
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
