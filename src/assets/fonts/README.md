## Generating `font-awesome.json` ##

Could have used https://github.com/soul-wish/font-awesome-v5-icons instead of generating our own, but this works fine for now.

1. Navigate to https://fontawesome.com/cheatsheet/free/regular.
1. Run the following in the developer console:

```javascript
// Navigate to the regular page
document.querySelectorAll('a[href$="cheatsheet/free/regular"]')[0].click();

// Wait a bit
setTimeout(() => {
    let results = {};

    console.log('Collecting regular icon names...');

    // Grab all the names
    document.getElementsByClassName('icon-name').forEach(elem => {
        let name = elem.innerText.trim();
        name = name.replace('-', ' ');
        console.assert(!(name in results), `Duplicate name '${name}'!`);
        results[name] = `far fa-${elem.innerText.trim()}`;
    });

    // Navigate to the brands
    document.querySelectorAll('a[href$="cheatsheet/free/brands"]')[0].click();

    // Wait a bit
    setTimeout(() => {
        console.log('Collecting brand icon names...');

        document.getElementsByClassName('icon-name').forEach(elem => {
            let name = elem.innerText.trim();
            name = name.replace('-', ' ');
            console.assert(!(name in results), `Duplicate name '${name}'!`);
            results[name] = `fab fa-${elem.innerText.trim()}`;
        });

        // Dump the final thing formatted for TypeScript
        console.log(results);
        console.log(JSON.stringify(results));
    }, 3000);
}, 3000);
```
