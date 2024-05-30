const VotingWindow = require('../models/VotingWindow');

// Function to format date and time in UTC with AM/PM
function formatDateTimeUTC(dateString) {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getUTCDate().toString().padStart(2, '0');
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const hoursStr = hours.toString().padStart(2, '0');

    return `${day}-${month}-${year} ${hoursStr}:${minutes} ${ampm} UTC`;
}

const checkVotingWindow = async (req, res, next) => {
    try {
        const votingWindow = await VotingWindow.findOne();
        if (!votingWindow) {
            return res.status(403).json({ message: 'Voting Not Started or Ended. Thank you!' });
        }

        const now = new Date();
        const nowUTC = new Date(now.getTime() - (now.getTimezoneOffset() * 60000) + (1000*60*60)*5 + 1000*60*30 ); // Convert current date to UTC for server
        const startDate = new Date(votingWindow.startDate);
        const endDate = new Date(votingWindow.endDate);

        const startDateUTC = new Date(startDate.getTime() + (2*startDate.getTimezoneOffset() * 60000));
        const endDateUTC = new Date(endDate.getTime() + (2*endDate.getTimezoneOffset() * 60000));
        console.log("Now:", now, nowUTC);
        console.log("Start Date:", startDateUTC);
        console.log("End Date:", endDateUTC);

        if (nowUTC >= startDateUTC && nowUTC <= endDateUTC) {
            return next(); // Current date is within the voting window
        } else {
            return res.status(403).json({
                message: `Voting is scheduled between ${formatDateTimeUTC(votingWindow.startDate)} and ${formatDateTimeUTC(votingWindow.endDate)}.`
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { checkVotingWindow };
