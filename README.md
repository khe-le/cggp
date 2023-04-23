# Code Generation with Genetic Programming

##### Authors: Khe Le & Sylvia Le

### Setting up
GP lib: https://github.com/subprotocol/genetic-js

- first install `npm`, then install `node`
- from command line run: `node ga_code.js`

### The code
##### About `ga_code.js`
This JS script uses genetic programming to build a snippet of code that tells if 1000 is even or odd. Basically, it learns to come up with this solution: 
```js
// How the solution looks like
if (1000 % 2 == 0) {
    console.log("even");
}
else {
    console.log("odd");
}

// The stringified solution
solution = 'if(1000%2==0){console.log("even");}else{console.log("odd");}'
tokens = ['1000','2','0','if','else',';','%','==','(',')','{','}','console.log("even")','console.log("odd")'];
maxTokensNum = 30;
```
### Functions

##### `genetic.seed`
- Return a string of code from the available tokens, for example, `if*(*1000*%*2*==*0*)*{*console.log("even")*;*}`
- Separate tokens by `*` for crossover and mutation purposes, assuming we won't use asterisks in our code
- It's actually better to represent it with a list: `['if','(','1000','%','2','==','0',')','{','console.log("even")',';','}']` instead of string
- But the genetic library messes up with list as input
- Number of tokens used is limited to `maxTokensNum`
- Length of each individual code string can vary


##### `genetic.crossover`
- Return 2 strings of code (with `*`) after performing crossover
- How: turn the 2 original strings into lists to easily perform crossover (use `.split('*')`)


##### `genetic.mutate`
- Return 1 string of code (with `*`) ater performing mutation
- How: turn the original string into a list to easily perform mutation. Pick a random token in available tokens list to replace a random token in code string


##### `genetic.fitness`
- Input code string with `*` for crossover and mutation purposes: for example, `'if*else*{*(*;'`
- Remove `*` with `replaceAll('*', '')`
- Evaluate code string and solution with `eval()` and compare results
- If code is evaluable (could be `undefined`): `fitness = 1000`
- If code is evaluable and gives the same evaluated result as solution: `fitness = 1000` plus add x points if code has x fewer characters than solution. Likewise, take away x points from fitness if it has x more characters.
- Else if code is inevaluable: `fitness = 0`

Current problems: unable to compare two eval() values, for example:
- `eval('console.log("even")') == eval('console.log("odd")')` is `true`
- `eval(';') == eval('console.log("even")')` is `true`
- Solve this by reviewing [JS Equality comparisons](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)


##### `genetic.generation`
- Return `false` to keep the program going
- Return `true` to terminate it once we find the right solution
- Easy to implement, but we need to solve the `eval()` problem above
- `pop[0]` return an object, for example `{fitness: 1000, entity: 'if*else*{*(*;'}`


##### `genetic.notification`
- Log every generation with its best individual

##### `genetic.evolve`
- Set GP parameters and variables
- Limit number of tokens used in the code with `maxTokensNum`