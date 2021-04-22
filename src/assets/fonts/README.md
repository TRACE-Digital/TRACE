## Generating `font-awesome.json` ##

Could have used https://github.com/soul-wish/font-awesome-v5-icons instead of generating our own, but this works fine for now.

1. Navigate to https://fontawesome.com/cheatsheet/free/regular.
1. Run the following in the developer console:

```javascript
function addNames(type, results) {
    console.log(`Collecting ${type} icon names...`);

    // Grab all the names
    document.getElementsByClassName('icon-name').forEach(elem => {
        let name = elem.innerText.trim();
        let index = name.replace('-', ' ');

        if (index in results) {
            index = `${type} ${index}`;
        }

        console.assert(!(index in results), `Duplicate name '${index}'!`);
        results[index] = `fa${type[0]} fa-${name}`;
    });
}

// Navigate to the solid page
document.querySelectorAll('a[href$="cheatsheet/free/solid"]')[0].click();
setTimeout(() => {
    let results = {};

    addNames('solid', results);

    // Navigate to the regular
    document.querySelectorAll('a[href$="cheatsheet/free/regular"]')[0].click();
    setTimeout(() => {
        addNames('regular', results);

        // Navigate to the brands
        document.querySelectorAll('a[href$="cheatsheet/free/brands"]')[0].click();
        setTimeout(() => {
            addNames('brands', results);

            // Dump the final thing formatted for TypeScript
            console.log(results);
            console.log(JSON.stringify(results));
        }, 3000);
    }, 3000);
}, 3000);
```
