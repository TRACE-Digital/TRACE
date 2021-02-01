# CS 407 Project Charter #

**TRACE** — A Digital Footprint Finder — Team 6


## Members ##

Charlene Orr, Cora Chan, Chris Cohen, Isabel Battaglioli, Jack McKernan, Jakob Molskness


## Problem Statement ##

With the increasing popularity of social media, e-commerce, and countless other services, the average person creates accounts on dozens of websites: a situation that can quickly become hard to keep track of. While existing tools like password managers solve the issue of storing these accounts, none are tailored to gaining an understanding of a user’s digital footprint. Our project seeks to provide users with a convenient account tracking solution and information security learning tool by automatically discovering and presenting a comprehensive view of their digital footprint.


## Project Objectives ##

- Develop a web application that discovers and displays an individual’s public profiles on common platforms like Airbnb, Facebook, and Spotify as well as smaller sites like Discogs or Letterboxd
- Provide a dashboard for users to manually add accounts that we cannot discover
- Create a local-only, privacy-focused version of the tool that will cater to users wary of syncing their personal information to our servers
- Securely encrypt and store account information for users who opt to sync their data
- Include the ability to create and customize a shareable, public-facing profile page that will appeal to those looking to spread their online presence with friends and followers
- Create a browser extension that prompts users to add accounts to their footprint as they log in
- Provide analytics for interactions with this public-facing page such as link click counts
- Include information security tools and notifications to help increase security awareness


## Stakeholders ##

- Users/Customers: Our target audience is Internet users, social media influencers, and small businesses, especially those worried about information security
- Software Developers: Isabel Battaglioli, Cora Chan, Chris Cohen, Jack McKernan, Jakob Molskness, Charlene Orr
- Project Owners: Isabel Battaglioli, Cora Chan, Chris Cohen, Jack McKernan, Jakob Molskness, Charlene Orr
- Development Manager: The Project Coordinator (GTA) working with us this semester will be our Development Manager


## Deliverables ##

- Develop a client-side (thick client) JavaScript application for discovering and storing accounts locally on the user’s device via the localStorage API, IndexedDB, or PouchDB
- Create a backend for syncing and storing data for users using Python/Flask/MongoDB, CouchDB, or Node/Express/MongoDB hosted on AWS
- Create a visually appealing dashboard for displaying and editing accounts using React
- Create an editor for customizing the shareable, public-facing profile page using React
- Create an analytics dashboard using React
- Create a browser extension with support for both Firefox and Chromium-based browsers via the WebExtensions API
- Integrate with information security tools like Have I Been Pwned via their API
- Securely encrypt and store user data at rest and in transit using modern encryption and hashing schemes


## CS 307 Projects ##

### Cora Chan, Chris Cohen ###

https://github.com/cohenchris/twistter-team25

For CS307, our team worked on the assigned Twistter project which was a social media website where users could make posts with related tags. Users could then customize their timeline by indicating which tags they wanted to see or hide. This project was aimed at reducing unwanted or irrelevant posts on social media websites. We used a ReactJS frontend, MySQL backend, and Flask API.

### Isabel Battaglioli ###

For CS 307, my team created an iOS app written in Swift with a Firebase database which allowed users to track new and current habits/other wellbeing information. The goal was to create an app that not only allowed users to create their own habits but also choose from predefined habits if they did not know where to start. Aside from habit tracking, users were able to keep daily journal entries, see data trends, import Apple health data and track their moods. The GitHub repository is currently private.

### Jack McKernan ###

https://github.com/symboxtra/hulaloop

For CS 307, my team created a C++ API and application for looping back and recording system audio on GNU/Linux, Mac, and Windows. The app provided a consistent, cross-platform interface to the various system-specific APIs that support loopback (WASAPI, PulseAudio, JACK, CoreAudio) and demonstrated use of this interface via a GUI and CLI capable of recording, playback, visualization, and export of audio. Our project included a cross-platform build system written in CMake, documentation generated from source code via Doxygen, a test suite using the Googletest framework, and cross-platform CI/CD via Jenkins.

### Jakob Molskness ###

For CS 307, my team created a HIPAA-compliant messaging app to allow doctors and patients to confidentially communicate sensitive healthcare information. Doctors and patients interacted via an iOS app, while hospital administrators were given a web portal to assign doctor-patient interactions and manage hospital personnel. Along with conversing, patients could schedule appointments with their doctors and set medication reminders within the app. The service was hosted on AWS and used MariaDB for persistence. The GitHub repository for this project is no longer available due to security issues it caused within AWS.

### Charlene Orr ###

https://github.com/charlorr/TwistR | https://github.com/charlorr/TwistR-Backend

For CS 307, my team created Twistr; a Twitter copycat with the added ability to follow topics. The backend was built using Django with a MySQL database, and the frontend was created using React. The app gave users the ability to write posts, tag their posts with topics, follow other users, and follow topics in order to control what posts they were seeing on their timeline. Both the database and the web app were hosted using Google Cloud.
