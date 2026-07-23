/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

//// ## UNIT TESTS

let testrslt;

// 1
testrslt = onClickTestInjection(JSON.stringify({
  "method": "POST",
  "url": "Batch",
  "body": {
    "batch_requests": [
      {
        "url": "Batch",
        "method": "POST",
        "body": {
          "batch_requests": [
            {
              "url": "Invalid",
              "method": "POST"
            },
            {
              "url": "Users",
              "method": "GET",
              "param": {
                "author_exclude": "0) OR (1=1);"
              }
            },
            {
              "url": "Posts",
              "method": "GET"
            }
          ]
        }
      }
    ]
  }
}),true)
if(testrslt) console.error("## UNIT TEST 1 fails");
else console.log("## UNIT TEST 1 success");


// 2
testrslt = onClickTestInjection(JSON.stringify(
    {
        method:"GET",
        url:"Posts", 
        param: 
        {
            author_exclude:"0) OR (1=1);"
        }
    }
),true)
if(testrslt) console.error("## UNIT TEST 2 fails");
else console.log("## UNIT TEST 2 success");

// 3
testrslt = onClickTestInjection(JSON.stringify(
    {
        method:"POST",
        url:"Batch", 
        body: {
            batch_requests:[
                {method:"POST",url:"any", param:{author_exclude:"0) OR (1=1);"}},
                {method:"GET",url:"Posts",param:{}}
            ]
        }
    }
),true)
if(testrslt) console.error("## UNIT TEST 3 fails");
else console.log("## UNIT TEST 3 success");


// 4
testrslt = onClickTestInjection(JSON.stringify({
  "method": "POST",
  "url": "Batch",
  "body": {
    "batch_requests": [
      {
        "method": "POST",
        "url": "Batch",
        "body": {
          "batch_requests": [
            {
              "method": "GET",
              "url": "Posts",
              "param": {
                "author_exclude": "0) OR (1=1);"
              }
            }
          ]
        }
      }
    ]
  }
}),true)
if(testrslt) console.error("## UNIT TEST 4 fails");
else console.log("## UNIT TEST 4 success");

// 5
testrslt = onClickTestInjection('{"method":"GET","url":"Posts","param":{"author__not_in":"0) OR (1=1);"}}',true);
if(testrslt) console.error("## UNIT TEST 5 fails");
else console.log("## UNIT TEST 5 success");

// 6
testrslt = onClickTestInjection(JSON.stringify({
  "method": "POST",
  "url": "Batch",
  "body": {
    "batch_requests": [
      {
        "method": "POST",
        "url": "Batch",
        "body": {
          "batch_requests": [
            {
              "method": "GET",
              "url": "INVALID",
              "param": {
                "author_exclude": "0) OR (1=1);"
              }
            },
            {
              "method": "POST",
              "url": "Posts"
            }
          ]
        }
      }
    ]
  }
}),true)
if(testrslt) console.error("## UNIT TEST 6 fails");
else console.log("## UNIT TEST 6 success");

// 7
testrslt = onClickTestInjection(JSON.stringify({
  "method": "POST",
  "url": "Batch",
  "body": {
    "batch_requests": [
      {
        "url": "Invalid",
        "method": "POST"
      },
      {
        "url": "Users",
        "method": "POST",
        "param": {
          "author_exclude": "0) OR (1=1);"
        }
      },
      {
        "url": "Posts",
        "method": "POST"
      }
    ]
  }
}),true)
if(testrslt) console.error("## UNIT TEST 7 fails");
else console.log("## UNIT TEST 7 success");

// 8
let innerBatchRequests = [
    {method:"POST",url:"any",param:{}},
    {method:"GET",url:"Users",param:{author_exclude:"0) OR (1=1);"}},
    {method:"GET",url:"Posts", body:{}},

]
testrslt = onClickTestInjection(JSON.stringify(
    {
        method:"POST",
        url:"Batch", 
        baseUrl:"Batch",
        body: {
            batch_requests:[
                {method:"POST",url:"any", param:{}},
                {method:"POST",url:"Posts", body:{batch_requests: innerBatchRequests}},
                {method:"POST",url:"Batch", body:{batch_requests: []}},    
            
            ]
        }
    }
),true)
if(!testrslt) console.error("## UNIT TEST 8 fails");
else console.log("## UNIT TEST 8 success");

// 9
testrslt = onClickTestInjection(JSON.stringify({
  "url": "Batch",
  "method": "POST",
  "body": {
    "batch_requests": [
      {
        "url": "InvalidUrl",
        "method": "POST"
      },
      {
        "url": "Users",
        "method": "POST",
        "body": {
          "batch_requests": [
            {
              "url": "InvalidUrl",
              "method": "POST"
            },
            {
              "url": "Users",
              "method": "GET",
              "param": {
                "author_exclude": "0) OR (1=1);"
              }
            },
            {
              "url": "Posts",
              "method": "POST"
            }
          ]
        }
      },
      {
        "url": "Batch",
        "method": "POST"
      }
    ]
  }
}),true)
if(!testrslt) console.error("## UNIT TEST 9 fails");
else console.log("## UNIT TEST 9 success");
