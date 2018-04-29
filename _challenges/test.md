---
layout: post
title:  "Decipher The Seven Segments"
date:   2018-4-25
categories: jekyll update
---

[View this challenge at r/dailyprogrammer](https://www.reddit.com/r/dailyprogrammer/comments/8eger3/20180423_challenge_358_easy_decipher_the_seven/)

<details><summary>Challenge Description</summary>
<div markdown="1">
### Description
Today's challenge will be to create a program to decipher a seven segment display, commonly seen on many older electronic devices.

### Input Description
For this challenge, you will receive 3 lines of input, with each line being 27 characters long (representing 9 total numbers), with the digits spread across the 3 lines. Your job is to return the represented digits. You don't need to account for odd spacing or missing segments.

### Output Description
Your program should print the numbers contained in the display.

### Challenge Inputs
```
    _  _     _  _  _  _  _
  | _| _||_||_ |_   ||_||_|
  ||_  _|  | _||_|  ||_| _|

    _  _  _  _  _  _  _  _
|_| _| _||_|| ||_ |_| _||_
  | _| _||_||_| _||_||_  _|

 _  _  _  _  _  _  _  _  _
|_  _||_ |_| _|  ||_ | ||_|
 _||_ |_||_| _|  ||_||_||_|

 _  _        _  _  _  _  _
|_||_ |_|  || ||_ |_ |_| _|
 _| _|  |  ||_| _| _| _||_
```

### Challenge Outputs
```
123456789
433805825
526837608
954105592
```
</div>
</details>

### My Solution

#### JavaScript

```javascript
var rl = require('readline').createInterface({
  input: process.stdin
})

const nums = { // 7 segment chars for each digit
  ' _ | ||_|': 0,
  '     |  |': 1,
  ' _  _||_ ': 2,
  ' _  _| _|': 3,
  '   |_|  |': 4,
  ' _ |_  _|': 5,
  ' _ |_ |_|': 6,
  ' _   |  |': 7,
  ' _ |_||_|': 8,
  ' _ |_| _|': 9
}

new Promise(resolve => { // make groups of 4 lines
  const lines = [[]]
  let count = 0
  rl.on('line', line => {
    lines[count].push(line)
    if(lines[count].length == 4){
      count++
      lines[count] = []
    }
  })
  rl.on('close', () => resolve(lines))
})
  .then(inputs => inputs
    .map(lines => lines.slice(0, 3)) // remove the empty line after each input
    .map(lines => lines
      .map(line => line.concat('                           ').slice(0, 27))) // make every line the same length
    .forEach(line => {
      let digits = [0,1,2,3,4,5,6,7,8].map(i => // get all chars for each digit
          line[0].slice(i * 3, i * 3 + 3).concat(
          line[1].slice(i * 3, i * 3 + 3)).concat(
          line[2].slice(i * 3, i * 3 + 3)))
        .map(chars => nums[chars]) // get the number for each digit
      console.log(digits.reduce((a, x) => a + x, '')) // output the number
    }))
  .catch(e => console.error(e))
```
