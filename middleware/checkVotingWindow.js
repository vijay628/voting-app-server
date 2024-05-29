const VotingWindow = require('../models/VotingWindow');

const checkVotingWindow = async (req, res, next) => {
    try {
        const votingWindow = await VotingWindow.findOne();
        if (!votingWindow) {
            return res.status(403).json({ message: 'Voting window not set' });
        }

        const now = new Date();
        if (now < votingWindow.startDate || now > votingWindow.endDate) {
            return res.status(403).json({ message: 'Voting is only allowed within the specified time window.' });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {checkVotingWindow};
