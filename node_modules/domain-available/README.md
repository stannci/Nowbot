# node-domain-available
Check if a domain name is available using `freedomainapi.com`.
Requires an API key, you can get one [here](http://freedomainapi.com/).

## Installation
Install via [NPM](http://npmjs.org/):
```js
npm install domain-available
```

Domain-available uses `request`, so isn't available in the browser.

## Example

```js
var DomainAvailable = require("domain-available");
var domainChecker = new DomainAvailable("{freedomainapi.com API key}");

// Use a domain string or array of domains.
domainChecker.check(["google.com", "rpf.me", "heyheyletsgokinkachu.org"], function(err, url, available, body){

    // The first function is called after each domain is checked.
    if(available){
        console.log(url + " is available.");
    } else {
        console.log(url + " is not available.");
    }

}, function(results){

    // The second function is called after all domains have been checked.
    // Results is an array of responses from freedomainapi.
    var numAvailable = results.reduce(function(num, result){
        return result.available ? num + 1 : num;
    }, 0);

    console.log(numAvailable + " domain(s) available.");

});
```