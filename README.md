![TRACE Logo](/docs/images/logo-wide-sm.png)

# TRACE #

A privacy-focused tool for discovering, tracking, and sharing your online accounts.

## Development ##

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash

nvm install --latest-npm    # This looks to .nvmrc for the version we use
nvm use                     # This switches your active version to the .nvmrc version

npm install
npm start
```

### Search Library ###

The `trace-search` library is installed as an unpacked NPM package from Git.

To update to the latest version, use (this will take a little bit):

```sh
npm upgrade trace-search
```

For more rapid testing and development of the search library, see
[linking locally](https://github.com/TRACE-Digital/TRACE-search#link-locally) in the `trace-search` repo.

### Descriptions ###

Public Profile: 
Our profile editor allows the user to choose which sites they want the public to view. The page is fully customizable, including different views, colors, and site order. A custom link is generated for each user and can be linked to any social media platform. 

## Credits ##

Created using [Black Dashboard React](https://demos.creative-tim.com/black-dashboard-react/#/documentation/tutorial)
