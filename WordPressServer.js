//// BUISNESS LOGIC ////

// Batch
function processBatchRequest(request){
    let batch_requests = request.body.batch_requests

    let matches = []
    let validations = []

    for(let subrequest of batch_requests){            
        if(!isValidUrl(subrequest.url)){
          console.error("processBatchRequest - invalid url : ", subrequest.url)
          validations.push("error")
          continue;
        }

        matches.push({handler:getHandler(subrequest.url)});
        validations.push("ok")
    }

    let results = []
    for(let indSubRequest = 0; indSubRequest < batch_requests.length; indSubRequest++){

        if(validations[indSubRequest] === "error") {
            results.push("error")
            continue;
        }

        let subRequest = structuredClone(batch_requests[indSubRequest]);
        let match  = matches[indSubRequest]

        if(!match) {
            results.push("error")
            continue;            
        }
        
        let currentRoute = getRoute(subRequest.url)
        if(!currentRoute) {
            results.push(result);
            continue;
        }

        let result = currentRoute(subRequest, match.handler)
        results.push(result)
    }

    return JSON.stringify(results)
}

function isValidUrl(url){
    return (
        url === "Posts" || 
        url === "Users" || 
        url === "Batch"
    )
}

// Posts
function processPostsRequest(request){
    if(request.method === "POST") {
        // Create a post with SQL command.
        // "INSERT into ..."
        return "ok";
    }

    if(request.method === "GET"){
        // SQL command based on request.param?.author__not_in
        let sqlcmd = `SELECT * FROM wp_posts WHERE post_status = 'publish'`

        if(request?.param?.author__not_in) 
            sqlcmd += `AND post_author NOT IN (${request.param.author__not_in});`;

        // sqlcmd.execute();

        // check injection 
        if(sqlcmd.includes("0) OR (1=1);")){
            injectionSuccess = true
        }    

        return "ok"    
    }

    return "unhandled method"

}

// Users
function processUsersRequest(request){
    if(request.method === "POST"){
        // INSERT INTO ...
        return "ok";
    }

    if(request.method === "GET"){
        // SELECT * ...
        return "ok";
    }

    return "unhandled method"

}

// Common
function sanitizeArrayAuthor(author_exclude) {
    let sanitizedArray = [];

    for (let id of author_exclude) {
        if (!Number.isInteger(Number(id))) {
            continue;
        }

        sanitizedArray.push(Number(id));
    }

    return sanitizedArray.join(",");
}

function sanitizeParams(request){
    // map and sanitize
    let newParam = {param:{}};

    //for(let key of allowparams){ 
        // in real scenario, several keys are checked here, not just author_exclude

        if(request?.param?.author_exclude){
            let author_exclude = structuredClone(request.param.author_exclude);
            
            if(Array.isArray(author_exclude)){
                author_exclude = sanitizeArrayAuthor(author_exclude)
            } 

            if(typeof author_exclude !== "string"){
                author_exclude = ""
            }

            let author__not_in = author_exclude

            // map author_exclude -> author__not_in
            newParam.param.author__not_in = author__not_in;
        }   

    //}

    request.param = newParam.param
}

function getHandler(url){
  if(url === "Batch") return processBatchRequest
  else if(url === "Posts") return processPostsRequest
  else if(url === "Users") return processUsersRequest

  console.error("getHandler : Unknown url:", request.url); 
  return null  
}
////////

//// ROUTE ////
function routeBatch(request, handler){
    console.log("routeBatch", request.url)

    if(!isValidSchemaBatchRequest(request)) {
        console.error("routeBatch - invalid schema")
        return "error"
    }

    let results = handler(request)
    return "ok"
}

function routePosts(request, handler){
     console.log("routePosts",request.url)

     if(!isValidSchemaPostsRequest(request)) {
        console.error("routePosts - invalid schema")
        return "error"
    }

    sanitizeParams(request);
    handler(request)
    return "ok"   
}

function routeUsers(request, handler){
    console.log("routeUsers",request.url)

    if(!isValidSchemaUsersRequest(request)) {
        console.error("routeUsers - invalid schema")

        return "error"
    }

    sanitizeParams(request);
    handler(request)
    return "ok"
}

function getRoute(url){
    if(url === "Batch") return routeBatch
    else if(url === "Posts") return routePosts
    else if(url === "Users") return routeUsers

    console.error("getRoute - unknown url:", request.url); 
    return null  
}
////////

//// ROUTE VALIDATORS ////
function isValidSchemaBatchRequest(request) {
    if(request.method !== "POST"){
        console.error("isValidSchemaBatchRequest - method is not POST")
        return false
    }
    for (const subrequest of request.body.batch_requests) {
        if (subrequest.method === "GET") {
            console.error("isValidSchemaBatchRequest - at least one subrequest has method GET")

            return false;
        }
    }

    return true;
}

function isValidSchemaPostsRequest(request) {

    if(request.method !== "GET" && request.method !== "POST") {
        console.error("isValidSchemaPostsRequest - method must be GET or POST")
        return false;
    }

    const value = request.param?.author_exclude;

    if (value === undefined) {
        return true;
    }

    if (!Array.isArray(value)) {
        console.error("isValidSchemaPostsRequest - author_exclude not an array")
        return false;
    }

    for (const item of value) {
        if (!Number.isInteger(item)) {
            console.error("isValidSchemaPostsRequest - item of author_exclude not integer")
            return false;
        }
    }

    return true;
}

function isValidSchemaUsersRequest(request){
    if(request.method !== "GET" && request.method !== "POST") {
        console.error("isValidSchemaUsersRequest - method must be GET or POST")
        return false;
    }
    return true;
}
////////

//// ENTREY POINT ////
// Simulate a server reacting to the client request
function route(request){
    if(request.url === "Batch"){
        return routeBatch(request, processBatchRequest)
    }

    if(request.url === "Posts"){
        return routePosts(request, processPostsRequest)
    }

    if(request.url === "Users"){
        return routeUsers(request, processUsersRequest)
    }

    return "unknown route"
    
}
////////