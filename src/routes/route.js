const express = require('express');
const logger = require('./logger')

const router = express.Router();

router.get('/test-me', function (req, res) {
    console.log('------------------')
    console.log(req)
    console.log('------------------')
    console.log('These are the request query parameters: ', req.query)
    res.send('My first ever api!')
});
// adding this comment for no reason
// pritesh sir given problem 
// finding missing no. in array
router.get('/missingarrayno', function (req, res){
    let arr = [1,2,3,5,6,7];
    function findnumber(arr){
    let n = arr.length;
    let sum=0;
    let missno;

    let total = ((n + 2) * (n + 1)) / 2;
    for (let i = 0; i < n; i++) {
      sum=sum+ arr[i];
      missno = total-sum;
    }
    return missno
}
console.log(findnumber(arr))
  res.send(findnumber(arr).toString())  
});
  // -write an api which gives the missing number in an array of integers starting from anywhere….e.g [33, 34, 35, 37, 38]: 36 is missing
  router.get("/sol2", function (req, res) {
    //logic : sum of n consecutive numbers is [ n * (first + last) / 2  ]..so get sum of all numbers in array. now take sum of n consecutive numbers.. n would be length+1 as 1 number is missing
    let arr= [33, 34, 35, 37, 38]
    let len= arr.length
  function sol2(arr){
    let total = 0;
    for (var i in arr) {
        total += arr[i];
    }
  
    let firstDigit= arr[0]
    let lastDigit= arr.pop()
    let consecutiveSum= (len + 1) * (firstDigit+ lastDigit ) / 2
    let missingNumber= consecutiveSum - total
    return missingNumber
}
   console.log(sol2(arr))
    res.send(sol2(arr).toString())
  });
 
// ===========================Problem - 1 =========================================//

router.get('/movies', function (req, res) {
    const picture = ["rand de basnasti", "the shining", "lord of the rings", "bartman begins"]

    res.send(picture)
});
// ===========================Problem - 2 & 3 =========================================//
router.get('/movie/:indexnumber', function (req, res) {
     const number = req.params.indexnumber
     const picture = ["rand de basnasti", "the shining", "lord of the rings", "bartman begins"]
    
    if (number < picture.length) {
       res.send(picture[number])
    } else {
       res.send("use a valid index")
    }
   //  res.send(picture[1]);
});
// ===========================Problem - 4 & 5 =========================================//
router.get('/films/:id', function (req, res) {
    const value = req.params.id;
    const arr = [
        {
            id: 1,
            name: "The Shining"
        },
        {
            id: 2,
            name: "Incendies"
        },
        {
            id: 3,
            name: "Rang de Basanti"
        },
        {
            id: 4,
            name: "Finding Nemo"
        },
    ]
     
    // if (value<arr.length) {
    //    res.send(arr[value])
    // } else {
    //       res.send("no such movie find")
    // }
     res.send(arr)
    });
    module.exports = router;





