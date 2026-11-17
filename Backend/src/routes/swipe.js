import { Router } from 'express';

export function createSwipeRouter(dal) {
  const router = Router();

  /**
   * POST /swipe
   * Records a LIKE or PASS swipe and checks if a mutual match exists.
   */
  router.post('/', async (req, res, next) => {
    try {
      const swiperId = req.headers['x-user-id'] || dal.currentUserId;
      const { targetProfileId, action } = req.body || {};

      const result = await dal.recordSwipe({
        swiperId,
        targetProfileId,
        action
      });

      const statusCode = 201;

      if (result.matched) {
        return res.status(statusCode).json({
          success: true,
          matched: true,
          isMatch: true,
          message: "It's a mutual match!",
          match: result.match,
          matchedProfile: result.matchedProfile,
          swipe: result.swipe
        });
      }

      return res.status(statusCode).json({
        success: true,
        matched: false,
        isMatch: false,
        message: 'Swipe recorded successfully',
        swipe: result.swipe
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
