export const midFunc = (req, res, next) => {
    // console.log("middleware called", req.query)
    let params = req.query

    if(Object.keys(params).length==0){
        return res.status(400).send({error:"invalid request"})
    }
    
    if(!params.exchange || !params.duration || !params.startTime || !params.endTime){
        return res.status(400).send({error:"Please provide all the inputs correctly"})
    }
    req['query'].collectionName = `${params.duration}m_data_${params.exchange}`
    req['query'].duration = parseInt(req['query'].duration)
        
     next()
    
}