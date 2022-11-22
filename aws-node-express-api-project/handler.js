module.exports.hello = async (event, context) => {

  return{
    statusCode:200,
    body: JSON.stringify({
      'input':context,
      'message':'running successfully'
    })
  }

  // console.log("lambda is running", event)
}