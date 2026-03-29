# team-project-32-flora-M
team-project-32-flora created by GitHub Classroom


## demo video
https://youtu.be/Z_hMzYFIkqQ

## Second-hand Marketplace UofT - Flora

Note: This document is intended to be relatively short. Be concise and precise. Assume the reader has no prior knowledge of your application and is non-technical.

## Description

Our application is a second hand market place specifically designed for UofT students to reduce material waste and help students save money. Many UofT students have student loans and face a high cost of living in Toronto. These students either are looking for ways to buy necessities such as textbooks and supplies at a cheap price or sell used items to make some money back. Our application provides UofT students a platform to find the second items they want or find other students who want to buy items they own. We would only allow UofT student to access our website which will ensure the quality of the items posted on our application and ensure that students are supporting other students. Another benefit that our application bring to user is that since our application are only open to UofT students, our platform also allows to know and meet with students in higher year which is also a good way to communicate with other students.

## Key Features

Our application has some basic feature such as creating your account and logging into your account. Before any registration or login, user can see all the items in the market as well as looking at the poster's profile page. After logging in, user will be able to post their items on the market list with name of the item, price, some descriptions and possibly a picture, add their favourite items into their wishlist or buy the items right away. We also provide the feature of searching items but only searching by the item name. On top of these basic features, the way we handle buying items is that we will email the buyer the poster's email after buyer buys the item and we leave to them to decide on the place to trade and final price. Our website also includes a list of purchase history where user can see what they purchased. On top of that, we added some status for each post which will show up right beside their name if those status are applicable to the item. Our website also allows all users to rate other users so when users buy product, they can have an overview of the rating of the seller to decide whether they want to buy from the seller.

## Instructions
The application can be accessed at https://flora-marketplace.herokuapp.com/. 
Upon landing at the site you can see a list of second hand items that is posted on our website and all bought items will also be included which will have a status of sold. 
Without logged in:
- Clicking on an item directs you to details about the item, its owner and whether it is sold or not. 
- Clicking the "check profile" text beside the owner will redirect the page to the owner's profile page which you can see all their posts and other information about that user. 
- At any point, you can click the menu button at the top right corner to go back to the landing page which is named market place or login and register. 
- User can also search by item name when they are in the page with list of all postings and the user just need to simple enter the item name that they look for in the search bar and the list of postings on that page will change accordingly.
- We have pre-created account which we use for our testing purposes but users will certainly need to register and login in order to sell or buy any items.

While logged in: 
- If you are the owner of an item, you can go to the page with the item detail and delete it by clicking the delete button. 
- If you are not the owner of an unsold, you can add it to your wishlist by clicking the add wishlist button. The item will then showup in your profile’s wishlist section. Or you can buy that item by clicking the buy button. After that, the item will not be available to be bought or wishlisted by anyone. Then you will receive an email to the email you use to register that contains email of the poster so you can communicate with them directly. 
- You have access to a sell button in the top left of the landing page. Clicking it brings you to a form that allows you to enter name, price, descriptions and optionaly a picture of the item and after completion, the item will registered to be for sell. That item will also show up in your profile. 
- If you are looking at the page of an item that is sold, you will not be able to see the buyer unless you are the owner of the item and other user who is not the owner will just see that the item is sold.
- By accessing the menu button on the top right corner, you can also check your own profile or log out or a page with your purchase history. 
- We have several status tags beside items that tells whether the item is for sell or sold or if the item is posted by you or bought by you. These status are used to help user to determine whether an item is still for sell or not.
- Inside the bought history page, user can still click on the item that will direct them to the item page even after they bought it.
- We also include a rating system where all users can rate other users. 

## Development requirements

- First of all, you need to go to the release where we name it D2 and download the source code zip file which contains all of our source code. Since the project is base on flask and react. The python and NodeJs are required.

- According to your system, do “pip install -r requirement.txt” to install all requirement you need and figure out the conflict according to the instruction.

- For the backend, cd into the flask_part file and do `flask run` to run the backend part of the program.

- For the frontend, do cd into the frontend file and `npm install` to install the dependencies. 

- To run the application: do `npm start`. And the program will send you to the page.

## Deployment and Github Workflow
We deployed the frontend and backend seperately on two Heroku applications. We have two dockerized branches for the front and back end with instructions for how to build and run the Flask server and React app on Heroku. We chose to deploy with Heroku primarily due to the ease of maintenance since Heroku allows automatic re-deployment whenever we push to the dockerize branches on Github. Some changes to our code were required for the backend deployment. We changed the port used by the server to the environment port variable assigned by Heroku. We also added Flask Cors library to authorize front-back interactions. For the frontend, the API URI of the Heroku backend server is added infront of all Axios calls, which replaces proxy to the local host server we used during development. 

We have created the github project Issues to manage our project. At beginning of our project, our team discussed what feature we want to accomplish in each of our deliverable. We put our tasks in the github issues and assign the related group member to finish it. Even though that we divide up our features into several issues, but we all agree to divide up our team into smaller teams where we have people working on frontend and backend together and join the two when they are finished. So we have the convention that our backend programmer all commit to branch "peter" and all frontend commit to the main branch. We have this convention since we host regular meetings and we often meet together to write codes so instead of each working on a branch, it is more efficient to just ask our group member in person to review each other's code. After both parts are finished, we use merge the two into the develop branch to work on combine the frontend and back end together. In the develop branch, we work on type agreement and how our frontend and backend interact. While working on it, we see some simple additional feature that we could include so there are also some additional features added in the develop branch. After we put together the frontend and backend, Chiatzen worked on a code test locally and give feedback to us and let us revise the code. But all of us test our code locally first and after we finish all the tests, we merge it into the release branch and setup the release.

## Licenses
- We will choose to use a permissive license for our codebase because first that our code is not for a community or for a partner and we are not offended if others use or shares our code and we think that the purpose of writing up the code is for others to use them so we do not restrict other people accessing our code.
- However, we have to add a restriction onto our project that anyone who use or modify our codebase need to include a copyright notification that the copyright is owned by us and if any other people who see our codebase from them, they also need to include this copyright statement when they distribute our codebase.
- We need to force them to do so because most dependencies that we use such as python flask has the license called 3-Clause BSD license where it is still permissive as long as the copyright is mentioned so we need to adhere to this level of restriction so we decided to use 3-Clause BSD license as well.
- This will affect others who want to use or modify our codebase so that they need to include a copyright statement that says the copyright is owned by us but other than including this statement, they can freely use our codebase.
- We arrive to this decision because most of our dependencies use this license and we are not offended if any other people use or modify our codebase.
- Below is what they need to include when using, modifying or distributing our codebase:
- Copyright <2022> <UofT Flora Team>
- Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
- 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
- 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.


## Config settings
| Official student name | Official student email | config user.name | config user.email |
| :------------- |:-------------| :-------| :-----|
| Yifan zhao    | peter.yifan.zhao@gmail.com | peterZyf112358 | peter.yifan.zhao@gmail.com |
| Chu Kwan Louisa Lee | chukwan.lee@mail.utoronto.ca | 1.ryo001103 <br />2.Chu Kwan Louisa Lee | 1.suzu00101800@gmail.com <br />2.chukwan.lee@mail.utoronto.ca |
| Shilin Zhang | shilin.zhang@mail.utoronto.ca | shilinzhang-cs | shilin.zhang@mail.utoronto.ca |
| Kevin Cai | kev.cai@mail.utoronto.ca | kevicai | kev.cai@mail.utoronto.ca |
| Chiatzen Wang | chiatzen.wang@mail.utoronto.ca | ChiatzenW | tokashirizard@gmail.com|






















