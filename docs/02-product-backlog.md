![TRACE Logo](/docs/images/logo-wide-sm.png)

# CS 407 Product Backlog #

**TRACE** — A Digital Footprint Finder — Team 6


## Members ##

Charlene Orr, Cora Chan, Chris Cohen, Isabel Battaglioli, Jack McKernan, Jakob Molskness


## Problem Statement ##

With the increasing popularity of social media, e-commerce, and countless other services, the average person creates accounts on dozens of websites: a situation that can quickly become hard to keep track of. While existing tools like password managers solve the issue of storing these accounts, none are tailored to gaining an understanding of a user’s digital footprint. Our project seeks to provide users with a convenient account tracking solution and information security learning tool by automatically discovering and presenting a comprehensive view of their digital footprint.


## Background Information ##

### Problem ###

With TRACE, we are looking to solve two problems. One of these problems is helping the average Internet user discover and comprehend their online presence. A typical user will have numerous accounts across different platforms, which they may forget about. As more and more sites suffer data breaches, these old accounts can be a liability. To some, gaining an overview of these accounts or cleaning them up may be a boring task. For this reason, we have a second goal with TRACE. We also plan to create a service where a user can consolidate a selected group of accounts into one, shareable view that can be shared with family or friends. This more social aspect of our application helps to draw in other users, providing a service to them and helping to keep them safe online. Whether it is a user’s goal to grow their social media numbers or to simply stay aware of their presence online, TRACE will locate and display all user-associated accounts for them.

While there are a few websites currently available for users to have many of their public accounts listed on a shareable page, none are able to automatically discover accounts via username without compromising one’s security or privacy. On some sites, a user has to manually input their personal information in order for their accounts to be displayed. Other sites require users to manually enter their accounts which could be a challenge for users who may have dozens of accounts. Our project solves these additional issues by finding all accounts associated with a user’s digital footprint without requiring them to input anything more than a username.

### Audience ###

Our audience consists of anyone who has created an account with a service online. This is not restrictive to any age, profession, or gender of a user. Whether a user wants to manage their accounts activity or just wants to find out how many accounts they have created over the years; they will find our platform useful.

### Similar Systems / Limitations ###

One website similar to TRACE’s public profile page is LinkTree. The main way that our idea differs is that TRACE will locate accounts automatically, unlike LinkTree. LinkTree has a user manually enter in their accounts and then displays them in a very simple and plain format. We aim to provide our users a way to find out what accounts are tied to their usernames without manual input and then display the results in a visually pleasing manner. We also take inspiration from the command line tool [Sherlock](https://github.com/sherlock-project/sherlock), which automatically finds accounts. This tool, however, is command line based and displays results in a pragmatic but not very visually pleasing style.

Another application that is similar to TRACE is Deseat.me, which automatically searches for all accounts connected to a certain email address. However, Deseat.me requires full control of the user’s email account, posing a security risk many users may view as unacceptable. It also does not provide a way to display accounts publicly once they are found. TRACE improves on both of these, emphasizing the user’s privacy by storing data locally by default and searching publicly available information rather than the user’s private emails, and providing a way to publicly display accounts. Each of these set TRACE apart from Deseat.me and add significant value to our users’ experience.


## Functional Requirements ##


| ID  | Functional Requirement                                                                                                                                            | Hours |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
|     |                                                                                                                                                                   |       |
|     | **Site/Landing Page**                                                                                                                                             |       |
| 1   | As a user, I would like to navigate to a landing page so that I know what the service offers, how it handles privacy, and how to get started.                     | 4     |
| 2   | As a user, I would like the landing page to be easy to navigate and aesthetically pleasing.                                                                       | 4     |
| 3   | As a user, I would like to have a consistent theme and design throughout the application.                                                                         | 15    |
|     | **Search**                                                                                                                                                        |       |
| 4   | As a user, I would like to navigate to the account search page.                                                                                                   | 2     |
| 5   | As a user, I would like to add my most commonly used username to the search.                                                                                      | 2     |
| 6   | As a user, I would like to add additional usernames to the search.                                                                                                | 3     |
| 7   | As a user, I would like to remove a username from the search.                                                                                                     | 2     |
| 8   | As a user, I would like to add my first name so that prospective search results can be chosen with better confidence.                                             | 2     |
| 9   | As a user, I would like to add my last name so that prospective search results can be chosen with better confidence.                                              | 2     |
| 10  | As a user, I would like to add additional first names/nicknames.                                                                                                  | 2     |
| 11  | As a user, I would like to add additional last names/maiden names.                                                                                                | 2     |
| 12  | As a user, I would like to remove added first names.                                                                                                              | 2     |
| 13  | As a user, I would like to remove added last names.                                                                                                               | 2     |
| 14  | As a user, I would like to start the search.                                                                                                                      | 2     |
| 15  | As a user, I would like to view the progress of the search.                                                                                                       | 4     |
| 16  | As a user, I would like to cancel the search.                                                                                                                     | 2     |
| 17  | As a user, I would like to continue to use the site during the search (if time allows).                                                                           | 10    |
| 18  | As a user, I would like to search a subset of the supported sites and categories so that the search will take less time.                                          | 4     |
| 19  | As a user, I would like to view search results for accounts associated with my username(s).                                                                       | 15    |
| 20  | As a user, I would like to see accounts discovered on mainstream platforms.                                                                                       | 15    |
| 21  | As a user, I would like to see accounts discovered on smaller sites.                                                                                              | 15    |
| 22  | As a user, I would like to see the search results grouped by category (music, social, travel, etc.).                                                              | 5     |
| 23  | As a user, I would like to have the most confident matches highlighted so that I can spot them easily.                                                            | 6     |
| 24  | As a user, I would like to see the site name on each search result.                                                                                               | 2     |
| 25  | As a user, I would like to see the site logo on each search result for major sites.                                                                               | 15    |
| 26  | As a user, I would like to see the site logo on each search result for minor sites (if time allows).                                                              | 15    |
| 27  | As a user, I would like to add a custom logo if no logo exists (if time allows).                                                                                  | 5     |
|     | As a developer, I would like the custom logo to be cached so that online resources are not overused (if time allows).                                             | 4     |
| 28  | As a user, I would like to see the username associated with each search result.                                                                                   | 2     |
| 29  | As a user, I would like to see any first names that matched the search result.                                                                                    | 2     |
| 30  | As a user, I would like to see any last names that matched the search result.                                                                                     | 2     |
| 31  | As a user, I would like to click a link to visit the third-party profile associated with each search result.                                                      | 2     |
| 32  | As a user, I would like to claim an account that is mine.                                                                                                         | 2     |
| 33  | As a user, I would like to reject an account that is not mine.                                                                                                    | 2     |
| 34  | As a user, I would like to select multiple accounts to claim/reject.                                                                                              | 2     |
| 35  | As a user, I would like to select all accounts to claim/reject.                                                                                                   | 2     |
| 36  | As a user, I would like to clear the search results.                                                                                                              | 2     |
| 37  | As a user, I would like to re-run the search using the same parameters.                                                                                           | 2     |
| 38  | As a user, I would like to re-run the search with different parameters.                                                                                           | 2     |
| 39  | As a user, I would like to view sites that do not have a profile registered for my usernames so that I can register them and prevent impersonation by others.     | 5     |
| 40  | As a user, I would like to see a history of recent searches.                                                                                                      | 8     |
| 41  | As a user, I would like recent searches to be cached so that revisiting their results is quick (if time allows).                                                  | 8     |
|     | **Claimed Accounts**                                                                                                                                              |       |
| 42  | As a user, I would like to navigate to my account dashboard.                                                                                                      | 5     |
| 43  | As a user, I would like to see a list of accounts claimed in my collection.                                                                                       | 6     |
| 44  | As a user, I would like to see claimed accounts grouped by category (music, social, travel, etc.).                                                                | 4     |
| 45  | As a user, I would like to see claimed accounts ordered by date claimed.                                                                                          | 2     |
| 46  | As a user, I would like to see my claimed accounts laid out as nodes in a graph (if time allows).                                                                 | 15    |
| 47  | As a user, I would like to see edges/links between accounts in the graph display.                                                                                 | 15    |
| 48  | As a user, I would like to manually add an account to my collection.                                                                                              | 5     |
| 49  | As a user, I would like to request that the development team add automated search for an unsupported platform that I manually add.                                | 4     |
| 50  | As a user, I would like to remove an account from my claimed accounts.                                                                                            | 4     |
|     | **Servers & Sync**                                                                                                                                                |       |
| 51  | As a user, I would like to use the service without transmission of my data to TRACE servers.                                                                      | 6     |
| 52  | As a user, I would like to create an account on TRACE servers.                                                                                                    | 4     |
| 53  | As a user, I would like to opt-in to sync my data to my TRACE account.                                                                                            | 2     |
| 54  | As a user, I would like my claimed accounts to be synced to all signed-in devices if syncing has been enabled.                                                    | 15    |
| 55  | As a user, I would like synced data to be encrypted.                                                                                                              | 15    |
| 56  | As a user, I would like to disable sync.                                                                                                                          | 2     |
| 57  | As a user, I would like to delete synced data from TRACE servers.                                                                                                 | 6     |
| 58  | As a user, I would like to close my account safely and completely without persisting data in TRACE databases.                                                     | 6     |
|     | **Security**                                                                                                                                                      |       |
| 59  | As a user, I would like to opt-in to connection with Have I Been Pwnd so that I can check if my email has been compromised in any data breaches (if time allows). | 5     |
| 60  | As a user, I would like to receive notification if a newly added email appears in a breach (if time allows).                                                      | 5     |
| 61  | As a user, I would like to receive notification if an existing email appears in a new breach (if time allows).                                                    | 6     |
| 62  | As a user, I would like to have access to a privacy grade for each site so that I know what sites might put my information at risk.                               | 5     |
| 63  | As a user, I would like to have access to a brief overview of the Terms of Service for each site (if time allows).                                                | 5     |
|     | **Profile Page**                                                                                                                                                  |       |
| 64  | As a user, I would like to navigate to the profile editor.                                                                                                        | 2     |
| 65  | As a user, I would like to create a public-facing profile page hosted by TRACE.                                                                                   | 6     |
| 66  | As a user, I would like to add a title to the profile page.                                                                                                       | 2     |
| 67  | As a user, I would like to remove the title of the profile page.                                                                                                  | 2     |
| 68  | As a user, I would like to edit the title of the profile page.                                                                                                    | 2     |
| 69  | As a user, I would like to select accounts from my dashboard to display on my profile page.                                                                       | 4     |
| 70  | As a user, I would like to remove accounts that I have added to my profile page.                                                                                  | 2     |
| 71  | As a user, I would like to customize the URL that serves my profile page.                                                                                         | 6     |
| 72  | As a user, I would like to customize how accounts are displayed on my profile page.                                                                               | 15    |
| 73  | As a user, I would like to customize the theme of my profile page.                                                                                                | 5     |
| 74  | As a user, I would like to customize how elements are displayed on my profile page.                                                                               | 15    |
| 75  | As a user, I would like to create multiple profile pages with different accounts and customizations (if time allows).                                             | 15    |
| 76  | As a user, I would like to delete profile pages that I have created.                                                                                              | 2     |
| 77  | As a user, I would like to generate a shareable link for my profile page.                                                                                         | 4     |
| 78  | As a user, I would like to share my profile page to common social platforms.                                                                                      | 4     |
| 79  | As a user, I would like to password protect my profile page so that only those I allow can view it.                                                               | 8     |
| 80  | As a user, I would like to change the password associated with my profile page.                                                                                   | 5     |
|     | **Analytics**                                                                                                                                                     |       |
| 81  | As a user, I would like to navigate to the analytics dashboard for my page.                                                                                       | 2     |
| 82  | As a user, I would like to see the number of visitors over time.                                                                                                  | 2     |
| 83  | As a user, I would like to see a graph of the number of visitors over time.                                                                                       | 6     |
| 84  | As a user, I would like to see how many people click each link on my page.                                                                                        | 2     |
| 85  | As a user, I would like to see a graph of link clicks over time.                                                                                                  | 6     |
| 86  | As a user, I would like to select a date range so that I can view analytics for a specific time period.                                                           | 4     |
| 87  | As a user, I would like to see how many followers I have on accounts where applicable (if time allows).                                                           | 15    |
|     | **Browser Extension**                                                                                                                                             |       |
| 88  | As a user, I would like to receive a "new account detected" prompt when I sign into a new site.                                                                   | 15    |
| 89  | As a user, I would like to view the detected account information before accepting the prompt.                                                                     | 5     |
| 90  | As a user, I would like to edit the detected account information before accepting the prompt.                                                                     | 5     |
| 91  | As a user, I would like to dismiss the detection prompt.                                                                                                          | 2     |
| 92  | As a user, I would like to manually add an account while browsing a supported site.                                                                               | 5     |
| 93  | As a user, I would like to be able to generate a secure password to use for an account.                                                                           | 4     |
| 94  | As a user, I would like to be able to test the strength of my password.                                                                                           | 4     |
|     | **Development**                                                                                                                                                   |       |
| 95  | As a user, I would like to have access to an API so that I can access my collection programmatically (if time allows).                                            | 15    |
| 96  | As a developer, I would like to view documentation for the API.                                                                                                   | 5     |
| 97  | As a user, I would like to export my collection to JSON so that I can use it and safely back it up.                                                               | 4     |
| 98  | As a user, I would like to export my collection to CSV so that I can use it and safely back it up.                                                                | 4     |
| 99  | As a user, I would like a way to submit feedback or report other issues so that they can be fixed.                                                                | 6     |
| 100 | As a developer, I would like to have a well-tested and documented application.                                                                                    | 30    |


# Non-Functional Requirements #

### Performance ###

The website should meet the following minimum standards to ensure a positive user experience: 99.5% uptime, average response time less than 200 milliseconds on high-speed internet, and the ability to handle up to 1,000 concurrent requests per second.

### Security ###

If the user decides to synchronize their data with the backend, it will be end-to-end encrypted at rest and in transit. Public-facing URLs will also be randomly generated and difficult to guess by default. This will prevent anybody from viewing the page without having been sent the link. Authentication will be performed using an established and trusted third-party service, and passwords will not be stored in any form on our service. The website will include a trusted SSL/TLS certificate and will communicate over HTTPS.

### Usability ###

The website should be accessible and easy to navigate for an internet user with average experience using the web. It will not require any advanced technical knowledge. The website should also render properly on both mobile and desktop devices, as well as on most mainstream browsers.

### Hosting/Development ###

The website will be implemented on Amazon Web Services (AWS) using a serverless model built around S3, API Gateway, Lambda, and Cognito. Additionally, CouchDB and PouchDB will be used for remote and local storage respectively, in order to allow for local storage of user data and replication/syncing when requested by the user.

### Maintainability ###

Our project should follow common software engineering patterns to maintain a readable and well-formatted codebase. Before deploying any code, we will conduct peer reviews and confirm that tests are in place to verify the robustness of the app and service.

### Reliability ###

The codebase should have at least 80% line coverage under test to assert reasonable confidence that our system works as expected. The service will also be stress tested to ensure that it can scale to our needs. Uptimes and latencies will be monitored and recorded so that we can analyze trends and identify issues.
