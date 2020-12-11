const User = require('../models/user');

exports.addFollowing = async (req, res, next) => {
    try {
        const user = await User.findOne({where: req.user.id});
        if(user) {
            await user.addFollowing(parseInt(req.params.id, 10));
            res.send('success');
        }else {
            res.status(404).send('no use');
        }
    } catch (error) {
        next(error);
    }
}