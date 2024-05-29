const express = require('express');
const router = express.Router();
const Candidate = require('../models/CandidateModel');
const User = require('../models/UserModel');
const { jwtAuthMiddleware} = require('../jwt');
const {checkVotingWindow} = require('../middleware/checkVotingWindow');
const VotingWindow = require('../models/VotingWindow');

const checkAdminRole = async(userId)=>{
    try {
        const user = await User.findById(userId);
        if(user.role === 'admin'){
            return true;
        }
    } catch (err) {
        return false;
    }
}

//post route to a candidate
router.post('/',jwtAuthMiddleware, async (req, res) => {
    try {
        if(! await checkAdminRole(req.user.id)){
            return res.status(403).json({message: 'user has not admin role'});
        }
        const data = req.body;
        const newCandidate = new Candidate(data);
        const response = await newCandidate.save();
        console.log('Data saved');
        
        res.status(200).json({ response: response});

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
})


//candidate update Route
router.put('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message: 'user does not have admin role'});
        }
        const candidateID = req.params.candidateID;
        const updateCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateID, updateCandidateData, {
            new:true,
            runvalidators:true
        })

        if(!response){
            return res.status(404).json({error: 'Candidate not found'});
        }
        console.log('Candidate data updated');
        res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// candidate delete route
router.delete('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message: 'user does not have admin role'});
        }
        const candidateID = req.params.candidateID;
        // const updateCandidateData = req.body;

        const response = await Candidate.findByIdAndDelete(candidateID);

        if(!response){
            return res.status(404).json({error: 'Candidate not found'});
        }
        console.log('Candidate deleted');
        res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
})



// Get current voting window
router.get('/voting-window', jwtAuthMiddleware,checkVotingWindow, async (req, res) => {
    
    try {
        const votingWindow = await VotingWindow.findOne();
        if (!votingWindow) {
            return res.status(404).json({ message: 'Voting window not set' });
        }
        res.status(200).json(votingWindow);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Set voting window
router.post('/voting-window', jwtAuthMiddleware, async (req, res) => {
    const { votingType, startDate, endDate } = req.body;

    if (!await checkAdminRole(req.user.id)) {
        return res.status(403).json({ message: 'User does not have admin role' });
    }

    try {
        let votingWindow = await VotingWindow.findOne();
        if (votingWindow) {
            votingWindow.votingType = votingType;
            votingWindow.startDate = new Date(startDate);
            votingWindow.endDate = new Date(endDate);
        } else {
            votingWindow = new VotingWindow({ votingType, startDate: new Date(startDate), endDate: new Date(endDate) });
        }
        await votingWindow.save();
        res.status(200).json({ message: 'Voting window set successfully', votingWindow });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/voting-window/:votingWindowId', jwtAuthMiddleware, async (req, res) => {
    if (!await checkAdminRole(req.user.id)) {
        return res.status(403).json({ message: 'User does not have admin role' });
    }
    try {
        const votingWindowId = req.params.votingWindowId;
        await VotingWindow.findByIdAndDelete(votingWindowId);
        res.status(200).json({ message: 'Voting window deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//let's start voting 

router.post('/vote/:candidateID', jwtAuthMiddleware,checkVotingWindow, async (req,res)=>{
    //no admin can vote
    // user can vote only
    const candidateID = req.params.candidateID;
    const userId = req.user.id;
    try {
    const candidate = await Candidate.findById(candidateID);
    if(!candidate){
        return res.status(404).json({message: 'Candidate not found'});
    }

    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({message: 'user not found'});
    }
    if(user.isVoted){
        res.status(404).json({message: 'You have already voted'});
    }
    if(user.role === 'admin'){
        res.status(403).json({message: 'admin is not allowed'});
    }

    candidate.votes.push({user: userId})
    candidate.voteCount++;
    await candidate.save();

    user.isVoted = true
    await user.save();

    res.status(200).json({message: 'Vote recoreded successfully'});

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

//vote count

router.get('/vote/count',async (req,res)=>{
    try {
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        const voteRecord = candidate.map((data)=>{
            return{
                party: data.party,
                count: data.voteCount
            }
        });
        res.status(200).json(voteRecord);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//list candidates
router.get('/candidateList', async (req,res)=>{
    try {
        const candidate = await Candidate.find();

        const candidateList = candidate.map((data)=>{
            return{
                id: data._id,
                name: data.name,
                party: data.party
            }
        });
        

        res.status(200).json(candidateList);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
})
module.exports = router;