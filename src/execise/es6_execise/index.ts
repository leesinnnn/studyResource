const a = {
  [Symbol.iterator]() {
    let index = 0
    return {
      next() {
        index++;
        if (index > 10) {
          return { done: true }
        } else {
          return {
            value: index
          }
        }
      }
    }
    
  }
}

console.log(Object.keys(a))

// for (const key of a) {
//   console.log(key)
// }


// const b = ['1', '2', '3']
// const iterator = b[Symbol.iterator]()
// console.log(iterator.next())
// console.log(iterator.next())
// console.log(iterator.next())
// console.log(iterator.next())
// console.log(iterator.next())

// function* c() {
//   yield 1;
//   yield 2;
//   yield 3;
// }

// console.log([...c()])